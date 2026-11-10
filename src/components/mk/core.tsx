import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { ICONS, type IconName } from "./icon-data";
import { cn } from "@/lib/utils";
import type { VerifyStatus } from "@/lib/data";
import { CheckCircle2, AlertTriangle, XCircle, Info, Clock } from "lucide-react";

/** MAKEZI brand line icon (24px grid, 1.75 stroke). */
export function Icon({ name, size = 24, className, label }: { name: IconName; size?: number | undefined; className?: string | undefined; label?: string | undefined }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/** Original MAKEZI mark (logo.svg). Ink follows text colour; dot stays brand pink. */
export function LogoMark({ className, title = "MAKEZI" }: { className?: string | undefined; title?: string | undefined }) {
  return (
    <svg viewBox="0 0 100 61.5" className={className} role="img" aria-label={title}>
      <path
        fill="currentColor"
        d="M66.13,61.49C62.77,61.13 58.87,60.01 56.08,58.61C54.32,57.730 52.090,56.310 51.560,55.750L51.160,55.330L54.060,51.920C55.650,50.050 57.090,48.460 57.250,48.400C57.430,48.330 58.140,48.630 59.100,49.180C64.130,52.060 70.780,52.700 76.290,50.830C79.440,49.770 81.480,48.480 83.980,46.000C86.060,43.940 87.470,41.830 88.550,39.180C91.710,31.390 90.150,22.550 84.520,16.400C76.710,7.850 63.540,7.360 55.210,15.310C53.520,16.930 52.110,18.770 51.070,20.730C49.470,23.730 48.730,26.390 48.550,29.860C48.420,32.360 48.770,35.180 49.480,37.380C50.120,39.370 51.320,41.760 52.500,43.400C53.060,44.180 53.560,44.920 53.600,45.050C53.730,45.370 47.810,52.410 47.410,52.410C46.800,52.410 43.590,48.620 42.200,46.250C38.980,40.740 37.740,35.550 38.080,28.970C38.300,24.660 38.250,22.210 37.900,20.860C37.740,20.220 37.200,18.870 36.710,17.850C35.930,16.280 35.570,15.780 34.250,14.470C32.500,12.710 30.640,11.530 28.430,10.760C27.120,10.300 26.790,10.270 24.330,10.270C21.870,10.270 21.540,10.300 20.230,10.760C16.460,12.060 13.690,14.520 11.950,18.090C11.560,18.880 11.070,20.120 10.850,20.860L10.440,22.190L10.350,39.300C10.250,56.190 10.240,56.430 9.880,57.220C9.310,58.430 8.660,59.100 7.450,59.700C6.620,60.120 6.120,60.250 5.350,60.250C3.130,60.250 1.500,59.280 0.590,57.440L0.090,56.420L0.090,39.300L0.090,22.190L0.500,20.320C1.560,15.510 3.480,11.640 6.560,8.110C9.600,4.640 13.780,2.060 18.270,0.880C20.100,0.400 20.830,0.310 23.280,0.230C27.960,0.070 31.010,0.690 34.850,2.570C39.000,4.600 42.330,7.490 44.920,11.300L45.510,12.180L46.230,11.300C47.560,9.660 50.720,6.690 52.370,5.530C56.860,2.370 61.570,0.660 67.110,0.170C74.400,-0.480 81.850,1.650 87.840,6.090C96.190,12.280 100.830,22.680 100.020,33.370C99.240,43.600 94.400,51.840 85.990,57.250C82.660,59.390 77.890,61.000 73.400,61.490C71.450,61.700 68.130,61.700 66.130,61.490Z"
      />
      <path
        fill="var(--brand-pink)"
        d="M66.98,39.47C63.92,38.73 61.44,36.43 60.41,33.38C59.88,31.81 59.87,29.45 60.38,27.95C61.20,25.58 62.96,23.550 65.140,22.490C66.610,21.770 67.490,21.580 69.250,21.580C71.900,21.570 73.890,22.400 75.860,24.330C77.350,25.790 78.130,27.260 78.450,29.180C79.020,32.670 77.180,36.610 74.120,38.450C72.220,39.600 69.250,40.020 66.980,39.470Z"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string | undefined }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2 text-foreground no-underline", className)} aria-label="MAKEZI میکزی — صفحه‌ی اصلی">
      <LogoMark className="h-7 w-auto" />
      <span className="text-xl font-extrabold">میکزی</span>
    </Link>
  );
}

