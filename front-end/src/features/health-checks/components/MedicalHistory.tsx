import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/badge';
import { History, TrendingUp, Calendar, RefreshCw, FileText, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { useMedicalHistory } from '../hooks/useMedicalHistory';
import type { MedicalHistoryItem } from '../types/health.types';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';

interface MedicalHistoryProps {
  donorId: string;
  donorName?: string;
  showTrends?: boolean;
  limit?: number;
}

export default function MedicalHistory({ 
  donorId, 
  donorName, 
  showTrends = true, 
  limit 
}: MedicalHistoryProps) {
  const { 
    medicalHistory, 
    loading, 
    error, 
    fetchMedicalHistory, 
    refreshHistory,
    getHealthTrends
  } = useMedicalHistory();

  const [filterStatus, setFilterStatus] = useState<'all' | 'fit' | 'unfit'>('all');
  const [showTrendsView, setShowTrendsView] = useState(false);

  useEffect(() => {
    if (donorId) {
      fetchMedicalHistory(donorId);
    }
  }, [donorId, fetchMedicalHistory]);

  const filteredHistory = medicalHistory.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  }).slice(0, limit);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fit': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unfit': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fit': return 'bg-green-100 text-green-800 border-green-200';
      case 'unfit': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fit': return 'Đủ điều kiện';
      case 'unfit': return 'Không đủ điều kiện';
      default: return 'Đang xử lý';
    }
  };

  const trends = getHealthTrends();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải lịch sử khám sức khỏe...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="py-8">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => fetchMedicalHistory(donorId)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-gray-900">
              <History className="h-6 w-6 mr-3 text-blue-600" />
              Lịch sử khám sức khỏe
              {donorName && <span className="ml-2 text-blue-600">- {donorName}</span>}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshHistory}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              {showTrends && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTrendsView(!showTrendsView)}
                  className={showTrendsView ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {showTrendsView ? 'Ẩn biểu đồ' : 'Xem xu hướng'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
      {showTrendsView && trends.weightTrend.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Xu hướng sức khỏe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends.weightTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Cân nặng (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Lịch sử chi tiết ({filteredHistory.length} kết quả)
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="fit">Đủ điều kiện</option>
                <option value="unfit">Không đủ điều kiện</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có lịch sử khám sức khỏe</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium text-gray-900">
                          Khám ngày {new Date(item.date).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Cân nặng:</span>
                      <span className="font-medium ml-1">{item.healthCheck.weight} kg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Nhiệt độ:</span>
                      <span className="font-medium ml-1">{item.healthCheck.temperature} °C</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Huyết áp:</span>
                      <span className="font-medium ml-1">{item.healthCheck.bloodPressure} mmHg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Hemoglobin:</span>
                      <span className="font-medium ml-1">{item.healthCheck.hemoglobin} g/dL</span>
                    </div>
                  </div>
                  {item.healthCheck.note && (
                    <div className="text-sm">
                      <span className="text-gray-600">Ghi chú:</span>
                      <p className="text-gray-800 mt-1">{item.healthCheck.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}