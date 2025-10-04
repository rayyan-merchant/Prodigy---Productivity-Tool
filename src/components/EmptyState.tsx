
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="rounded-lg bg-muted p-4 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
