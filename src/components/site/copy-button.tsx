"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export function CopyButton({ value, className, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // no-op
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label ?? "Copy to clipboard"}
      className={cn(
        "relative inline-grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      <span
        className={cn(
          "col-start-1 row-start-1 transition-all duration-200",
          copied ? "scale-0 opacity-0 rotate-45" : "scale-100 opacity-100"
        )}
      >
        <Copy className="size-3.5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 text-emerald-500 transition-all duration-200",
          copied ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-45"
        )}
      >
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </span>
    </button>
  );
}
