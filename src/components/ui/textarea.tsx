import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
