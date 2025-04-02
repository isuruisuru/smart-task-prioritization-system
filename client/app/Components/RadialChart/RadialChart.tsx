"use client"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { useTasks } from "@/context/taskContext"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig: ChartConfig = {
  desktop: {
    label: "Completed",
    icon: TrendingUp,
    color: "#8bc389",
  },
  mobile: {
    label: "Pending",
    icon: TrendingUp,
    color: "#eb4e31",
  },
} satisfies ChartConfig;

export function RadialChart() {
  const { tasks, completedTasks, activeTasks } = useTasks();
  const tasksTotal = tasks.length;

  const chartData = [
    {
        pending: activeTasks.length,
        completed: completedTasks.length
    }
  ];

  return (
    <Card className="flex flex-col p-3">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Completed vs Pending Tasks</CardTitle>
        <CardDescription>Tasks Completion Status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] p-0 m-0"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}

          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {tasksTotal}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="completed"
              stackId="a"
              cornerRadius={5}
              fill="hsl(220, 90%, 55%)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="pending"
              fill="hsl(120, 90%, 55%)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="items-center gap-2 font-medium leading-none">
          Task completion improved by <span className="text-[#2669F4] inline-block">{Math.round((completedTasks.length/tasksTotal)*100)}%</span> this month{" "}
        </div>
        <div className="leading-none text-muted-foreground">
          Analysis based on tasks completed in the last 30 days
        </div>
      </CardFooter>
    </Card>
  )
}

export default RadialChart