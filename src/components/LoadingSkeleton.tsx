
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'card' | 'list' | 'chart' | 'form';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type,
  count = 1
}) => {
  const renderCardSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-20 w-full" />
      <div className="pt-4">
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'chart':
        return renderChartSkeleton();
      case 'form':
        return renderFormSkeleton();
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
