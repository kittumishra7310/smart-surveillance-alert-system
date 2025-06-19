
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileVideo, FileText, X, Play, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'processing' | 'completed' | 'error';
  detections?: any[];
}

const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { toast } = useToast();

  const acceptedTypes = {
    'video/mp4': '.mp4',
    'video/avi': '.avi',
    'video/mov': '.mov',
    'video/wmv': '.wmv',
    'application/pdf': '.pdf'
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => 
      Object.keys(acceptedTypes).includes(file.type)
    );

    if (validFiles.length !== fileList.length) {
      toast({
        title: "Invalid Files",
        description: "Some files were skipped. Only video files (MP4, AVI, MOV, WMV) and PDF files are supported.",
        variant: "destructive",
      });
    }

    validFiles.forEach(file => processFile(file));
  };

  const processFile = async (file: File) => {
    const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const fileUrl = URL.createObjectURL(file);
    
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      status: 'processing'
    };

    setFiles(prev => [...prev, newFile]);
    setProcessing(true);
    setProgress(0);

    try {
      if (file.type.startsWith('video/')) {
        await processVideo(fileId, fileUrl);
      } else if (file.type === 'application/pdf') {
        await processPDF(fileId, file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      updateFileStatus(fileId, 'error');
      toast({
        title: "Processing Error",
        description: `Failed to process ${file.name}`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const processVideo = async (fileId: string, videoUrl: string) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const detections: any[] = [];
        const duration = video.duration;
        const frameInterval = Math.max(1, duration / 20); // Sample 20 frames max
        let currentTime = 0;
        let frameCount = 0;
        const totalFrames = Math.min(20, Math.floor(duration / frameInterval));

        const processFrame = () => {
          if (currentTime >= duration) {
            updateFileStatus(fileId, 'completed', detections);
            resolve();
            return;
          }

          video.currentTime = currentTime;
          
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Simulate detection analysis
            const frameDetections = simulateDetection(canvas, currentTime);
            detections.push(...frameDetections);
            
            frameCount++;
            setProgress((frameCount / totalFrames) * 100);
            
            currentTime += frameInterval;
            setTimeout(processFrame, 100); // Small delay to show progress
          };
        };

        processFrame();
      };

      video.onerror = () => reject(new Error('Video loading failed'));
    });
  };

  const processPDF = async (fileId: string, file: File) => {
    // Simulate PDF text extraction and analysis
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate finding suspicious content in PDF
          const detections = [
            {
              id: Date.now(),
              type: 'document_analysis',
              description: 'Suspicious keywords detected in document',
              confidence: 0.75,
              page: Math.floor(Math.random() * 10) + 1,
              timestamp: new Date().toLocaleTimeString()
            }
          ];
          
          updateFileStatus(fileId, 'completed', detections);
          resolve();
        }
      }, 200);
    });
  };

  const simulateDetection = (canvas: HTMLCanvasElement, timestamp: number) => {
    const detections = [];
    
    // Random detection simulation
    if (Math.random() < 0.3) { // 30% chance of detection per frame
      const detectionTypes = [
        'Person Detected',
        'Suspicious Activity',
        'Unattended Object',
        'Aggressive Behavior',
        'Trespassing'
      ];
      
      const detection = {
        id: Date.now() + Math.random(),
        type: detectionTypes[Math.floor(Math.random() * detectionTypes.length)],
        confidence: 0.6 + Math.random() * 0.3,
        timestamp: `${Math.floor(timestamp)}s`,
        coordinates: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          width: 50 + Math.random() * 100,
          height: 50 + Math.random() * 100
        }
      };
      
      detections.push(detection);
    }
    
    return detections;
  };

  const updateFileStatus = (fileId: string, status: UploadedFile['status'], detections?: any[]) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status, detections } 
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports video files (MP4, AVI, MOV, WMV) and PDF documents
                </p>
              </div>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Select Files
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={Object.values(acceptedTypes).join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {processing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded">
                        {file.type.startsWith('video/') ? (
                          <FileVideo className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge 
                            variant={
                              file.status === 'completed' ? 'default' :
                              file.status === 'error' ? 'destructive' : 'secondary'
                            }
                          >
                            {file.status === 'processing' && 'Processing'}
                            {file.status === 'completed' && 'Completed'}
                            {file.status === 'error' && 'Error'}
                          </Badge>
                          
                          {file.detections && file.detections.length > 0 && (
                            <Badge variant="outline">
                              {file.detections.length} Detection{file.detections.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>

                        {file.type.startsWith('video/') && file.status === 'completed' && (
                          <video 
                            src={file.url} 
                            controls 
                            className="mt-3 max-w-sm h-32 rounded border"
                          />
                        )}

                        {file.detections && file.detections.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h5 className="text-sm font-medium">Detections:</h5>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {file.detections.map((detection, index) => (
                                <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                    <span className="font-medium">{detection.type}</span>
                                    {detection.confidence && (
                                      <span className="text-gray-500">
                                        ({Math.round(detection.confidence * 100)}%)
                                      </span>
                                    )}
                                  </div>
                                  {detection.description && (
                                    <p className="mt-1 text-gray-600">{detection.description}</p>
                                  )}
                                  <p className="text-gray-500">
                                    {detection.timestamp} 
                                    {detection.page && ` • Page ${detection.page}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
