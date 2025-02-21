// useHoverTooltip.tsx
import { useState, useRef } from "react";

export const useHoverTooltip = () => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isTooltipAbove, setIsTooltipAbove] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent, index: number, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      const offsetX = 30;
      const offsetY = 30;

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tooltipWidth = 400;
        const tooltipHeight = 100;

        let x = e.clientX + offsetX;
        let y = e.clientY + offsetY;
        let tooltipAbove = false;

        if (x + tooltipWidth > containerRect.right) x = e.clientX - tooltipWidth - offsetX;
        if (y + tooltipHeight > containerRect.bottom) {
          y = e.clientY - tooltipHeight - offsetY;
          tooltipAbove = true;
        }

        setCursorPosition({ x, y });
        setIsTooltipAbove(tooltipAbove);
        setHoveredRowIndex(index);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredRowIndex(null);
  };

  return { hoveredRowIndex, cursorPosition, isTooltipAbove, handleMouseMove, handleMouseLeave };
};