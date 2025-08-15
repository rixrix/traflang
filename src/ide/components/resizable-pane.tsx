'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizablePaneProps {
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  defaultSplit?: number; // Percentage for top pane (0-100)
  minTopHeight?: number; // Minimum height in pixels
  minBottomHeight?: number;
}

export function ResizablePane({ 
  topContent, 
  bottomContent, 
  defaultSplit = 50,
  minTopHeight = 100,
  minBottomHeight = 100 
}: ResizablePaneProps) {
  const [splitPercent, setSplitPercent] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const relativeY = e.clientY - containerRect.top;
      
      // Calculate percentage
      let newSplitPercent = (relativeY / containerHeight) * 100;
      
      // Apply constraints
      const minTopPercent = (minTopHeight / containerHeight) * 100;
      const minBottomPercent = (minBottomHeight / containerHeight) * 100;
      
      newSplitPercent = Math.max(minTopPercent, newSplitPercent);
      newSplitPercent = Math.min(100 - minBottomPercent, newSplitPercent);
      
      setSplitPercent(newSplitPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minTopHeight, minBottomHeight]);

  return (
    <div ref={containerRef} className="h-full flex flex-col relative">
      {/* Top Pane */}
      <div style={{ height: `${splitPercent}%` }} className="overflow-hidden">
        {topContent}
      </div>
      
      {/* Resizer */}
      <div
        className={`
          relative flex items-center justify-center h-2 
          bg-indigo-100 hover:bg-indigo-200 
          cursor-ns-resize select-none
          transition-colors
          ${isDragging ? 'bg-indigo-300' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 -top-1 -bottom-1" /> {/* Increase hit area */}
        <GripVertical className="w-4 h-4 text-indigo-500" />
      </div>
      
      {/* Bottom Pane */}
      <div style={{ height: `${100 - splitPercent}%` }} className="overflow-hidden">
        {bottomContent}
      </div>
      
      {/* Overlay while dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-ns-resize" />
      )}
    </div>
  );
}