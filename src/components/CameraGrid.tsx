
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle, CheckCircle, Settings } from 'lucide-react';

const CameraGrid = () => {
  const cameras = [
    { id: 1, name: 'Front Entrance', location: 'Main Building', status: 'active', lastDetection: '2 min ago' },
    { id: 2, name: 'Parking Lot A', location: 'North Side', status: 'active', lastDetection: '5 min ago' },
    { id: 3, name: 'Loading Dock', location: 'Warehouse', status: 'maintenance', lastDetection: '1 hour ago' },
    { id: 4, name: 'Reception Area', location: 'Main Building', status: 'active', lastDetection: '10 min ago' },
    { id: 5, name: 'Emergency Exit', location: 'East Wing', status: 'active', lastDetection: '15 min ago' },
    { id: 6, name: 'Server Room', location: 'Basement', status: 'offline', lastDetection: '3 hours ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      default:
        return <Camera className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Camera Management</h2>
        <Button>Add Camera</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <Card key={camera.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>{camera.name}</span>
                </CardTitle>
                {getStatusIcon(camera.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">{camera.location}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                {getStatusBadge(camera.status)}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Detection:</span>
                <span className="text-sm">{camera.lastDetection}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Stream
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CameraGrid;
