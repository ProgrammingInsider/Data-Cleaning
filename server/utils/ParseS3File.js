import s3 from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import { BadRequestError } from "../errors/index.js";
import { Readable } from "stream";

export const ParseS3File = async ({ fileKey, numOfRows = Infinity }) => {
  if (!fileKey) {
    throw new BadRequestError("File key is required.");
  }

  try {
    // Fetch the file from S3
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      })
    );
    
    // Check the content length
    if (response.ContentLength === 0) {
      throw new BadRequestError("The file is empty.");
    }
    
    const stream = response.Body;
    // Convert the S3 file stream to a buffer
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
      
    const fileBuffer = Buffer.concat(chunks);

    const fileExt = fileKey.split(".").pop().toLowerCase();

    // Parse based on file type
    let parsedData;
    if (fileExt === "csv") {
      parsedData = await parseCSV(fileBuffer, numOfRows);
    } else if (["xls", "xlsx"].includes(fileExt)) {
      parsedData = parseExcel(fileBuffer, numOfRows);
    } else if (fileExt === "json") {
      parsedData = JSON.parse(fileBuffer.toString("utf-8"));
    } else {
      parsedData = fileBuffer.toString("utf-8");
    }

    return parsedData;
  } catch (error) {
    console.error("Failed to read or parse the file from S3:", error);
    throw new BadRequestError("Failed to read or parse the file.");
  }
};

// Helper function to convert numeric strings to numbers and replace empty strings with null
const convertNumbers = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string") {
        const trimmedValue = value.trim();
        
        // Replace empty string with null
        if (trimmedValue === "") {
          return [key, null];
        }
        
        // Convert numeric strings to numbers
        if (trimmedValue.match(/^-?\d+(\.\d+)?$/)) {
          return [key, Number(trimmedValue)];
        }
      }
      return [key, value];
    })
  );
};


const parseCSV = (fileBuffer, numOfRows) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(fileBuffer.toString("utf-8"));
    let rowCount = 0;
    
    // Instead of processing the entire file, we limit row count
    stream
      .pipe(csv())
      .on("data", (data) => {
        if (rowCount < numOfRows) {
          const rowWithIndex = { ...convertNumbers(data), originalRowIndex: rowCount };
          results.push(rowWithIndex);
          // results.push(convertNumbers(data));
          rowCount++;
        } else {
          stream.destroy();
          resolve(results);
        }
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

const parseExcel = (fileBuffer, numOfRows) => {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetNames = workbook.SheetNames;

  return sheetNames.reduce((sheets, sheetName) => {
    let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    let parsedData = [];
    let rowCount = 0;
    
    const headers = sheetData[0]; // first row as header

    for (let i = 1; i < sheetData.length; i++) {
      if (numOfRows !== Infinity && rowCount >= numOfRows) break;

      const row = convertNumbers(sheetData[i]);
      const rowWithHeaders = headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {});

      rowWithHeaders.originalRowIndex = rowCount;
      parsedData.push(rowWithHeaders);
      rowCount++;
    }

    sheets[sheetName] = parsedData;

    return sheets;
  }, {});
};


// Helper function to parse CSV
// const parseCSV = (fileBuffer, numOfRows) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     const stream = Readable.from(fileBuffer.toString("utf-8"));
//     stream
//       .pipe(csv())
//       // .on("data", (data) => results.push(convertNumbers(data)))
//       .on("data", (data) => {
//         if (results.length < numOfRows) {
//           results.push(convertNumbers(data));
//         } else {
//           stream.pause();
//           resolve(results);
//         }
//       })
//       .on("end", () => resolve(results))
//       .on("error", (err) => reject(err));
//   });
// };


// Helper function to parse Excel
// const parseExcel = (fileBuffer) => {
  
//   const workbook = XLSX.read(fileBuffer, { type: "buffer" });

//   const sheetNames = workbook.SheetNames;
//   return sheetNames.reduce((sheets, sheetName) => {

//     let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     // Convert numeric strings to numbers
//     sheetData = sheetData.map(convertNumbers);

//     sheetData = sheetData.slice(0, numOfRows);

//     sheets[sheetName] = sheetData;

//     return sheets;
//   }, {});

// };

