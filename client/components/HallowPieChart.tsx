
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


function HallowPieChartComponent({ totalPercentage }: { totalPercentage: number }) {

  console.log("totalPercentage ",totalPercentage);
  
  
  const chartData = [
    { browser: "quality", visitors: (100 - totalPercentage), fill: "#30D158" },
    { browser: "problem", visitors: totalPercentage, fill: "#2C2C2E" },
  ];
  
  const chartConfig = {
    quality: {
      label: "quality",
      color: "#30D158",
    },
    problem: {
      label: "problem",
      color: "var(--color-safari)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-0">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {parseFloat((100 - totalPercentage).toFixed(2))}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Quality Score
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default HallowPieChartComponent;
