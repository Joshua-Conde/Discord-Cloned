"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type ActionTooltipProps = {
  label: string; // the "pop-up's" contents
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
};

export default function ActionTooltip({
  label,
  side,
  align,
  children,
}: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
            {/* how come the beginning of every word remains capitalized? answer: ("capitalize" !== "uppercase") */}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
