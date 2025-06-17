
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RotateCcw, Bell, Camera, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsState {
  detectionSensitivity: number[];
  confidenceThreshold: number[];
  enableNotifications: boolean;
  enableSound: boolean;
  autoSave: boolean;
  detectionFrameRate: string;
  videoQuality: string;
  alertThreshold: number[];
  enableEmailAlerts: boolean;
  emailAddress: string;
  enableSMSAlerts: boolean;
  phoneNumber: string;
  retentionDays: number[];
  enableAutoDelete: boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    detectionSensitivity: [75],
    confidenceThreshold: [80],
    enableNotifications: true,
    enableSound: true,
    autoSave: true,
    detectionFrameRate: '30',
    videoQuality: 'hd',
    alertThreshold: [85],
    enableEmailAlerts: false,
    emailAddress: '',
    enableSMSAlerts: false,
    phoneNumber: '',
    retentionDays: [30],
    enableAutoDelete: false,
  });

  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your system settings have been successfully saved",
    });
  };

  const handleReset = () => {
    const defaultSettings: SettingsState = {
      detectionSensitivity: [75],
      confidenceThreshold: [80],
      enableNotifications: true,
      enableSound: true,
      autoSave: true,
      detectionFrameRate: '30',
      videoQuality: 'hd',
      alertThreshold: [85],
      enableEmailAlerts: false,
      emailAddress: '',
      enableSMSAlerts: false,
      phoneNumber: '',
      retentionDays: [30],
      enableAutoDelete: false,
    };
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detection Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <h3 className="font-semibold">Detection Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Detection Sensitivity: {settings.detectionSensitivity[0]}%</Label>
                <Slider
                  value={settings.detectionSensitivity}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, detectionSensitivity: value }))}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Higher values detect more activities but may increase false positives</p>
              </div>

              <div className="space-y-2">
                <Label>Confidence Threshold: {settings.confidenceThreshold[0]}%</Label>
                <Slider
                  value={settings.confidenceThreshold}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, confidenceThreshold: value }))}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Minimum confidence required to trigger an alert</p>
              </div>

              <div className="space-y-2">
                <Label>Alert Threshold: {settings.alertThreshold[0]}%</Label>
                <Slider
                  value={settings.alertThreshold}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, alertThreshold: value }))}
                  max={100}
                  min={60}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Confidence level required for suspicious activity alerts</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frameRate">Detection Frame Rate</Label>
                <Select value={settings.detectionFrameRate} onValueChange={(value) => setSettings(prev => ({ ...prev, detectionFrameRate: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 FPS (Low CPU)</SelectItem>
                    <SelectItem value="15">15 FPS (Balanced)</SelectItem>
                    <SelectItem value="30">30 FPS (High Accuracy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Video Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <h3 className="font-semibold">Video Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="videoQuality">Video Quality</Label>
                <Select value={settings.videoQuality} onValueChange={(value) => setSettings(prev => ({ ...prev, videoQuality: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sd">SD (480p)</SelectItem>
                    <SelectItem value="hd">HD (720p)</SelectItem>
                    <SelectItem value="fhd">Full HD (1080p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Recordings</Label>
                  <p className="text-xs text-gray-500">Automatically save detected activities</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <h3 className="font-semibold">Notification Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Browser Notifications</Label>
                  <p className="text-xs text-gray-500">Show desktop notifications for alerts</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Sound Alerts</Label>
                  <p className="text-xs text-gray-500">Play sound when suspicious activity is detected</p>
                </div>
                <Switch
                  checked={settings.enableSound}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSound: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Email Alerts</Label>
                    <Switch
                      checked={settings.enableEmailAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableEmailAlerts: checked }))}
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={settings.emailAddress}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailAddress: e.target.value }))}
                    disabled={!settings.enableEmailAlerts}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>SMS Alerts</Label>
                    <Switch
                      checked={settings.enableSMSAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSMSAlerts: checked }))}
                    />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    disabled={!settings.enableSMSAlerts}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Storage Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention: {settings.retentionDays[0]} days</Label>
                <Slider
                  value={settings.retentionDays}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, retentionDays: value }))}
                  max={365}
                  min={7}
                  step={7}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">How long to keep detection data and recordings</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-delete Old Data</Label>
                  <p className="text-xs text-gray-500">Automatically remove data older than retention period</p>
                </div>
                <Switch
                  checked={settings.enableAutoDelete}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoDelete: checked }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
