import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, LayoutDashboard } from "lucide-react"

export default function FinancePage() {
  const stats = [
    { name: "Total Revenue", value: "$45,231.89", trend: "+20.1%", positive: true, icon: Wallet },
    { name: "Subscription Growth", value: "+2,350", trend: "+180.1%", positive: true, icon: TrendingUp },
    { name: "Active Students", value: "+12,234", trend: "+19%", positive: true, icon: BarChart3 },
  ]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black tracking-tight uppercase italic text-white flex items-center gap-3">
          <Wallet className="size-8 text-primary" />
          FINANCE HUB
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.name} className="bg-slate-900/40 border-white/5 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">
                {s.name}
              </CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${s.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {s.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.trend} <span className="text-slate-500 font-medium tracking-tight ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight text-white">Revenue Stream Optimization</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Neural network allocation for academic growth.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-t border-white/5 p-0">
             <div className="text-slate-600 font-black uppercase tracking-[0.2em] text-xs">Analytical Visualization Layer Pending</div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-slate-900/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight text-white">Academic Transactions</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Recent platform engagements.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 pt-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <div className="flex items-center gap-3">
                       <div className="size-8 rounded-lg bg-primary/10 border border-primary/20" />
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-tight">Student Enrollment #{1024 + i}</span>
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Protocol Sync: Operational</span>
                       </div>
                    </div>
                    <span className="text-emerald-400 font-black text-xs">+$199.00</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
