
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Activity, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import CameraFeed from './CameraFeed';
import CameraGrid from './CameraGrid';
import AlertsPanel from './AlertsPanel';
import AnalyticsOverview from './AnalyticsOverview';
import FileUpload from './FileUpload';

const Dashboard = () => {
  const [detectionResults, setDetectionResults] = useState([]);
  const { user, logout } = useAuth();

  const handleDetection = (detections) => {
    setDetectionResults(prev => [...detections, ...prev.slice(0, 49)]);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Security Detection System</h1>
            <p className="text-gray-600">Real-time suspicious activity monitoring and analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="live-detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live-detection" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Live Detection</span>
            </TabsTrigger>
            <TabsTrigger value="file-upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CameraFeed onDetection={handleDetection} />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Detections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {detectionResults.length === 0 ? (
                      <p className="text-gray-500 text-sm">No detections yet. Start camera to begin detection.</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {detectionResults.slice(0, 10).map((detection, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded border">
                            <div className="font-semibold text-sm">{detection.label}</div>
                            <div className="text-xs text-gray-500">{detection.timestamp}</div>
                            <div className="text-xs">Confidence: {Math.round(detection.confidence * 100)}%</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="file-upload" className="space-y-6">
            <FileUpload />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
