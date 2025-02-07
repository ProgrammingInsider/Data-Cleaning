'use client';

import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#007185] rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
