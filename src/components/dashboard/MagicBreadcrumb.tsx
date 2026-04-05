"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChevronRight, 
  Sparkles, 
  Home,
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Sword,
  ScrollText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ElementType | React.ReactNode
  isLast?: boolean
}

const ICON_MAP: Record<string, any> = {
  dashboard: LayoutDashboard,
  class: BookOpen,
  student: Sword,
  teacher: ScrollText,
  profile: User,
  settings: Settings,
  worlds: Home,
}

export function MagicBreadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((segment) => segment !== "")

  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const isLast = index === pathSegments.length - 1
    
    // Capitalize and format label
    // If it looks like a cuid/id (starts with c and long), we might want to handle it, 
    // but for now let's just capitalize
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    if (segment.length > 20) label = "Enchanted Realm" // Placeholder for IDs

    return {
      label,
      href,
      icon: ICON_MAP[segment.toLowerCase()],
      isLast
    }
  })

  // Add Home/Dashboard to the start if not present
  if (breadcrumbs.length === 0 || breadcrumbs[0].href !== "/dashboard") {
    breadcrumbs.unshift({
      label: "PlayRoom",
      href: "/dashboard",
      icon: Home, // Consistency: use Component, not Element
      isLast: breadcrumbs.length === 0
    })
  }

  return (
    <nav aria-label="Magic Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-3">
        {breadcrumbs.map((crumb, index) => {
          const Icon = crumb.icon as any
          const isHome = crumb.href === "/dashboard"

          const renderIcon = (comp: any, cls: string) => {
            if (!comp) return null;
            if (React.isValidElement(comp)) return comp;
            // Handle Lucide components (which are objects with $$typeof/render) or functional components
            if (typeof comp === 'function' || (typeof comp === 'object' && comp !== null)) {
              const Comp = comp;
              return <Comp className={cls} />;
            }
            return null;
          };

          return (
            <React.Fragment key={crumb.href}>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                {crumb.isLast ? (
                  <div 
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black italic uppercase text-xs tracking-widest transition-all select-none",
                      "bg-primary/10 border-primary text-primary sticker-shadow-sm scale-105"
                    )}
                  >
                    {renderIcon(Icon, "size-3.5")}
                    {crumb.label}
                    <Sparkles className="size-3 fill-primary animate-pulse" />
                  </div>
                ) : (
                  <Link
                    href={crumb.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-400 font-black italic uppercase text-xs tracking-widest transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5 active:scale-95 group bouncy-hover"
                    )}
                  >
                   {renderIcon(Icon, "size-3.5 group-hover:scale-110 transition-transform")}
                   <span className="hidden md:inline">{crumb.label}</span>
                  </Link>
                )}
              </motion.li>
              
              {!crumb.isLast && (
                <motion.li
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                  className="text-slate-300"
                >
                  <ChevronRight className="size-4 stroke-[3]" />
                </motion.li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
