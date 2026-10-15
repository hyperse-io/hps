'use client';

import React from 'react';
import { Avatar } from '@heroui/react';
import { cn } from '@heroui/react';
import { Icon } from '@iconify/react';

export type ReviewType = {
  user: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  rating: number;
  title: string;
  content: string;
};

export type ReviewProps = React.HTMLAttributes<HTMLDivElement> & ReviewType;

export const Review = ({
  children,
  user,
  title,
  content,
  rating,
  createdAt,
  ...props
}: ReviewProps) => (
  <div {...props}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar size="md">
          <Avatar.Image alt={user.name} src={user.avatar} />
          <Avatar.Fallback>{user.name.charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted text-sm">
            {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(createdAt))}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const isSelected = i + 1 <= rating;

          return (
            <Icon
              key={i}
              className={cn(
                'text-lg sm:text-xl',
                isSelected ? 'text-warning' : 'text-default'
              )}
              icon="solar:star-bold"
            />
          );
        })}
      </div>
    </div>
    <div className="mt-4 w-full">
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-muted mt-2">{content || children}</p>
    </div>
  </div>
);
