import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "default" | "light";
};

export function Logo({ className, variant = "default" }: Props) {
  const tone = variant === "light" ? "text-white" : "text-celsius-500";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={tone}
      >
        <path
          d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          variant === "light" ? "text-white" : "text-celsius-500"
        )}
      >
        Celsius
      </span>
    </div>
  );
}
