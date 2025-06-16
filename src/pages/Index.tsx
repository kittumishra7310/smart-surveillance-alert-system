import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Play, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CameraFeed from "@/components/CameraFeed";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<Detection[]>([]);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [liveDetections, setLiveDetections] = useState<Detection[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetectionResults([]);
      setProcessedImageUrl("");
      toast({
        title: "File Selected",
        description: `${file.name} ready for processing`,
      });
    }
  };

  const simulateDetection = async () => {
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

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate detection delay
    setTimeout(() => {
      // Create mock detection results
      const mockDetections = [
        {
          id: 1,
          label: "Suspicious Activity",
          confidence: 0.87,
          timestamp: new Date().toLocaleString(),
          location: "Top-left area",
          type: "Person loitering"
        },
        {
          id: 2,
          label: "Normal Activity",
          confidence: 0.65,
          timestamp: new Date().toLocaleString(),
          location: "Center area",
          type: "Person walking"
        }
      ];

      setDetectionResults(mockDetections);
      
      // Create a URL for the uploaded file to display
      const url = URL.createObjectURL(selectedFile);
      setProcessedImageUrl(url);
      
      setIsProcessing(false);
      setProgress(100);
      
      toast({
        title: "Detection Complete",
        description: `Found ${mockDetections.length} activities`,
      });
    }, 2000);
  };

  const handleLiveDetection = (detections: Detection[]) => {
    setLiveDetections(detections);
    
    // Show toast for suspicious activities
    const suspiciousCount = detections.filter(d => d.label.includes('Suspicious')).length;
    if (suspiciousCount > 0) {
      toast({
        title: "Suspicious Activity Detected",
        description: `${suspiciousCount} suspicious activity detected in live feed`,
        variant: "destructive",
      });
    }
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file: File) => {
    return file.type.startsWith('video/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Suspicious Activity Detection System
          </h1>
          <p className="text-gray-600">
            Upload images or videos to detect suspicious human activities using AI
          </p>
        </div>

        <Tabs defaultValue="detection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detection">Live Detection</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    File Upload
                  </CardTitle>
                  <CardDescription>
                    Upload an image or video file for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Selected File:</p>
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        Type: {isImageFile(selectedFile) ? 'Image' : isVideoFile(selectedFile) ? 'Video' : 'Unknown'}
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={simulateDetection}
                    disabled={!selectedFile || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Detection
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Camera Feed Section */}
              <CameraFeed onDetection={handleLiveDetection} />
            </div>

            {/* Live Detection Alert */}
            {liveDetections.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="w-5 h-5" />
                    Live Detection Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {liveDetections.map((detection) => (
                      <div key={detection.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <Badge variant={detection.label.includes('Suspicious') ? 'destructive' : 'secondary'}>
                            {detection.label}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{detection.timestamp}</p>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(detection.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Detection Results Section */}
            {(detectionResults.length > 0 || processedImageUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    File Detection Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image/Video Display */}
                    {processedImageUrl && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Processed Media</h3>
                        {selectedFile && isImageFile(selectedFile) ? (
                          <img 
                            src={processedImageUrl} 
                            alt="Processed" 
                            className="w-full h-64 object-cover rounded-lg border"
                          />
                        ) : (
                          <video 
                            src={processedImageUrl} 
                            controls 
                            className="w-full h-64 rounded-lg border"
                          />
                        )}
                      </div>
                    )}

                    {/* Detection List */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">Detected Activities</h3>
                      <div className="space-y-3">
                        {detectionResults.map((result) => (
                          <div key={result.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <Badge 
                                variant={result.label.includes('Suspicious') ? 'destructive' : 'secondary'}
                              >
                                {result.label}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {(result.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{result.type}</p>
                            <p className="text-xs text-gray-500">
                              {result.location} • {result.timestamp}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Detection History</CardTitle>
                <CardDescription>View past detection results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No detection history available</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure detection parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
