"use client"

import { DefaultLegendContentProps, LabelList, Legend, Pie, PieChart } from "recharts"
import {IssueDistributionType} from '@/utils/types'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

function PieChartComponent({ IssueDistribution }: { IssueDistribution: IssueDistributionType[] }) {
  const chartConfig = IssueDistribution.reduce((config, issue) => {
    config[issue.IssueType] = {
      label: issue.IssueType,
      color: issue.fill
    };
    return config;
  }, {} as ChartConfig);

  const renderLegend = (props: DefaultLegendContentProps) => {
    const { payload } = props;
    return (
      <ul className="flex flex-row flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issue Distribution</CardTitle>
        <CardDescription>Current data quality issues by type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] [&_.recharts-text]:fill-background"
        >
          <PieChart className="w-full">
            <ChartTooltip content={<ChartTooltipContent nameKey="IssueType" hideLabel />} />
            <Pie data={IssueDistribution} dataKey="IssueDetected" nameKey="IssueType" className="w-full">
              
              <LabelList 
                dataKey="IssueDetected" 
                position="inside" 
                fill="black" 
                stroke="white" 
                strokeWidth={0} 
                fontSize={12} 
                fontWeight="bold"
              />

            </Pie>
            {/* Display Legend at Bottom with Color Indicators and Issue Type Names */}
            <Legend content={renderLegend} verticalAlign="bottom" align="center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChartComponent;

