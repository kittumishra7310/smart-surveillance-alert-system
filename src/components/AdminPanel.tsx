
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Camera, Bell, BarChart } from "lucide-react";
import UserManagement from './UserManagement';
import CameraManagement from './CameraManagement';
import AlertManagement from './AlertManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Admin Control Panel
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Manage users, cameras, alerts, and system analytics
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="cameras" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Camera className="w-4 h-4 mr-2" />
            Cameras
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="cameras" className="mt-6">
          <CameraManagement />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
