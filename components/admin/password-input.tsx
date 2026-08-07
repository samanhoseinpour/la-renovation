"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { adminPasswordField } from "@/content/admin";
import { cn } from "@/lib/utils";

/**
 * Password input with a show/hide toggle. The toggle is a raw button on
 * purpose: ui/Button's own sizing cannot sit inside the field. On fine
 * pointers the compact 28px target is acceptable (the control is redundant;
 * the field works without it); on coarse pointers the field is h-11, so the
 * toggle widens with it and inset-y-1 tracks the taller box automatically.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-9 pointer-coarse:pr-12", className)}
      />
      <button
        type="button"
        aria-label={adminPasswordField.show}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-1 right-1 grid w-7 pointer-coarse:w-10 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
