import React from 'react';
import { cn } from '@heroui/react';
import type { ReviewType } from './review';
import { Review } from './review';

export type CardReviewProps = React.HTMLAttributes<HTMLDivElement> & ReviewType;

export const CardReview = ({ className, ...review }: CardReviewProps) => {
  return (
    <div
      className={cn('rounded-medium bg-content1 shadow-small p-5', className)}
    >
      <Review {...review} />
    </div>
  );
};
