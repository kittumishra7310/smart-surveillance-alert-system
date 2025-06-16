
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Square, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Detection {
  id: number;
  label: string;
  confidence: number;
  timestamp: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CameraFeedProps {
  onDetection?: (detections: Detection[]) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onDetection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string>("");
  
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError("");
        
        toast({
          title: "Camera Started",
          description: "Live camera feed is now active",
        });
      }
    } catch (err) {
      const errorMessage = "Failed to access camera. Please check permissions.";
      setError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    stopDetection();
    setIsStreaming(false);
    setError("");
    
    toast({
      title: "Camera Stopped",
      description: "Live camera feed has been stopped",
    });
  };

  const simulateDetection = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simulate random detections (in real implementation, this would be ML model inference)
    const newDetections: Detection[] = [];
    
    // Random chance of detection
    if (Math.random() > 0.7) {
      const detection: Detection = {
        id: Date.now(),
        label: Math.random() > 0.6 ? "Suspicious Activity" : "Normal Activity",
        confidence: 0.6 + Math.random() * 0.4,
        timestamp: new Date().toLocaleTimeString(),
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        width: 80 + Math.random() * 120,
        height: 80 + Math.random() * 120
      };
      
      newDetections.push(detection);
      
      // Draw bounding box
      ctx.strokeStyle = detection.label.includes('Suspicious') ? '#ef4444' : '#22c55e';
      ctx.lineWidth = 3;
      ctx.strokeRect(detection.x, detection.y, detection.width, detection.height);
      
      // Draw label
      ctx.fillStyle = detection.label.includes('Suspicious') ? '#ef4444' : '#22c55e';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${detection.label} (${Math.round(detection.confidence * 100)}%)`,
        detection.x,
        detection.y - 10
      );
    }
    
    return newDetections;
  };

  const startDetection = () => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;
    
    setIsDetecting(true);
    
    intervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const newDetections = simulateDetection(canvasRef.current, videoRef.current);
        setDetections(newDetections);
        onDetection?.(newDetections);
      }
    }, 1000); // Run detection every second
    
    toast({
      title: "Detection Started",
      description: "Live detection is now running",
    });
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsDetecting(false);
    setDetections([]);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Camera Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-64 pointer-events-none"
            style={{ display: isDetecting ? 'block' : 'none' }}
          />
          
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
              <div className="text-center text-white">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Camera not active</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-2">
          {!isStreaming ? (
            <Button onClick={startCamera} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
          
          {isStreaming && (
            <Button 
              onClick={isDetecting ? stopDetection : startDetection}
              variant={isDetecting ? "destructive" : "default"}
            >
              {isDetecting ? "Stop Detection" : "Start Detection"}
            </Button>
          )}
        </div>

        {detections.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Live Detections:</h4>
            {detections.map((detection) => (
              <div key={detection.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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
        )}
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
