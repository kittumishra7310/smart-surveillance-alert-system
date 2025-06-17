
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Camera, Users } from "lucide-react";

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const detectionTrends = [
    { date: '2024-01-09', total: 45, suspicious: 8, normal: 37 },
    { date: '2024-01-10', total: 52, suspicious: 12, normal: 40 },
    { date: '2024-01-11', total: 38, suspicious: 6, normal: 32 },
    { date: '2024-01-12', total: 61, suspicious: 15, normal: 46 },
    { date: '2024-01-13', total: 48, suspicious: 9, normal: 39 },
    { date: '2024-01-14', total: 55, suspicious: 11, normal: 44 },
    { date: '2024-01-15', total: 63, suspicious: 13, normal: 50 }
  ];

  const cameraPerformance = [
    { name: 'Main Entrance', detections: 89, accuracy: 94 },
    { name: 'Parking Lot', detections: 76, accuracy: 87 },
    { name: 'Warehouse', detections: 45, accuracy: 91 },
    { name: 'Office Area', detections: 34, accuracy: 96 },
    { name: 'Loading Dock', detections: 67, accuracy: 89 }
  ];

  const alertTypes = [
    { name: 'Suspicious Movement', value: 45, color: '#ef4444' },
    { name: 'Unattended Object', value: 23, color: '#f97316' },
    { name: 'Unauthorized Access', value: 18, color: '#eab308' },
    { name: 'Aggressive Behavior', value: 14, color: '#8b5cf6' }
  ];

  const hourlyActivity = [
    { hour: '00:00', activity: 12 },
    { hour: '04:00', activity: 8 },
    { hour: '08:00', activity: 45 },
    { hour: '12:00', activity: 67 },
    { hour: '16:00', activity: 89 },
    { hour: '20:00', activity: 56 },
  ];

  const chartConfig = {
    total: { label: "Total Detections", color: "#3b82f6" },
    suspicious: { label: "Suspicious", color: "#ef4444" },
    normal: { label: "Normal", color: "#10b981" },
    detections: { label: "Detections", color: "#6366f1" },
    accuracy: { label: "Accuracy %", color: "#f59e0b" },
    activity: { label: "Activity Level", color: "#8b5cf6" }
  };

  const kpiData = [
    {
      title: "Total Detections",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      title: "Suspicious Activities",
      value: "89",
      change: "-8.3%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Active Cameras",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Camera,
      color: "text-green-600"
    },
    {
      title: "Alert Response Time",
      value: "2.3s",
      change: "-0.5s",
      trend: "down",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100 ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Detection Trends</TabsTrigger>
          <TabsTrigger value="cameras">Camera Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alert Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Trends Over Time</CardTitle>
              <CardDescription>Total detections vs suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <AreaChart data={detectionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stackId="1" 
                    stroke="var(--color-total)" 
                    fill="var(--color-total)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="suspicious" 
                    stackId="2" 
                    stroke="var(--color-suspicious)" 
                    fill="var(--color-suspicious)" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cameras" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Camera Performance Metrics</CardTitle>
              <CardDescription>Detections count and accuracy by camera</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={cameraPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="detections" fill="var(--color-detections)" />
                  <Bar dataKey="accuracy" fill="var(--color-accuracy)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Types Distribution</CardTitle>
                <CardDescription>Breakdown of different alert categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <PieChart>
                    <Pie
                      data={alertTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {alertTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
                <CardDescription>Recent alert statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertTypes.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: alert.color }}
                      />
                      <span className="font-medium">{alert.name}</span>
                    </div>
                    <Badge variant="outline">{alert.value} alerts</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Patterns</CardTitle>
              <CardDescription>Activity levels throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="activity" 
                    stroke="var(--color-activity)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-activity)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
