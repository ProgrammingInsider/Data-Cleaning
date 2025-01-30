'use client';
import { Skeleton } from "@/components/ui/skeleton";
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">

    {/* Projects Grid */}
    <main className="grid grid-cols-6 mt-4 gap-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-span-6 sm:col-span-3 lg:col-span-2">
          <Skeleton className="h-[200px] w-full rounded-lg mb-2" />
          <Skeleton className="h-6 w-[75%] rounded-lg mb-1" />
          <Skeleton className="h-4 w-[50%] rounded-lg" />
        </div>
      ))}
    </main>
  </div>
  );
};

export default Loading;
