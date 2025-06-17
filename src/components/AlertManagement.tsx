
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  emailAddress: string;
  smsNumber: string;
  threshold: number;
  alertTypes: string[];
}

interface AlertHistory {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'failed' | 'pending';
  recipient: string;
  method: 'email' | 'sms' | 'push';
}

const AlertManagement: React.FC = () => {
  const [settings, setSettings] = useState<AlertSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    emailAddress: 'admin@security.com',
    smsNumber: '+1234567890',
    threshold: 0.8,
    alertTypes: ['suspicious_activity', 'unauthorized_access', 'system_error']
  });

  const [alertHistory] = useState<AlertHistory[]>([
    {
      id: '1',
      type: 'Suspicious Activity',
      message: 'Suspicious movement detected in Zone 1',
      timestamp: '2024-01-15 14:30:25',
      status: 'sent',
      recipient: 'admin@security.com',
      method: 'email'
    },
    {
      id: '2',
      type: 'Unauthorized Access',
      message: 'Unrecognized person in restricted area',
      timestamp: '2024-01-15 13:22:10',
      status: 'sent',
      recipient: '+1234567890',
      method: 'sms'
    },
    {
      id: '3',
      type: 'System Alert',
      message: 'Camera 3 connection lost',
      timestamp: '2024-01-15 12:45:33',
      status: 'failed',
      recipient: 'admin@security.com',
      method: 'email'
    }
  ]);

  const { toast } = useToast();

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings Updated",
      description: "Alert settings have been saved successfully",
    });
  };

  const testAlert = (method: 'email' | 'sms' | 'push') => {
    toast({
      title: "Test Alert Sent",
      description: `Test ${method} alert has been sent`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <Label>Email Alerts</Label>
                </div>
                <Switch
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                />
              </div>
              {settings.emailEnabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Email address"
                    value={settings.emailAddress}
                    onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                  />
                  <Button size="sm" variant="outline" onClick={() => testAlert('email')}>
                    Test Email
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <Label>SMS Alerts</Label>
                </div>
                <Switch
                  checked={settings.smsEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsEnabled: checked })}
                />
              </div>
              {settings.smsEnabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Phone number"
                    value={settings.smsNumber}
                    onChange={(e) => setSettings({ ...settings, smsNumber: e.target.value })}
                  />
                  <Button size="sm" variant="outline" onClick={() => testAlert('sms')}>
                    Test SMS
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <Label>Push Notifications</Label>
                </div>
                <Switch
                  checked={settings.pushEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
                />
              </div>
              {settings.pushEnabled && (
                <Button size="sm" variant="outline" onClick={() => testAlert('push')}>
                  Test Push
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alert Threshold (Confidence Level)</Label>
            <Select value={settings.threshold.toString()} onValueChange={(value) => setSettings({ ...settings, threshold: parseFloat(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">50% - Low</SelectItem>
                <SelectItem value="0.7">70% - Medium</SelectItem>
                <SelectItem value="0.8">80% - High</SelectItem>
                <SelectItem value="0.9">90% - Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSettingsUpdate} className="w-full md:w-auto">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alert History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertHistory.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant="outline">{alert.type}</Badge>
                  </TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {alert.method === 'email' && <Mail className="w-3 h-3" />}
                      {alert.method === 'sms' && <MessageSquare className="w-3 h-3" />}
                      {alert.method === 'push' && <Bell className="w-3 h-3" />}
                      {alert.method}
                    </div>
                  </TableCell>
                  <TableCell>{alert.recipient}</TableCell>
                  <TableCell>
                    <Badge variant={
                      alert.status === 'sent' ? 'default' : 
                      alert.status === 'failed' ? 'destructive' : 
                      'secondary'
                    }>
                      {alert.status}
                    </Badge>
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

export default AlertManagement;
