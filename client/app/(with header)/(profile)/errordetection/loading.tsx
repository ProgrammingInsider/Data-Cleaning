// 'use client';
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
// import React from 'react';

// const Loading: React.FC = () => {
//   return (
//     <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full space-y-8">
//       {/* Header Skeleton */}
//       <div className="space-y-3">
//         <Skeleton className="h-8 w-1/3 rounded-md" />
//         <Skeleton className="h-6 w-1/4 rounded-md" />
//       </div>

//       {/* Card Skeleton */}
//       <Card className="p-6">
//         <CardHeader className="space-y-4">
//           <Skeleton className="h-8 w-1/2 rounded-md" />
//           <Skeleton className="h-4 w-2/3 rounded-md" />
//           <Skeleton className="h-4 w-5/6 rounded-md" />
//         </CardHeader>
//         <CardContent>
//           <Skeleton className="h-56 w-full rounded-xl" />
//         </CardContent>
//       </Card>

//       {/* Small Cards Row Skeleton */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <Card key={index} className="p-4">
//             <CardHeader className="flex justify-between items-center">
//               <Skeleton className="h-6 w-1/2 rounded-md" />
//               <Skeleton className="h-6 w-6 rounded-full" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-8 w-1/3 rounded-md" />
//             </CardContent>
//             <CardFooter>
//               <Skeleton className="h-4 w-2/3 rounded-md" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {/* Chart Skeletons */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <Skeleton className="h-64 w-full rounded-lg" />
//         <Skeleton className="h-64 w-full rounded-lg" />
//       </div>

//       {/* Detailed Card Skeleton */}
//       <Card className="p-6">
//         <CardHeader>
//           <Skeleton className="h-6 w-1/3 rounded-md" />
//           <Skeleton className="h-4 w-2/3 rounded-md" />
//         </CardHeader>
//         <CardContent>
//           <Skeleton className="h-56 w-full rounded-lg" />
//         </CardContent>
//       </Card>

//       {/* Button Skeletons */}
//       <div className="flex justify-end gap-4">
//         <Skeleton className="h-10 w-32 rounded-md" />
//         <Skeleton className="h-10 w-32 rounded-md" />
//         <Skeleton className="h-10 w-40 rounded-md" />
//       </div>
//     </div>
//   );
// };

// export default Loading;

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
