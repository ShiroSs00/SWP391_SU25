import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import WrapperSection from "../../components/sections/wrapperSection.tsx";
import GroupedHeading from "../../components/sections/GroupedHeading.tsx";

const bloodTypeData = {
  "A+": {
    name: "A Dương tính",
    percentage: "34%",
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    canDonateTo: ["A+", "AB+"],
    description: "Nhóm máu phổ biến thứ hai, chiếm 34% dân số Việt Nam.",
    characteristics: [
      "Có kháng nguyên A trên hồng cầu",
      "Có kháng thể Anti-B trong huyết tương",
      "Có yếu tố Rh dương tính",
    ],
    tips: [
      "Có thể hiến máu cho nhóm A+ và AB+",
      "Nhu cầu hiến máu thường xuyên và ổn định",
      "Phù hợp cho hầu hết các ca phẫu thuật thông thường",
    ],
  },
  "A-": {
    name: "A Âm tính",
    percentage: "6%",
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    description: "Nhóm máu hiếm, chỉ chiếm 6% dân số và rất cần thiết.",
    characteristics: [
      "Có kháng nguyên A trên hồng cầu",
      "Có kháng thể Anti-B trong huyết tương",
      "Không có yếu tố Rh (âm tính)",
    ],
    tips: [
      "Rất quý giá vì có thể hiến cho cả A+ và A-",
      "Thường xuyên thiếu hụt trong ngân hàng máu",
      "Cần thiết cho phụ nữ mang thai có Rh âm",
    ],
  },
  "B+": {
    name: "B Dương tính",
    percentage: "9%",
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    canDonateTo: ["B+", "AB+"],
    description: "Nhóm máu ít phổ biến, chiếm 9% dân số.",
    characteristics: [
      "Có kháng nguyên B trên hồng cầu",
      "Có kháng thể Anti-A trong huyết tương",
      "Có yếu tố Rh dương tính",
    ],
    tips: [
      "Có thể hiến máu cho nhóm B+ và AB+",
      "Cần thiết cho cộng đồng có tỷ lệ nhóm B cao",
      "Thường cần thiết trong các ca cấp cứu",
    ],
  },
  "B-": {
    name: "B Âm tính",
    percentage: "1%",
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    description: "Nhóm máu rất hiếm, chỉ chiếm 1% dân số.",
    characteristics: [
      "Có kháng nguyên B trên hồng cầu",
      "Có kháng thể Anti-A trong huyết tương",
      "Không có yếu tố Rh (âm tính)",
    ],
    tips: [
      "Cực kỳ quý hiếm và cần thiết",
      "Thường xuyên trong tình trạng khan hiếm",
      "Rất quan trọng cho các ca cấp cứu đặc biệt",
    ],
  },
  "AB+": {
    name: "AB Dương tính",
    percentage: "5%",
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canDonateTo: ["AB+"],
    description: "Nhóm máu đa năng về nhận máu, chiếm 5% dân số.",
    characteristics: [
      "Có cả kháng nguyên A và B trên hồng cầu",
      "Không có kháng thể Anti-A, Anti-B",
      "Có yếu tố Rh dương tính",
    ],
    tips: [
      "Có thể nhận máu từ tất cả các nhóm máu",
      "Chỉ có thể hiến cho nhóm AB+",
      "Huyết tương AB có thể hiến cho nhiều nhóm",
    ],
  },
  "AB-": {
    name: "AB Âm tính",
    percentage: "0.5%",
    canReceiveFrom: ["A-", "B-", "AB-", "O-"],
    canDonateTo: ["AB+", "AB-"],
    description: "Nhóm máu hiếm nhất, chỉ chiếm 0.5% dân số.",
    characteristics: [
      "Có cả kháng nguyên A và B trên hồng cầu",
      "Không có kháng thể Anti-A, Anti-B",
      "Không có yếu tố Rh (âm tính)",
    ],
    tips: [
      "Cực kỳ hiếm và quý giá",
      "Có thể nhận máu từ các nhóm Rh âm",
      "Huyết tương AB- rất cần thiết",
    ],
  },
  "O+": {
    name: "O Dương tính",
    percentage: "44%",
    canReceiveFrom: ["O+", "O-"],
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    description: "Nhóm máu phổ biến nhất, chiếm 44% dân số Việt Nam.",
    characteristics: [
      "Không có kháng nguyên A, B trên hồng cầu",
      "Có kháng thể Anti-A và Anti-B",
      "Có yếu tố Rh dương tính",
    ],
    tips: [
      "Có thể hiến cho tất cả nhóm máu Rh dương",
      "Nhu cầu hiến máu rất cao",
      "Là nhóm máu được sử dụng nhiều nhất",
    ],
  },
  "O-": {
    name: "O Âm tính",
    percentage: "0.5%",
    canReceiveFrom: ["O-"],
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    description:
      'Nhóm máu hiếm và quý giá nhất, là "người hiến máu toàn năng".',
    characteristics: [
      "Không có kháng nguyên A, B trên hồng cầu",
      "Có kháng thể Anti-A và Anti-B",
      "Không có yếu tố Rh (âm tính)",
    ],
    tips: [
      "Có thể hiến cho tất cả các nhóm máu",
      "Cực kỳ quý giá trong cấp cứu",
      "Chỉ có thể nhận máu từ O-",
    ],
  },
};

const BloodTypes: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    let typeParam = searchParams.get("type");
    if (typeParam) {
      // Chuyển dấu cách về dấu +
      typeParam = typeParam.replace(/ /g, "+");
      setSelectedType(typeParam);
    } else {
      setSelectedType(null);
    }
  }, [searchParams]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    navigate(`?type=${type}`);
  };

  const handleBackToOverview = () => {
    setSelectedType(null);
    navigate("/blood-types");
  };

  const renderBloodTypeGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Object.entries(bloodTypeData).map(([type, data]) => (
        <div
          key={type}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === type
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-red-300"
          }`}
          onClick={() => handleTypeSelect(type)}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">{type}</div>
            <div className="text-sm text-gray-600 mb-1">{data.name}</div>
            <div className="text-lg font-semibold text-gray-800">
              {data.percentage}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBloodTypeDetail = () => {
    if (!selectedType) return null;

    const data = bloodTypeData[selectedType as keyof typeof bloodTypeData];
    if (!data) {
      return (
        <div>
          <p>Không tìm thấy thông tin nhóm máu này.</p>
          <button
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
            onClick={handleBackToOverview}
          >
            Quay lại danh sách
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-red-600">
                {selectedType}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{data.name}</h3>
              <p className="text-gray-600">Chiếm {data.percentage} dân số</p>
            </div>
          </div>
          <button
            onClick={handleBackToOverview}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Quay lại
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{data.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Có thể nhận máu từ:
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.canReceiveFrom.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Có thể hiến máu cho:
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.canDonateTo.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Đặc điểm sinh học:
            </h4>
            <ul className="space-y-2">
              {data.characteristics.map((char, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Thông tin hữu ích:
            </h4>
            <ul className="space-y-2">
              {data.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WrapperSection>
        <div className="max-w-6xl mx-auto py-8">
          <GroupedHeading
            title="Thông tin nhóm máu"
            description="Tìm hiểu về các nhóm máu và khả năng tương thích"
          />

          {!selectedType && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg">
                  Chọn nhóm máu để xem thông tin chi tiết về khả năng hiến và
                  nhận máu
                </p>
              </div>
              {renderBloodTypeGrid()}

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Thông tin quan trọng
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Người hiến máu toàn năng:
                    </h4>
                    <p className="text-gray-600">
                      Nhóm máu O- có thể hiến cho tất cả các nhóm máu khác, được
                      gọi là "người hiến máu toàn năng".
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Người nhận máu toàn năng:
                    </h4>
                    <p className="text-gray-600">
                      Nhóm máu AB+ có thể nhận máu từ tất cả các nhóm máu khác,
                      được gọi là "người nhận máu toàn năng".
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedType && renderBloodTypeDetail()}
        </div>
      </WrapperSection>
    </div>
  );
};

export default BloodTypes;