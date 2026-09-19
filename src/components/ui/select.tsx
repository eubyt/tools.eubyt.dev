import * as React from "react";
import { cn } from "@/utils/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                data-slot="select"
                className={cn(
                    "h-8 min-w-0 cursor-pointer appearance-none rounded-sm border border-input bg-transparent bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat px-2.5 pr-7 text-xs transition-colors outline-none",
                    "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 16 16%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m4 6 4 4 4-4%27/%3E%3C/svg%3E')]",
                    "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    "dark:bg-input/30",
                    className,
                )}
                {...props}
            >
                {children}
            </select>
        );
    },
);

Select.displayName = "Select";

export { Select };
