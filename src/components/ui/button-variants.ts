import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_#B89600] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#B89600] rounded-2xl",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[4px_4px_0px_0px_#CC0000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#CC0000] rounded-2xl",
        outline:
          "border-4 border-primary bg-transparent text-primary hover:bg-primary/5 rounded-2xl",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_#2D8CD6] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#2D8CD6] rounded-2xl",
        ghost: "hover:bg-primary/10 text-primary rounded-2xl shadow-[4px_4px_0px_0px_transparent] hover:shadow-[2px_2px_0px_0px_transparent]",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_#D14D8F] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#D14D8F] rounded-2xl",
      },
      size: {
        default: "h-12 px-6 rounded-2xl",
        sm: "h-10 px-4 text-xs rounded-2xl",
        lg: "h-14 px-10 text-lg rounded-2xl",
        icon: "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
