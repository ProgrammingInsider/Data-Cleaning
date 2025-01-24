'use client'

import BarChartComponent from '@/components/BarChart'
import IssueTable from '@/components/IssueTable'
import HallowPieChartComponent from '@/components/HallowPieChart'
import PieChartComponent from '@/components/PieChart'
import {IssueDistributionType, ColumnProblem, ErrorDetectionType, Props} from '@/utils/types'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import { CiWarning } from "react-icons/ci";
import { PiWarningCircleLight } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import Link from 'next/link'
import ExportDropdown from '@/components/ExportDropDown'
import { ErrorReport} from '@/utils/fileActions'
import { useEffect } from 'react'


const errorDetection: ErrorDetectionType[] = [
  {
      "DataInconsistency": "Missing Fields",
      "DetectionStatus": 1,
      "ImpactLevel": "High",
      "Questions": "Are there any missing fields in the dataset?",
      "HowManyDetected": 15,
      "AffectedPercentage": "12.5%",
      "FieldColumnName": [
          "Column_4",
          "Column_10",
          "Column_14",
          "Column_24",
          "Column_27",
          "Column_32",
          "Column_34",
          "Column_36",
          "Column_44",
          "Column_50",
          "Column_56",
          "Column_60",
          "Column_62",
          "Column_66",
          "Column_70"
      ],
      "RecommendedAction": "Identify and fill in the missing values."
  },
  {
      "DataInconsistency": "Duplicates",
      "DetectionStatus": 0,
      "ImpactLevel": "Medium",
      "Questions": "Are there any duplicate records in the dataset?",
      "HowManyDetected": 0,
      "AffectedPercentage": "0%",
      "FieldColumnName": [],
      "RecommendedAction": "No action needed, no duplicates found."
  },
  {
      "DataInconsistency": "Formatting Errors",
      "DetectionStatus": 1,
      "ImpactLevel": "High",
      "Questions": "Are there any formatting errors in the data entries?",
      "HowManyDetected": 20,
      "AffectedPercentage": "16.67%",
      "FieldColumnName": [
          "Column_3",
          "Column_7",
          "Column_8",
          "Column_9",
          "Column_11",
          "Column_13",
          "Column_19",
          "Column_21",
          "Column_22",
          "Column_25",
          "Column_26",
          "Column_29",
          "Column_30",
          "Column_31",
          "Column_33",
          "Column_35",
          "Column_39",
          "Column_41",
          "Column_42",
          "Column_46"
      ],
      "RecommendedAction": "Review and correct the format of affected entries."
  },
  {
      "DataInconsistency": "Invalid Values",
      "DetectionStatus": 1,
      "ImpactLevel": "High",
      "Questions": "Are there any invalid values present in the dataset?",
      "HowManyDetected": 18,
      "AffectedPercentage": "15%",
      "FieldColumnName": [
          "Column_2",
          "Column_4",
          "Column_6",
          "Column_10",
          "Column_12",
          "Column_14",
          "Column_17",
          "Column_23",
          "Column_28",
          "Column_38",
          "Column_40",
          "Column_45",
          "Column_47",
          "Column_48",
          "Column_49",
          "Column_51",
          "Column_52",
          "Column_53"
      ],
      "RecommendedAction": "Validate and replace invalid values with appropriate ones."
  },
  {
      "DataInconsistency": "Null Values",
      "DetectionStatus": 1,
      "ImpactLevel": "Medium",
      "Questions": "Are there any null values in the dataset?",
      "HowManyDetected": 25,
      "AffectedPercentage": "20.83%",
      "FieldColumnName": [
          "Column_1",
          "Column_4",
          "Column_5",
          "Column_6",
          "Column_8",
          "Column_9",
          "Column_10",
          "Column_12",
          "Column_13",
          "Column_15",
          "Column_16",
          "Column_18",
          "Column_19",
          "Column_20",
          "Column_21",
          "Column_22",
          "Column_23",
          "Column_24",
          "Column_25",
          "Column_26"
      ],
      "RecommendedAction": "Identify and handle null values appropriately."
  },
  {
      "DataInconsistency": "Outliers",
      "DetectionStatus": 0,
      "ImpactLevel": "Low",
      "Questions": "Are there any outlier values that deviate significantly from other observations?",
      "HowManyDetected": 0,
      "AffectedPercentage": "0%",
      "FieldColumnName": [],
      "RecommendedAction": "No action needed, no outliers found."
  },
  {
      "DataInconsistency": "Data Type Mismatch",
      "DetectionStatus": 1,
      "ImpactLevel": "High",
      "Questions": "Do all columns have consistent data types?",
      "HowManyDetected": 10,
      "AffectedPercentage": "8.33%",
      "FieldColumnName": [
          "Column_1",
          "Column_3",
          "Column_4",
          "Column_5",
          "Column_6",
          "Column_8",
          "Column_9",
          "Column_10",
          "Column_11",
          "Column_12"
      ],
      "RecommendedAction": "Check for consistency in data types across the specified columns."
  }
]

const colorMapping: Record<string, string> = {
  "Missing Fields": "var(--color-missing-fields)",
  "Duplicates": "var(--color-duplicates)",
  "Formatting Errors": "var(--color-formatting-errors)",
  "Invalid Values": "var(--color-invalid-values)",
  "Null Values": "var(--color-null-values)",
  "Outliers": "var(--color-outliers)",
  "Data Type Mismatch": "var(--color-data-type-mismatch)"
};


