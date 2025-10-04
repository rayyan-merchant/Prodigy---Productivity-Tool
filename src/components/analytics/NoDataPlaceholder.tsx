
import React from 'react';
import { ClipboardList } from "lucide-react";

const NoDataPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-lg bg-muted p-4">
        <ClipboardList className="h-12 w-12 text-muted-foreground/70" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No Data</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
        Complete some focus sessions or tasks to see your analytics here.
      </p>
    </div>
  );
};

export default NoDataPlaceholder;
