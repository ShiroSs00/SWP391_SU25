import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../../utils/helpers';

interface NextDonationDateProps {
  nextEligibleDate: Date | null;
  lastDonationDate?: Date;
}

const NextDonationDate: React.FC<NextDonationDateProps> = ({
  nextEligibleDate,
  lastDonationDate
}) => {
  const now = new Date();
  const isEligible = nextEligibleDate ? now >= nextEligibleDate : true;
  const daysUntilEligible = nextEligibleDate 
    ? Math.ceil((nextEligibleDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Lịch hiến máu tiếp theo
        </h2>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        <div className={`p-4 rounded-lg border-2 ${
          isEligible 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            {isEligible ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-600" />
            )}
            <div>
              <h3 className={`font-semibold ${
                isEligible ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {isEligible ? 'Bạn có thể hiến máu!' : 'Đang trong thời gian chờ'}
              </h3>
              <p className={`text-sm ${
                isEligible ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isEligible 
                  ? 'Bạn đã đủ điều kiện để hiến máu trở lại'
                  : `Còn ${daysUntilEligible} ngày nữa để có thể hiến máu`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Next Eligible Date */}
        {nextEligibleDate && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Ngày có thể hiến lại
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(nextEligibleDate)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatRelativeTime(nextEligibleDate)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        )}

        {/* Last Donation */}
        {lastDonationDate && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Lần hiến gần nhất
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(lastDonationDate)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatRelativeTime(lastDonationDate)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          {isEligible ? (
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
              Đăng ký hiến máu ngay
            </button>
          ) : (
            <button 
              disabled 
              className="w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
            >
              Chưa thể đăng ký ({daysUntilEligible} ngày nữa)
            </button>
          )}
        </div>

        {/* Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Lưu ý về thời gian chờ
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Máu toàn phần: 8 tuần (56 ngày)</li>
                <li>• Hồng cầu: 16 tuần (112 ngày)</li>
                <li>• Huyết tương: 4 tuần (28 ngày)</li>
                <li>• Tiểu cầu: 1 tuần (7 ngày)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextDonationDate;