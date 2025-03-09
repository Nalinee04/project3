

import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1: รอดำเนินการ, 2: เตรียมอาหาร, 3: เสร็จแล้ว
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = ['รอดำเนินการ', 'เตรียมอาหาร', 'เสร็จแล้ว']; // ✅ เหลือ 3 สถานะ

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                index + 1 <= currentStep ? 'bg-yellow-500' : 'bg-gray-300'
              } flex items-center justify-center`}
            >
              {index + 1 <= currentStep ? (
                <span className="text-white font-semibold">{index + 1}</span>
              ) : (
                <span className="text-gray-500">{index + 1}</span>
              )}
            </div>
            <p className="text-xs">{step}</p>
          </div>
        ))}
      </div>
      <div className="h-1 w-full bg-gray-300">
        <div
          className={`h-full bg-yellow-500`} // ✅ เปลี่ยนเป็นสีเหลือง
          style={{
            width: `${((currentStep) / steps.length) * 100}%`, 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
