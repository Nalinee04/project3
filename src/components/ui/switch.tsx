// app/components/ui/switch.tsx
"use client";

import { useEffect, useRef } from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: () => void;
  children: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, children }) => {
  const switchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.setAttribute("aria-checked", String(checked));
    }
  }, [checked]);

  return (
    <div
      ref={switchRef}
      role="switch"
      tabIndex={0}
      onClick={onCheckedChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange();
        }
      }}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${checked ? 'bg-green-600' : 'bg-gray-400'}`}
    >
      <span className={`transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'} inline-block w-5 h-5 bg-white rounded-full`}></span>
      <span className="ml-3">{children}</span>
    </div>
  );
};

export default Switch;
