
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Plus, Edit, Trash2, Play, Pause, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  quality: '720p' | '1080p' | '4K';
  recording: boolean;
  lastActivity: string;
}

const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    {
      id: '1',
      name: 'Main Entrance',
      location: 'Building A - Entrance',
      url: 'rtsp://192.168.1.100:554/stream',
      status: 'online',
      quality: '1080p',
      recording: true,
      lastActivity: '2024-01-15 14:30:25'
    },
    {
      id: '2',
      name: 'Parking Lot',
      location: 'Parking Area - West',
      url: 'rtsp://192.168.1.101:554/stream',
      status: 'online',
      quality: '720p',
      recording: true,
      lastActivity: '2024-01-15 14:25:10'
    },
    {
      id: '3',
      name: 'Warehouse',
      location: 'Building B - Storage',
      url: 'rtsp://192.168.1.102:554/stream',
      status: 'offline',
      quality: '1080p',
      recording: false,
      lastActivity: '2024-01-15 12:45:33'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    url: '',
    quality: '1080p' as '720p' | '1080p' | '4K'
  });
  const { toast } = useToast();

  const handleAddCamera = () => {
    const camera: CameraFeed = {
      id: Date.now().toString(),
      name: newCamera.name,
      location: newCamera.location,
      url: newCamera.url,
      status: 'online',
      quality: newCamera.quality,
      recording: true,
      lastActivity: new Date().toLocaleString()
    };

    setCameras([...cameras, camera]);
    setNewCamera({ name: '', location: '', url: '', quality: '1080p' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Camera Added",
      description: `${camera.name} has been added successfully`,
    });
  };

  const toggleRecording = (cameraId: string) => {
    setCameras(cameras.map(camera => 
      camera.id === cameraId 
        ? { ...camera, recording: !camera.recording }
        : camera
    ));
  };

  const handleDeleteCamera = (cameraId: string) => {
    setCameras(cameras.filter(camera => camera.id !== cameraId));
    toast({
      title: "Camera Removed",
      description: "Camera has been removed from the system",
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'maintenance': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Management
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Camera
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Camera</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="camera-name">Camera Name</Label>
                    <Input
                      id="camera-name"
                      value={newCamera.name}
                      onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                      placeholder="e.g., Main Entrance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newCamera.location}
                      onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                      placeholder="e.g., Building A - Entrance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Stream URL</Label>
                    <Input
                      id="url"
                      value={newCamera.url}
                      onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                      placeholder="rtsp://192.168.1.100:554/stream"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <Select value={newCamera.quality} onValueChange={(value: '720p' | '1080p' | '4K') => setNewCamera({ ...newCamera, quality: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="4K">4K Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCamera} className="w-full">
                    Add Camera
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell className="font-medium">{camera.name}</TableCell>
                  <TableCell>{camera.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(camera.status) as "default" | "destructive" | "secondary"}>
                      {camera.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{camera.quality}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={camera.recording ? 'default' : 'secondary'}>
                        {camera.recording ? 'Recording' : 'Stopped'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleRecording(camera.id)}
                      >
                        {camera.recording ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{camera.lastActivity}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCamera(camera.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraManagement;
