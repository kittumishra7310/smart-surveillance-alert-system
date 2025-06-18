import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Download, AlertTriangle, Activity, Camera, Clock, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';

// Mock data for analytics
const detectionData = [
  { date: '2024-01-01', suspicious: 5, normal: 15, total: 20 },
  { date: '2024-01-02', suspicious: 8, normal: 22, total: 30 },
  { date: '2024-01-03', suspicious: 3, normal: 17, total: 20 },
  { date: '2024-01-04', suspicious: 12, normal: 18, total: 30 },
  { date: '2024-01-05', suspicious: 6, normal: 24, total: 30 },
  { date: '2024-01-06', suspicious: 9, normal: 21, total: 30 },
  { date: '2024-01-07', suspicious: 4, normal: 16, total: 20 },
];

const hourlyData = [
  { hour: '00:00', detections: 2 },
  { hour: '02:00', detections: 1 },
  { hour: '04:00', detections: 0 },
  { hour: '06:00', detections: 3 },
  { hour: '08:00', detections: 8 },
  { hour: '10:00', detections: 12 },
  { hour: '12:00', detections: 15 },
  { hour: '14:00', detections: 18 },
  { hour: '16:00', detections: 14 },
  { hour: '18:00', detections: 10 },
  { hour: '20:00', detections: 7 },
  { hour: '22:00', detections: 4 },
];

const alertTypeData = [
  { name: 'Loitering', value: 35, color: '#ff6b6b' },
  { name: 'Suspicious Movement', value: 25, color: '#4ecdc4' },
  { name: 'Unattended Object', value: 20, color: '#45b7d1' },
  { name: 'Aggressive Behavior', value: 15, color: '#96ceb4' },
  { name: 'Unauthorized Access', value: 5, color: '#feca57' },
];

const mockHistory = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    type: 'Suspicious Activity',
    description: 'Person loitering near entrance for extended period',
    location: 'Main Entrance - Camera 1',
    confidence: 0.87,
    status: 'Active',
    severity: 'High'
  },
  {
    id: 2,
    timestamp: '2024-01-15 13:45:12',
    type: 'Normal Activity',
    description: 'Regular pedestrian traffic',
    location: 'Corridor A - Camera 3',
    confidence: 0.92,
    status: 'Resolved',
    severity: 'Low'
  },
  {
    id: 3,
    timestamp: '2024-01-15 12:20:08',
    type: 'Suspicious Activity',
    description: 'Unattended bag detected',
    location: 'Waiting Area - Camera 2',
    confidence: 0.76,
    status: 'Investigating',
    severity: 'Medium'
  },
  {
    id: 4,
    timestamp: '2024-01-15 11:15:33',
    type: 'Alert',
    description: 'Motion detected in restricted area',
    location: 'Restricted Zone - Camera 4',
    confidence: 0.94,
    status: 'Resolved',
    severity: 'High'
  },
  {
    id: 5,
    timestamp: '2024-01-15 10:30:45',
    type: 'Normal Activity',
    description: 'Staff member accessing secure area',
    location: 'Security Office - Camera 5',
    confidence: 0.98,
    status: 'Resolved',
    severity: 'Low'
  }
];

const DetectionHistory: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = mockHistory.filter(item => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'suspicious' && item.type === 'Suspicious Activity') ||
      (selectedFilter === 'normal' && item.type === 'Normal Activity') ||
      (selectedFilter === 'alerts' && item.type === 'Alert');
    
    const matchesSearch = searchTerm === '' || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics & Charts
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Clock className="w-4 h-4 mr-2" />
            Detection History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Detections</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-xs text-green-600">+12% from last week</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Suspicious Events</p>
                    <p className="text-2xl font-bold text-red-600">47</p>
                    <p className="text-xs text-red-600">+3% from last week</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Cameras</p>
                    <p className="text-2xl font-bold text-green-600">12/12</p>
                    <p className="text-xs text-green-600">All operational</p>
                  </div>
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-purple-600">87.3%</p>
                    <p className="text-xs text-purple-600">+2.1% accuracy</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Detection Trends */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Detection Trends (7 Days)</CardTitle>
                <CardDescription>Daily suspicious vs normal activity detection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={detectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="normal" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Hourly Activity Pattern</CardTitle>
                <CardDescription>Average detections by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="detections" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alert Types Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Alert Types Distribution</CardTitle>
                <CardDescription>Breakdown of different suspicious activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={alertTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {alertTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Comparison */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Weekly Comparison</CardTitle>
                <CardDescription>Current vs previous week performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={detectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="suspicious" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Search descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Type</label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="suspicious">Suspicious Only</SelectItem>
                      <SelectItem value="normal">Normal Only</SelectItem>
                      <SelectItem value="alerts">Alerts Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardHeader>
              <CardTitle>Detection History</CardTitle>
              <CardDescription>Recent security events and detections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            item.type === 'Suspicious Activity' ? 'destructive' : 
                            item.type === 'Alert' ? 'default' : 'secondary'
                          }
                        >
                          {item.type}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={
                            item.severity === 'High' ? 'border-red-500 text-red-500' :
                            item.severity === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }
                        >
                          {item.severity}
                        </Badge>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{item.timestamp}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{item.description}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>ID: #{item.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetectionHistory;
