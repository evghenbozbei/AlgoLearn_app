import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileFrame }) => {
  if (!isMobileFrame) {
    return <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-3">{children}</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-60px)] py-3 px-2">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800/80 rounded-[32px] shadow-2xl overflow-hidden min-h-[820px] relative flex flex-col ring-1 ring-slate-800">
        {/* Mock Phone Speaker Notch */}
        <div className="w-full h-4 flex justify-center items-center pt-2 select-none">
          <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center gap-2 px-2 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Inner Phone Content */}
        <div className="p-3.5 flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};
