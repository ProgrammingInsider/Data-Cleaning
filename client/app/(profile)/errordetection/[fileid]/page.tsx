'use client'

import BarChartComponent from '@/components/BarChart'
import IssueTable from '@/components/IssueTable'
import HallowPieChartComponent from '@/components/HallowPieChart'
import PieChartComponent from '@/components/PieChart'
import {IssueDistributionType, ColumnProblem, ErrorDetectionType, Props, fileDetailsType} from '@/utils/types'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import { CiWarning } from "react-icons/ci";
import { PiWarningCircleLight } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import Link from 'next/link'
import ExportDropdown from '@/components/ExportDropDown'
import { ErrorReport} from '@/utils/fileActions'
import { useEffect, useState } from 'react'


const colorMapping: Record<string, string> = {
  "Missing Fields": "var(--color-missing-fields)",
  "Duplicates": "var(--color-duplicates)",
  "Formatting Errors": "var(--color-formatting-errors)",
  "Invalid Values": "var(--color-invalid-values)",
  "Null Values": "var(--color-null-values)",
  "Outliers": "var(--color-outliers)",
  "Data Type Mismatch": "var(--color-data-type-mismatch)"
};

interface computeDataType {
  issueDistribution: IssueDistributionType[],
  sortedColumnProblemCount: ColumnProblem[],
  totalIssues: number,
  highImpactCount: number,
  totalPercentage: number,
  totalDistinctColumns: number,
}

const ErrorDetection = ({params}:Props) => {
  const [errorDetection, setErrorDetection] = useState<ErrorDetectionType[]>([]);
  const [fileDetails, setFileDetails] = useState<fileDetailsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [computedData, setComputedData] = useState<computeDataType>({
    issueDistribution: [],
    sortedColumnProblemCount: [],
    totalIssues: 0,
    highImpactCount: 0,
    totalPercentage: 0,
    totalDistinctColumns: 0,
  });
  const [fileId, setFileId] = useState<string>("");

  useEffect(() => {
    const fetchErrorReport = async () => {
      const fileId = await params;
      const { fileid } = fileId;

      console.log("fileid ",fileid);
      
      
      if(fileid){
        setFileId(fileid);

        try {
          const result = await ErrorReport(fileid);
          
          if (result.success) {
            setFileDetails(result.data.fileDetails);
            setErrorDetection(result.data.detectionResults);
          } else {
            console.error('Error in processing file:', result.message);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchErrorReport();
  
  }, [params]);

  useEffect(() => {
    const computeValues = () => {
      const issueDistribution = errorDetection
        .filter((issue) => issue.DetectionStatus === 1)
        .filter((issue) => issue.HowManyDetected > 0)
        .map((issue) => ({
          IssueType: issue.DataInconsistency,
          IssueDetected: issue.HowManyDetected,
          fill: colorMapping[issue.DataInconsistency] || 'var(--color-default)',
        }));

      const columnProblemCount = errorDetection
      .filter((issue) => issue.DetectionStatus === 1)
      .filter((issue) => issue.HowManyDetected > 0)
      .reduce<ColumnProblem[]>((acc, item) => {
        item.FieldColumnName.forEach((column) => {
          const columnEntry = acc.find((entry) => entry.column === column);
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

      const totalIssues = errorDetection
        .filter((issue) => issue.DetectionStatus === 1)
        .filter((issue) => issue.HowManyDetected > 0)
        .reduce((acc, issue) => acc + issue.HowManyDetected, 0);

      const highImpactCount = errorDetection
        .filter((issue) => issue.HowManyDetected > 0)
        .filter((issue) => issue.ImpactLevel === 'High').length;

      const totalPercentage = errorDetection
        .filter((issue) => issue.DetectionStatus === 1)
        .filter((issue) => issue.HowManyDetected > 0)
        .reduce((acc, issue) => acc + parseFloat(issue.AffectedPercentage.replace('%', '')), 0);

        // Calculate total distinct columns affected
        const allColumns = errorDetection
        .filter(issue => issue.DetectionStatus === 1)
        .flatMap(issue => issue.FieldColumnName);

        const totalDistinctColumns = new Set(allColumns).size;

        return {
          issueDistribution,
          sortedColumnProblemCount,
          totalIssues,
          highImpactCount,
          totalPercentage,
          totalDistinctColumns,
        };
    };

    if (errorDetection.length > 0) {
      setComputedData(computeValues());
    }
  }, [errorDetection]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("fileId ",fileId);
  console.log("computedData ",computedData);
  console.log("Error Detection ",errorDetection);

  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
        <h1 className="text-2xl font-bold mb-3">Error Detection Dashboard</h1>
        <div id="reportContent" className='flex flex-col gap-5'>  
          <Card className='w-full h-full grid place-content-center gap-4 items-center lg:grid-cols-2'>
            <CardHeader className='col-span-1'>
              <CardTitle className='text-4xl font-bold mb-3'>{fileDetails[0]?.original_name || "File Name"}</CardTitle>
              <CardDescription className='mb-48'>{fileDetails[0]?.description || "No description available for this file."}</CardDescription>
              <CardDescription className='font-normal para text-sm'><b>Summary:</b> The current data quality score is {(100 - computedData.totalPercentage)}%, with {computedData.totalIssues} total issues detected across {computedData.totalDistinctColumns} unique columns. Approximately {computedData.totalPercentage.toFixed(2)}% of the dataset is affected. There are {computedData.highImpactCount} high-impact issues that require immediate attention.</CardDescription>
            </CardHeader>
            <CardContent className='col-span-1'>
              <HallowPieChartComponent totalPercentage={computedData.totalPercentage}/>
            </CardContent>
          </Card>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Card className='w-full sectionBg border-0'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Total Issues</CardTitle>
                <CardDescription><CiWarning className='text-[#E8920E] text-base' /></CardDescription>
              </CardHeader>
              <CardContent>
                <b>{computedData.totalIssues}</b>
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
                <b>{computedData.highImpactCount}</b>
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
                <b>{computedData.totalDistinctColumns}</b>
              </CardContent>
              <CardFooter>
                <CardDescription>With quality issues</CardDescription>
              </CardFooter>
            </Card>
          </div>
          <div className='flex flex-col xl:flex-col gap-5'>
            <PieChartComponent IssueDistribution={computedData.issueDistribution}/>
            <BarChartComponent columnProblemCount={computedData.sortedColumnProblemCount}/>
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
