
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsOverview = () => {
  const dailyDetections = [
    { day: 'Mon', detections: 12 },
    { day: 'Tue', detections: 18 },
    { day: 'Wed', detections: 8 },
    { day: 'Thu', detections: 24 },
    { day: 'Fri', detections: 16 },
    { day: 'Sat', detections: 6 },
    { day: 'Sun', detections: 4 },
  ];

  const hourlyActivity = [
    { hour: '00', activity: 2 },
    { hour: '06', activity: 5 },
    { hour: '12', activity: 15 },
    { hour: '18', activity: 12 },
    { hour: '24', activity: 3 },
  ];

  const alertTypes = [
    { name: 'Suspicious Activity', value: 45, color: '#ef4444' },
    { name: 'Unauthorized Access', value: 25, color: '#f97316' },
    { name: 'Object Detection', value: 20, color: '#eab308' },
    { name: 'Crowd Detection', value: 10, color: '#22c55e' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Detections</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyDetections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="detections" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Activity Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={alertTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {alertTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-sm font-medium">Most Active Camera</span>
            <span className="text-sm text-blue-600">Front Entrance</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-sm font-medium">Peak Activity Time</span>
            <span className="text-sm text-blue-600">12:00 - 14:00</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-sm font-medium">Resolution Rate</span>
            <span className="text-sm text-green-600">94%</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-sm font-medium">Average Response Time</span>
            <span className="text-sm text-blue-600">3.2 min</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