const ErrorDetection = ({params}:Props) => {
  
  useEffect(() => {
    const fetchData = async () => {
      const fileId = params?.fileid;
      if (fileId) {
        console.log(await ErrorReport(fileId));
      } else {
        console.error("fileId not provided in params");
      }
    };
    fetchData();
  }, [params]);
  
  
  
  const IssueDistribution:IssueDistributionType[] = errorDetection
  .filter(issue => issue.DetectionStatus === 1) 
  .map(issue => ({
    IssueType: issue.DataInconsistency,
    IssueDetected: issue.HowManyDetected,
    fill: colorMapping[issue.DataInconsistency] || "var(--color-default)" 
  }));

  const columnProblemCount = errorDetection.reduce<ColumnProblem[]>((acc, item) => {
    item.FieldColumnName.forEach(column => {
      // Check if the column already exists in the accumulator array
      const columnEntry = acc.find(entry => entry.column === column);
      if (columnEntry) {
        columnEntry.numberOfProblems++;
      } else {
        acc.push({ column, numberOfProblems: 1 });
      }
    });
    return acc;
  }, []);
  
  const sortedColumnProblemCount = columnProblemCount.sort((a, b) => {
    const columnA = parseInt(a.column.split('_')[1], 10); 
    const columnB = parseInt(b.column.split('_')[1], 10); 
    return columnA - columnB; 
  });

  // This will calculate the total issues and store it in `totalIssues`.
  const totalIssues = errorDetection
  .filter(issue => issue.DetectionStatus === 1)
  .reduce((acc, issue) => acc + issue.HowManyDetected, 0); 

  // Count the number of high-impact issues
  const highImpactCount = errorDetection.filter(
    (issue) => issue.ImpactLevel === "High"
  ).length;

  // Calculate total percentage of issues detected
  const totalPercentage = errorDetection
  .filter(issue => issue.DetectionStatus === 1)
  .reduce((acc, issue) => acc + parseFloat(issue.AffectedPercentage.replace('%', '')), 0);

  // Calculate total distinct columns affected
  const allColumns = errorDetection
  .filter(issue => issue.DetectionStatus === 1)
  .flatMap(issue => issue.FieldColumnName);

  const totalDistinctColumns = new Set(allColumns).size;

  // Debugging purposes: Log the results
  console.log("Total Percentage:", totalPercentage);
  console.log("Total Distinct Columns:", totalDistinctColumns);



  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
        <h1 className="text-2xl font-bold mb-3">Error Detection Dashboard</h1>
        <div id="reportContent" className='flex flex-col gap-5'>  
          <Card className='w-full h-full grid place-content-center gap-4 items-center lg:grid-cols-2'>
            <CardHeader className='col-span-1'>
              <CardTitle className='text-4xl font-bold mb-3'>Trip.xlsx</CardTitle>
              <CardDescription className='mb-48'>Monitor and analyze your data quality metrics in real-time.</CardDescription>
              <CardDescription className='font-normal para text-sm'><b>Summary:</b> The current data quality score is 75%, with 88 total issues detected across 5 categories. 4 high-impact issues require immediate attention. 6 columns are affected by quality issues, with the most problematic being Column_4 (4 issues).</CardDescription>
            </CardHeader>
            <CardContent className='col-span-1'>
              <HallowPieChartComponent totalPercentage={totalPercentage}/>
            </CardContent>
          </Card>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Card className='w-full sectionBg border-0'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Total Issues</CardTitle>
                <CardDescription><CiWarning className='text-[#E8920E] text-base' /></CardDescription>
              </CardHeader>
              <CardContent>
                <b>{totalIssues}</b>
              </CardContent>
              <CardFooter>
                <CardDescription>Across 5 categories</CardDescription>
              </CardFooter>
            </Card>

            <Card className='w-full sectionBg border-0'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>High Impact</CardTitle>
                <CardDescription><PiWarningCircleLight className='text-[#F54439] text-base' /></CardDescription>
              </CardHeader>
              <CardContent>
                <b>{highImpactCount}</b>
              </CardContent>
              <CardFooter>
                <CardDescription>Requiring immediate attention</CardDescription>
              </CardFooter>
            </Card>

            <Card className='w-full sectionBg border-0'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Affected Columns</CardTitle>
                <CardDescription><IoCloseCircleOutline className='text-[#56BCEA] text-base' /></CardDescription>
              </CardHeader>
              <CardContent>
                <b>{totalDistinctColumns}</b>
              </CardContent>
              <CardFooter>
                <CardDescription>With quality issues</CardDescription>
              </CardFooter>
            </Card>
          </div>
          <div className='flex flex-col xl:flex-col gap-5'>
            <PieChartComponent IssueDistribution={IssueDistribution}/>
            <BarChartComponent columnProblemCount={sortedColumnProblemCount}/>
          </div>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Critical Issues</CardTitle>
              <CardDescription>Detailed breakdown of data quality issues</CardDescription>
            </CardHeader>
            <CardContent>
              <IssueTable errorDetection={errorDetection} />
            </CardContent>
          </Card>
          <div className='flex justify-end gap-5'>
            <Button
              asChild
              className='secondaryBg transition-all duration-300 hover:brightness-110 active:brightness-90'
              style={{
                background: 'linear-gradient(to right, #59C2F7, #4D56C2)',
                color: '#FFFFFF',
              }}
              data-ignore="true"
            >
              <Link href='#'><BsStars />Clean Data</Link>
            </Button>
            <ExportDropdown/>
            {/* <div className="mt-5">
              <ExportToPDF exportContentId="reportContent" fileName="ErrorDetectionReport" />
            </div> */}
          </div>

        </div>
        
        
    </div>
  )
}

export default ErrorDetection