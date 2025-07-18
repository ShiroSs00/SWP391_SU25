import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { AdminEvent } from '../types/admin.types';

const eventSchema = z.object({
  nameOfEvent: z.string().min(1, 'Tên sự kiện là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  expectedBloodVolume: z.number().min(0, 'Số lượng máu dự kiến phải >= 0').optional(),
  actualVolume: z.number().min(0, 'Số lượng máu thực tế phải >= 0').optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED']),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: AdminEvent;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EVENT_STATUSES = [
  'UPCOMING',
  'ONGOING',
  'COMPLETED',
] as const;

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      nameOfEvent: event?.nameOfEvent || '',
      location: event?.location || '',
      startDate: event?.startDate?.split('T')[0] || '',
      endDate: event?.endDate?.split('T')[0] || '',
      expectedBloodVolume: event?.expectedBloodVolume || 0,
      actualVolume: event?.actualVolume || 0,
      status: event?.status as any || 'UPCOMING',
    }
  });

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sự kiện *
              </label>
              <input
                {...register('nameOfEvent')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập tên sự kiện"
              />
              {errors.nameOfEvent && (
                <p className="mt-1 text-sm text-red-600">{errors.nameOfEvent.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm *
              </label>
              <input
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nhập địa điểm tổ chức"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                {...register('startDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc
              </label>
              <input
                {...register('endDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dự kiến (đơn vị máu)
              </label>
              <input
                {...register('expectedBloodVolume', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.expectedBloodVolume && (
                <p className="mt-1 text-sm text-red-600">{errors.expectedBloodVolume.message}</p>
              )}
            </div>

            {event && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máu đã nhận (đơn vị máu)
                </label>
                <input
                  {...register('actualVolume', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.actualVolume && (
                  <p className="mt-1 text-sm text-red-600">{errors.actualVolume.message}</p>
                )}
              </div>
            )}

            <div className={event ? '' : 'md:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {EVENT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || isLoading ? 'Đang xử lý...' : (event ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;