import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Download, AlertTriangle, Activity, Camera, Clock, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';
import { DatabaseService } from '@/services/databaseService';
import { useToast } from "@/hooks/use-toast";

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
  const [detections, setDetections] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load recent detections
      const detectionsData = await DatabaseService.getDetections(50);
      setDetections(detectionsData);

      // Load analytics data
      const statsData = await DatabaseService.getDetectionStats(7);
      const hourlyData = await DatabaseService.getHourlyStats();

      // Process analytics data
      const processedAnalytics = processAnalyticsData(statsData, hourlyData);
      setAnalytics(processedAnalytics);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Using demo data instead",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setDetections(mockHistory);
      setAnalytics({
        detectionTrends: detectionData,
        hourlyActivity: hourlyData,
        alertTypes: alertTypeData
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (stats: any[], hourly: any[]) => {
    // Process stats into charts format
    const dailyStats = stats.reduce((acc: any, detection) => {
      const date = new Date(detection.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, suspicious: 0, normal: 0, total: 0 };
      }
      
      const isSuspicious = ['high', 'medium'].includes(detection.severity);
      if (isSuspicious) {
        acc[date].suspicious++;
      } else {
        acc[date].normal++;
      }
      acc[date].total++;
      
      return acc;
    }, {});

    const detectionTrends = Object.values(dailyStats).slice(-7);

    // Process hourly data
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourData = hourly.find((h: any) => h.hour === hour);
      return {
        hour: hour.toString().padStart(2, '0') + ':00',
        detections: hourData?.detection_count || 0
      };
    });

    // Process alert types
    const typeStats = stats.reduce((acc: any, detection) => {
      const type = detection.detection_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const alertTypes = Object.entries(typeStats).map(([name, value], index) => ({
      name,
      value: value as number,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][index % 5]
    }));

    return {
      detectionTrends,
      hourlyActivity,
      alertTypes
    };
  };

  const filteredHistory = detections.filter(item => {
    const isSuspicious = ['high', 'medium'].includes(item.severity);
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'suspicious' && isSuspicious) ||
      (selectedFilter === 'normal' && !isSuspicious) ||
      (selectedFilter === 'alerts' && item.status === 'active');
    
    const matchesSearch = searchTerm === '' || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.cameras?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="ml-3">Loading detection history...</span>
        </div>
      </div>
    );
  }

  const currentAnalytics = analytics || {
    detectionTrends: detectionData,
    hourlyActivity: hourlyData,
    alertTypes: alertTypeData
  };

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
                    <p className="text-2xl font-bold text-gray-900">{detections.length}</p>
                    <p className="text-xs text-green-600">Real-time data</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-red-600">
                      {detections.filter(d => d.severity === 'high').length}
                    </p>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {detections.filter(d => d.status === 'active').length}
                    </p>
                    <p className="text-xs text-orange-600">Unresolved</p>
                  </div>
                  <Camera className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {detections.length > 0 
                        ? `${(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                    <p className="text-xs text-purple-600">Detection accuracy</p>
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
                  <AreaChart data={currentAnalytics.detectionTrends}>
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
                <CardDescription>Real-time detections by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentAnalytics.hourlyActivity}>
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
                <CardTitle>Detection Types Distribution</CardTitle>
                <CardDescription>Breakdown of different detection categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={currentAnalytics.alertTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {currentAnalytics.alertTypes.map((entry: any, index: number) => (
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
                <CardTitle>Detection Confidence Trends</CardTitle>
                <CardDescription>Average confidence levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={currentAnalytics.detectionTrends}>
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
                      <SelectItem value="suspicious">High Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alerts">Active Alerts</SelectItem>
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
                  <Button variant="outline" className="w-full" onClick={loadData}>
                    <Download className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardHeader>
              <CardTitle>Detection History ({filteredHistory.length} items)</CardTitle>
              <CardDescription>Real-time security events and detections from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No detections found matching your filters.
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              item.severity === 'high' ? 'destructive' : 
                              item.severity === 'medium' ? 'default' : 'secondary'
                            }
                          >
                            {item.detection_type}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              item.severity === 'high' ? 'border-red-500 text-red-500' :
                              item.severity === 'medium' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            }
                          >
                            {item.severity}
                          </Badge>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{item.description}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>{item.cameras?.name || 'Unknown Camera'} - {item.cameras?.location || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>ID: #{item.id.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetectionHistory;
