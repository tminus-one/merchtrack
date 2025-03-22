 
 
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PropType = {
  selected: boolean
  onClick: () => void
  index: string
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, onClick, index } = props;

  return (
    <div
      className={cn(
        "flex-none cursor-pointer overflow-hidden rounded-lg transition-all duration-200 hover:opacity-90",
        "relative w-[28%] md:w-24 aspect-[3/2]",
        selected ? "ring-2 ring-primary" : "ring-1 ring-gray-200",
      )}
      onClick={onClick}
      aria-label={selected ? "Current slide" : "Go to slide"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <Image 
        className="size-full object-cover"
        src={index}
        alt="Product thumbnail"
        fill
        sizes="(max-width: 768px) 28vw, 96px"
      />
    </div>
  );
};
