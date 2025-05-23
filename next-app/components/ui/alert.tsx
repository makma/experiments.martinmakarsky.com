import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { AlertCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500 bg-green-50 text-green-800 [&>svg]:text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  { message: string } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">
>(({ message, ...props }, ref) => (
  <Alert ref={ref} variant="destructive" {...props}>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
));
ErrorAlert.displayName = "ErrorAlert";

const SuccessAlert = React.forwardRef<
  HTMLDivElement,
  { message: string } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">
>(({ message, ...props }, ref) => (
  <Alert ref={ref} variant="success" {...props}>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Success</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
));
SuccessAlert.displayName = "SuccessAlert";

export { Alert, AlertTitle, AlertDescription, ErrorAlert, SuccessAlert };
