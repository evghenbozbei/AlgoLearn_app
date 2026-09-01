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
      <div
        style={{
          backgroundColor: 'var(--phone-frame-bg)',
          borderColor: 'var(--phone-frame-border)'
        }}
        className="w-full max-w-md border rounded-[32px] shadow-2xl overflow-hidden min-h-[820px] relative flex flex-col ring-1 ring-slate-700/30 transition-colors duration-200"
      >
        {/* Mock Phone Speaker Notch */}
        <div className="w-full h-4 flex justify-center items-center pt-2 select-none">
          <div
            style={{
              backgroundColor: 'var(--phone-speaker-bg)',
              borderColor: 'var(--phone-frame-border)'
            }}
            className="w-20 h-3.5 rounded-full flex items-center justify-center gap-2 px-2 border"
          >
            <div
              style={{ backgroundColor: 'var(--phone-speaker-pill)' }}
              className="w-2 h-2 rounded-full"
            />
            <div
              style={{ backgroundColor: 'var(--phone-speaker-pill)' }}
              className="w-8 h-1 rounded-full"
            />
          </div>
        </div>

        {/* Inner Phone Content */}
        <div className="p-3.5 flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};
