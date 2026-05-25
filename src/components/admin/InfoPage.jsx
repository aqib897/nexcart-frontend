import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { server } from "@/main";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  Legend,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const InfoPage = () => {
  const [cod, setCod] = useState("");
  const [online, setOnline] = useState("");
  const [data, setData] = useState([]);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setCod(data.cod);
      setOnline(data.online);
      setData(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const paymentData = [
    { method: "online", users: online, fill: "#03bafc" },
    { method: "cod", users: cod, fill: "#8c1251" },
  ];

  const paymentChartConfig = {
    users: {
      label: "Users",
    },
    online: {
      label: "Online",
      color: "hls(var(--chart-1))",
    },
    cod: {
      label: "COD",
      color: "hls(var(--chart-2))",
    },
  };

  const paymentPercentage = paymentData.map((data) => ({
    ...data,
    percentage: parseFloat(((data.users / (cod + online)) * 100).toFixed(2)),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie chart - Payment Methods</CardTitle>
          <CardDescription>Payment Breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={paymentChartConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={paymentData}
                dataKey={"users"}
                nameKey={"method"}
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
                          dominantBaseline={"middle"}
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-muted-foreground text-xl font-bold"
                          >
                            {cod + online} Users
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
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing total users for payment methods
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie chart - Payment Percentage</CardTitle>
          <CardDescription>Payment Breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={paymentChartConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={paymentPercentage}
                dataKey={"percentage"}
                nameKey={"method"}
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
                          dominantBaseline={"middle"}
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-muted-foreground text-xl font-bold"
                          >
                            100%
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
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Displaying percentage distribution of payment methods
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>

          <CardDescription>Top 10 best selling products</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[...data]
                  .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                  .slice(0, 10)}
                margin={{
                  top: 10,
                  right: 30,
                  left: 40,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar dataKey="sold" fill="#8884d8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing top selling products only
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InfoPage;
