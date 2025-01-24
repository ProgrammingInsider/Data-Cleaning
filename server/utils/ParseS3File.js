import s3 from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import { BadRequestError } from "../errors/index.js";
import { Readable } from "stream";

export const ParseS3File = async ({ fileKey }) => {
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
      parsedData = await parseCSV(fileBuffer);
    } else if (["xls", "xlsx"].includes(fileExt)) {
      parsedData = parseExcel(fileBuffer);
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

// Helper function to parse CSV
const parseCSV = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(fileBuffer.toString("utf-8"));
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// Helper function to parse Excel
const parseExcel = (fileBuffer) => {
  
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const sheetNames = workbook.SheetNames;
  return sheetNames.reduce((sheets, sheetName) => {

    sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return sheets;
  }, {});

};