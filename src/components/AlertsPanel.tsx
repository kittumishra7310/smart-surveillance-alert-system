
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'Suspicious Activity',
      description: 'Person loitering near main entrance for extended period',
      camera: 'Front Entrance',
      timestamp: '2 minutes ago',
      severity: 'high',
      status: 'active'
    },
    {
      id: 2,
      type: 'Unauthorized Access',
      description: 'Motion detected in restricted area after hours',
      camera: 'Server Room',
      timestamp: '15 minutes ago',
      severity: 'high',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'Object Detection',
      description: 'Unattended bag detected in reception area',
      camera: 'Reception Area',
      timestamp: '1 hour ago',
      severity: 'medium',
      status: 'active'
    },
    {
      id: 4,
      type: 'Crowd Detection',
      description: 'Large gathering detected in parking area',
      camera: 'Parking Lot A',
      timestamp: '2 hours ago',
      severity: 'low',
      status: 'resolved'
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'investigating':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Alerts</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(alert.status)}
                    <h3 className="font-semibold text-lg">{alert.type}</h3>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{alert.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Camera: {alert.camera}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {alert.status === 'active' && (
                    <Button size="sm">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
