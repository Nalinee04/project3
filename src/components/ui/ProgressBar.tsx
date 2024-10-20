// app/components/ui/ProgressBar.tsx

import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 0: รอดำเนินการ, 1: เตรียมของจัดส่ง, 2: จัดส่งแล้ว
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = ['รอดำเนินการ', 'เตรียมของจัดส่ง', 'จัดส่งแล้ว'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
              } flex items-center justify-center`}
            >
              {index <= currentStep ? (
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
          className={`h-full bg-green-500`}
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
