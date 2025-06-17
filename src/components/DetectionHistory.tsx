
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  timestamp: string;
  source: string;
  detections: number;
  suspiciousCount: number;
  confidence: number;
  status: 'completed' | 'failed' | 'processing';
}

const DetectionHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const { toast } = useToast();

  // Generate mock history data
  useEffect(() => {
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        timestamp: '2024-01-15 14:30:25',
        source: 'camera_feed_01.mp4',
        detections: 15,
        suspiciousCount: 3,
        confidence: 0.87,
        status: 'completed'
      },
      {
        id: '2',
        timestamp: '2024-01-15 13:22:10',
        source: 'uploaded_video.mp4',
        detections: 8,
        suspiciousCount: 1,
        confidence: 0.72,
        status: 'completed'
      },
      {
        id: '3',
        timestamp: '2024-01-15 12:45:33',
        source: 'live_camera',
        detections: 22,
        suspiciousCount: 5,
        confidence: 0.91,
        status: 'completed'
      },
      {
        id: '4',
        timestamp: '2024-01-15 11:18:45',
        source: 'security_cam_02.mp4',
        detections: 6,
        suspiciousCount: 0,
        confidence: 0.65,
        status: 'failed'
      },
      {
        id: '5',
        timestamp: '2024-01-15 10:30:12',
        source: 'parking_lot.jpg',
        detections: 12,
        suspiciousCount: 2,
        confidence: 0.83,
        status: 'completed'
      }
    ];
    setHistory(mockHistory);
    setFilteredHistory(mockHistory);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = history;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    if (filterDate !== 'all') {
      const today = new Date();
      const filterDays = parseInt(filterDate);
      const cutoffDate = new Date(today.getTime() - (filterDays * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(item => 
        new Date(item.timestamp) >= cutoffDate
      );
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, filterStatus, filterDate]);

  const exportHistory = () => {
    const csvContent = [
      ['Timestamp', 'Source', 'Total Detections', 'Suspicious Count', 'Confidence', 'Status'],
      ...filteredHistory.map(item => [
        item.timestamp,
        item.source,
        item.detections.toString(),
        item.suspiciousCount.toString(),
        (item.confidence * 100).toFixed(1) + '%',
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detection_history.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Detection history exported to CSV file",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'processing': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detection History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by source name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportHistory} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* History Table */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No detection history found</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{item.source}</h3>
                        <Badge variant={getStatusColor(item.status) as "default" | "destructive" | "secondary"}>
                          {item.status}
                        </Badge>
                        {item.suspiciousCount > 0 && (
                          <Badge variant="destructive">
                            {item.suspiciousCount} Suspicious
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Processed: {item.timestamp}</p>
                        <div className="flex gap-4">
                          <span>Total Detections: {item.detections}</span>
                          <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionHistory;
