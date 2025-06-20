
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Plus } from 'lucide-react';

const CameraGrid = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Camera Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Camera
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Available Cameras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No cameras configured</p>
            <p className="text-sm text-gray-400 mt-2">
              Add cameras to start monitoring multiple locations
            </p>
            <Button className="mt-4" variant="outline">
              Configure First Camera
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraGrid;
