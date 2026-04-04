"use client"

import { useState } from "react"
import { enrollInClassroom } from "@/lib/actions/classroom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, Loader2, Link2 } from "lucide-react"
import { toast } from "sonner"

export function JoinClassDialog() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await enrollInClassroom(formData)
    
    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Enrolled in classroom successfully!")
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 px-6 gap-2 font-bold bg-background/50 backdrop-blur-sm border-border/40 hover:bg-muted/80 transition-all rounded-xl">
          <Link2 className="size-5" /> Join Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none bg-card/90 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <DialogHeader className="space-y-4">
          <div className="p-3 bg-primary/10 w-fit rounded-2xl border border-primary/20">
            <Search className="size-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-black tracking-tight">Access Classroom</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Enter the unique Class ID shared by your instructor to join the learning environment.
            </DialogDescription>
          </div>
        </DialogHeader>
        <form action={onSubmit} className="space-y-6 py-4">
          <div className="space-y-2.5">
            <label htmlFor="classId" className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 ml-1">
              Classroom ID
            </label>
            <Input
              id="classId"
              name="classId"
              placeholder="e.g. clx123abc..."
              required
              disabled={loading}
              className="h-12 bg-muted/40 border-border/20 focus:border-primary/40 focus:ring-primary/10 rounded-xl px-4 font-bold"
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 font-black tracking-tight rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Verifying Access...
                </>
              ) : (
                "Enroll Now"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
