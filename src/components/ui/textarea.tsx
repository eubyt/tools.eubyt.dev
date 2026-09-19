import * as React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    monospaced?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, monospaced = true, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "w-full min-h-[140px] resize-y rounded-sm border border-input bg-transparent px-3 py-2 text-xs leading-relaxed transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/20",
                    monospaced && "font-mono",
                    className,
                )}
                spellCheck={false}
                {...props}
            />
        );
    },
);

Textarea.displayName = "Textarea";

export { Textarea };
