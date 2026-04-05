"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button-variants"

import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  loading,
  disabled,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={loading || disabled}
      className={cn(buttonVariants({ variant, size, className }), loading && "opacity-70 cursor-not-allowed")}
      {...props}
    />
  )
}

export { Button, buttonVariants }