export const btn = cva(
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-button transition-[background-color,box-shadow,transform] ease-mk active:scale-[.98] disabled:pointer-events-none disabled:bg-muted disabled:text-subtle-foreground no-underline",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        ink: "bg-ink text-ink-foreground hover:bg-ink-hover",
        outline: "border border-foreground bg-transparent text-foreground hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        danger: "border border-error text-error-text bg-transparent hover:bg-error-soft",
      },
      size: { md: "min-h-12 px-5 text-body", sm: "min-h-10 px-4 text-caption", lg: "min-h-14 px-7 text-body-l" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof btn>;
export const Button = forwardRef<HTMLButtonElement, BtnProps>(({ className, variant, size, ...p }, ref) => (
  <button ref={ref} className={cn(btn({ variant, size }), className)} {...p} />
));
Button.displayName = "Button";

/** Signature pink dot — never taller than a letter. */
export const Dot = ({ className }: { className?: string | undefined }) => (
  <span aria-hidden className={cn("inline-block size-2.5 rounded-full bg-pink", className)} />
);

type Tone = "success" | "warning" | "error" | "info" | "neutral" | "brand";
const toneCls: Record<Tone, string> = {
  success: "bg-success-soft text-success-text",
  warning: "bg-warning-soft text-warning-text",
  error: "bg-error-soft text-error-text",
  info: "bg-info-soft text-info-text",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-lime text-brand-ink",
};
const toneIcon = { success: CheckCircle2, warning: Clock, error: XCircle, info: Info, neutral: Info, brand: Info };

/** Status always = icon + word, never colour alone. */
export function StatusBadge({ tone, children, className, icon = true }: { tone: Tone; children: ReactNode; className?: string | undefined; icon?: boolean | undefined }) {
  const I = toneIcon[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label", toneCls[tone], className)}>
      {icon && <I className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}

export function VerifyBadge({ status, className }: { status: VerifyStatus; className?: string | undefined }) {
  if (status === "verified")
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-label text-success-text", className)}>
        <Icon name="verified" size={14} />
        مدارک تأییدشده
      </span>
    );
  if (status === "pending") return <StatusBadge tone="warning" className={className}>در انتظار تأیید</StatusBadge>;
  return (
    <StatusBadge tone="neutral" className={className}>
      تأییدنشده
    </StatusBadge>
  );
}

export function Chip({ active, onClick, children, icon }: { active?: boolean | undefined; onClick?: () => void; children: ReactNode; icon?: IconName | undefined }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-caption font-semibold transition-colors ease-mk",
        active ? "border-selected bg-selected text-selected-foreground" : "border-border-strong bg-surface text-foreground hover:bg-muted",
      )}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

export function Card({ className, children, as: As = "div" }: { className?: string | undefined; children: ReactNode; as?: "div" | "section" | "article" | "li" }) {
  return <As className={cn("rounded-card bg-card p-5 shadow-card", className)}>{children}</As>;
}

/** Marks sample / not-yet-connected content honestly. */
export function DemoNote({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <p className={cn("flex items-start gap-2 rounded-input bg-info-soft px-3 py-2 text-caption text-info-text", className)}>
      <Info className="mt-1 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function DecisionTag({ id, children }: { id: string; children?: ReactNode | undefined }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning px-2 py-0.5 text-label text-warning-text">
      <AlertTriangle className="size-3" aria-hidden />
      تصمیم باز · <bdi dir="ltr" className="font-mono">{id}</bdi>
      {children}
    </span>
  );
}

export function StatePanel({ icon = "search", title, body, action }: { icon?: IconName | undefined; title: string; body?: string | undefined; action?: ReactNode | undefined }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted">
        <Icon name={icon} />
      </span>
      <h3 className="text-h3">{title}</h3>
      {body && <p className="max-w-md text-muted-foreground">{body}</p>}
      {action}
    </div>
  );
}

export function SectionHead({ eyebrow, title, body, action }: { eyebrow?: string | undefined; title: string; body?: string | undefined; action?: ReactNode | undefined }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-caption font-semibold text-muted-foreground">
            <Dot className="size-2" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2">{title}</h2>
        {body && <p className="mt-2 text-body-l text-muted-foreground">{body}</p>}
      </div>
      {action}
    </div>
  );
}

export const Field = ({ label, hint, error, children, htmlFor }: { label: string; hint?: string | undefined; error?: string | undefined; children: ReactNode; htmlFor?: string | undefined }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-caption font-semibold">
      {label}
      {!htmlFor && <span className="mt-1.5 block font-normal">{children}</span>}
    </label>
    {htmlFor && children}
    {error ? (
      <p role="alert" className="flex items-center gap-1 text-caption text-error-text">
        <XCircle className="size-3.5" aria-hidden /> {error}
      </p>
    ) : hint ? (
      <p className="text-caption text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

export const inputCls =
  "min-h-12 w-full rounded-input border border-border-strong bg-surface px-3.5 text-body text-foreground placeholder:text-subtle-foreground focus-visible:border-foreground focus-visible:shadow-[0_0_0_4px_var(--brand-lime)] outline-none transition-[border-color,box-shadow] ease-mk aria-[invalid=true]:border-error";
