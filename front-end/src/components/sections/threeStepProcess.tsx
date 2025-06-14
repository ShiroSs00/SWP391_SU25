import React from 'react';
import clsx from 'clsx';
import ProcessStep from './processStep'; // Import component ProcessStep có sẵn

// Interface cho từng bước trong quy trình
interface ProcessStepData {
    step: number;
    title: string;
    description: string;
}

// Props cho component ThreeStepProcess chính
interface ThreeStepProcessProps {
    steps?: ProcessStepData[];
}

// Component chính hiển thị toàn bộ quy trình 3 bước
const ThreeStepProcess: React.FC<ThreeStepProcessProps> = ({ steps }) => {
    // Default steps nếu không được truyền từ props
    const defaultSteps: ProcessStepData[] = [
        {
            step: 1,
            title: 'Đăng ký',
            description: 'Điền thông tin và đặt lịch hiến máu phù hợp với lịch trình của bạn.',
        },
        {
            step: 2,
            title: 'Khám sàng lọc',
            description: 'Kiểm tra sức khỏe tổng quát và xét nghiệm máu cơ bản để đảm bảo an toàn.',
        },
        {
            step: 3,
            title: 'Hiến máu',
            description: 'Quá trình hiến máu an toàn và nhanh chóng trong vòng 10-15 phút.',
        },
    ];

    const processSteps = steps || defaultSteps;

    return (
        <section className={clsx('py-12')}>
            <div className={clsx('container mx-auto px-4')}>
                <h2 className={clsx('text-3xl font-bold text-center mb-12 text-gray-900')}>
                    Quy trình hiến máu
                </h2>

                {/* Desktop layout - horizontal */}
                <div className="hidden md:block">
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection lines for desktop */}
                        <div className="absolute top-6 left-1/6 right-1/6 h-0.5 bg-gray-300 z-0"></div>

                        {processSteps.map((step) => (
                            <div key={step.step} className="relative z-10 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full text-xl font-bold mb-4">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile layout - vertical */}
                <div className="md:hidden space-y-6">
                    {processSteps.map((step, index) => (
                        <div key={step.step} className="relative">
                            {/* Connection line for mobile */}
                            {index < processSteps.length - 1 && (
                                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-300"></div>
                            )}

                            <ProcessStep
                                stepNumber={step.step}
                                title={step.title}
                                description={step.description}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom call to action */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-6 text-lg">
                        Sẵn sàng bắt đầu hành trình hiến máu của bạn?
                    </p>
                    <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg">
                        Đăng ký hiến máu ngay
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ThreeStepProcess;
export type { ProcessStepData, ThreeStepProcessProps };