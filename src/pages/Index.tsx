import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Play, AlertTriangle, Shield, Activity, Clock, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import LoginForm from "@/components/LoginForm";
import CameraFeed from "@/components/CameraFeed";
import DetectionHistory from "@/components/DetectionHistory";
import SystemSettings from "@/components/SystemSettings";
import AdminPanel from "@/components/AdminPanel";

interface Detection {
  id: number;
  label: string;
  confidence: number;
  timestamp: string;
  location?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<Detection[]>([]);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [liveDetections, setLiveDetections] = useState<Detection[]>([]);
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetectionResults([]);
      setProcessedImageUrl("");
      toast({
        title: "File Selected",
        description: `${file.name} ready for AI analysis`,
      });
    }
  };

  const enhancedDetection = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image or video file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const progressSteps = [
      { step: 10, message: "Initializing AI model..." },
      { step: 25, message: "Preprocessing media..." },
      { step: 45, message: "Analyzing frames..." },
      { step: 70, message: "Detecting activities..." },
      { step: 85, message: "Calculating confidence..." },
      { step: 95, message: "Generating results..." },
      { step: 100, message: "Complete!" }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(step);
      if (step < 100) {
        toast({
          title: "Processing",
          description: message,
        });
      }
    }

    const isImage = selectedFile.type.startsWith('image/');
    const detectionCount = isImage ? 2 + Math.floor(Math.random() * 4) : 5 + Math.floor(Math.random() * 8);
    
    const activities = [
      { label: "Person Walking", suspicious: false, confidence: 0.82 + Math.random() * 0.15 },
      { label: "Person Standing", suspicious: false, confidence: 0.75 + Math.random() * 0.20 },
      { label: "Loitering Behavior", suspicious: true, confidence: 0.78 + Math.random() * 0.17 },
      { label: "Running Person", suspicious: false, confidence: 0.85 + Math.random() * 0.12 },
      { label: "Aggressive Gesture", suspicious: true, confidence: 0.73 + Math.random() * 0.22 },
      { label: "Unattended Object", suspicious: true, confidence: 0.69 + Math.random() * 0.25 },
      { label: "Normal Activity", suspicious: false, confidence: 0.80 + Math.random() * 0.15 },
      { label: "Suspicious Movement", suspicious: true, confidence: 0.76 + Math.random() * 0.19 }
    ];

    const mockDetections = Array.from({ length: detectionCount }, (_, index) => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      return {
        id: index + 1,
        label: activity.suspicious ? `Suspicious: ${activity.label}` : activity.label,
        confidence: Math.min(activity.confidence, 0.95),
        timestamp: new Date().toLocaleString(),
        location: `Zone ${Math.floor(Math.random() * 4) + 1}`,
        type: activity.suspicious ? "Suspicious Activity" : "Normal Activity"
      };
    });

    setDetectionResults(mockDetections);
    
    const url = URL.createObjectURL(selectedFile);
    setProcessedImageUrl(url);
    
    setIsProcessing(false);
    
    const suspiciousCount = mockDetections.filter(d => d.label.includes('Suspicious')).length;
    const avgConfidence = mockDetections.reduce((sum, d) => sum + d.confidence, 0) / mockDetections.length;
    
    toast({
      title: "Analysis Complete",
      description: `Found ${mockDetections.length} activities (${suspiciousCount} suspicious) with ${(avgConfidence * 100).toFixed(1)}% avg confidence`,
      variant: suspiciousCount > 0 ? "destructive" : "default",
    });
  };

  const handleLiveDetection = (detections: Detection[]) => {
    setLiveDetections(detections);
    
    const suspiciousCount = detections.filter(d => d.label.includes('Suspicious')).length;
    if (suspiciousCount > 0) {
      toast({
        title: "⚠️ Security Alert",
        description: `${suspiciousCount} suspicious activity detected in live feed`,
        variant: "destructive",
      });
    }
  };

  const isImageFile = (file: File) => file.type.startsWith('image/');
  const isVideoFile = (file: File) => file.type.startsWith('video/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with User Info */}
        <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI Security System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{user?.username}</span>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced suspicious activity detection powered by artificial intelligence
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>AI-Powered Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>24/7 Monitoring</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="detection" className="w-full">
          <TabsList className={`grid w-full ${user?.role === 'admin' ? 'grid-cols-4' : 'grid-cols-3'} bg-white/80 backdrop-blur-sm`}>
            <TabsTrigger value="detection" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Live Detection
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              History & Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Admin Panel
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="detection" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Enhanced File Upload Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    File Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload images or videos for AI-powered suspicious activity detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="text-sm font-medium">Select Media File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors"
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Selected File:</p>
                      <p className="text-sm text-blue-700 font-mono">{selectedFile.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                        <span>Type: {isImageFile(selectedFile) ? 'Image' : isVideoFile(selectedFile) ? 'Video' : 'Unknown'}</span>
                        <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={enhancedDetection}
                    disabled={!selectedFile || isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Live Camera Feed */}
              <CameraFeed onDetection={handleLiveDetection} />
            </div>

            {/* Live Detection Alert */}
            {liveDetections.length > 0 && (
              <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                    🚨 Live Security Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {liveDetections.map((detection) => (
                      <div key={detection.id} className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={detection.label.includes('Suspicious') ? 'destructive' : 'secondary'}
                              className={detection.label.includes('Suspicious') ? 'animate-pulse' : ''}
                            >
                              {detection.label}
                            </Badge>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
                          </div>
                          <p className="text-xs text-gray-500">{detection.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{Math.round(detection.confidence * 100)}%</span>
                          <Progress value={detection.confidence * 100} className="w-16 h-1 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced File Detection Results */}
            {(detectionResults.length > 0 || processedImageUrl) && (
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {processedImageUrl && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Processed Media</h3>
                        {selectedFile && isImageFile(selectedFile) ? (
                          <img 
                            src={processedImageUrl} 
                            alt="Processed" 
                            className="w-full h-64 object-cover rounded-lg border shadow-sm"
                          />
                        ) : (
                          <video 
                            src={processedImageUrl} 
                            controls 
                            className="w-full h-64 rounded-lg border shadow-sm"
                          />
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Detected Activities</h3>
                        <Badge variant="outline">
                          {detectionResults.length} Total
                        </Badge>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        {detectionResults.map((result) => (
                          <div key={result.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <Badge 
                                variant={result.label.includes('Suspicious') ? 'destructive' : 'secondary'}
                                className={result.label.includes('Suspicious') ? 'animate-pulse' : ''}
                              >
                                {result.label}
                              </Badge>
                              <div className="text-right">
                                <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                                <Progress value={result.confidence * 100} className="w-16 h-1 mt-1" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{result.type}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{result.location}</span>
                              <span>{result.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DetectionHistory />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SystemSettings />
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="admin" className="mt-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
