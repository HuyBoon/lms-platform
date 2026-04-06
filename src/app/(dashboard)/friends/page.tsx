import { Users, UserPlus, Search, MessageSquare, Trophy, Star, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FRIENDS_LIST = [
  {
    id: "1",
    name: "Huy Boon",
    level: 42,
    xp: 12500,
    status: "online",
    avatar: "https://github.com/shadcn.png",
    role: "Huyền thoại",
    lastSeen: "Đang học 'Mastering React'",
  },
  {
    id: "2",
    name: "Trần Anh",
    level: 28,
    xp: 8400,
    status: "offline",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    role: "Chiến binh",
    lastSeen: "2 giờ trước",
  },
  {
    id: "3",
    name: "Lê Minh",
    level: 15,
    xp: 3200,
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    role: "Tân binh",
    lastSeen: "Đang trong 'World 1-1'",
  },
];

export default function FriendsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground flex items-center gap-3">
            Hội anh em <Users className="size-8 text-pink-500" />
          </h2>
          <p className="text-muted-foreground font-medium">
            Kết nối với những người chơi khác và cùng nhau chinh phục tri thức.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl font-black italic uppercase bg-pink-500 hover:bg-pink-600 sticker-shadow shadow-lg shadow-pink-500/20 px-6">
            <UserPlus className="mr-2 size-5" /> Thêm bạn mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl border-2 border-slate-100">
            <TabsTrigger value="all" className="rounded-xl px-6 font-black italic uppercase data-[state=active]:bg-white data-[state=active]:shadow-md">Tất cả</TabsTrigger>
            <TabsTrigger value="online" className="rounded-xl px-6 font-black italic uppercase data-[state=active]:bg-white data-[state=active]:shadow-md">Trực tuyến</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-xl px-6 font-black italic uppercase data-[state=active]:bg-white data-[state=active]:shadow-md">Lời mời</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm đồng đội..." 
              className="pl-10 rounded-2xl border-2 border-slate-100 focus:border-pink-500 transition-all font-bold italic"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FRIENDS_LIST.map((friend) => (
              <Card key={friend.id} className="border-2 border-slate-100 shadow-xl sticker-shadow transition-all hover:scale-[1.02] bg-white rounded-[2rem] overflow-hidden group">
                <CardHeader className="relative pb-0">
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200 font-black italic uppercase text-[10px]">
                      Lv. {friend.level}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="size-24 border-4 border-white shadow-xl sticker-shadow rounded-[1.5rem]">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="rounded-[1.5rem] bg-pink-500 text-white font-black text-xl">
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 size-6 rounded-full border-4 border-white shadow-sm ${friend.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                    <CardTitle className="mt-4 text-xl font-black italic uppercase text-center">{friend.name}</CardTitle>
                    <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-pink-500 text-center opacity-80">{friend.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400 italic">Kinh nghiệm</p>
                        <p className="font-black italic text-sm">{friend.xp.toLocaleString()} XP</p>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400 italic">Thành tựu</p>
                        <p className="font-black italic text-sm">12</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full py-1.5 rounded-xl border-2 border-slate-100 text-slate-500 font-bold italic text-xs mb-2">
                    {friend.lastSeen}
                  </Badge>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pb-6 px-6">
                  <Button variant="outline" className="rounded-xl border-2 font-black italic uppercase text-xs h-10 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all">
                    <MessageSquare className="mr-2 size-4" /> Nhắn tin
                  </Button>
                  <Button variant="outline" className="rounded-xl border-2 font-black italic uppercase text-xs h-10 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-all">
                    <Trophy className="mr-2 size-4" /> Thách đấu
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add Friend Card Slot */}
            <Card className="border-2 border-dashed border-slate-200 shadow-none bg-slate-50/50 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center min-h-[350px] group hover:border-pink-300 transition-all cursor-pointer">
              <div className="size-16 rounded-[1.5rem] bg-white border-2 border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all sticker-shadow">
                <UserPlus className="size-8 text-slate-400 group-hover:text-pink-500" />
              </div>
              <h3 className="text-lg font-black italic uppercase text-slate-400 group-hover:text-pink-500">Mở rộng đội ngũ</h3>
              <p className="text-xs font-medium text-slate-400 mt-2">Học tập cùng bạn bè để nhận x2 XP!</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="rounded-[2.5rem] border-4 border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden">
         <div className="absolute -right-10 -bottom-10 size-64 bg-primary/10 rounded-full blur-3xl" />
         <div className="absolute -left-10 -top-10 size-64 bg-secondary/10 rounded-full blur-3xl" />
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="p-6 bg-white rounded-3xl sticker-shadow border-4 border-primary/10 rotate-3">
                <Zap className="size-16 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">Thử thách đồng đội tuần này</h3>
                <p className="text-muted-foreground font-bold italic mb-4">Cùng 2 người bạn hoàn thành 5 bài học để nhận Huy hiệu <span className="text-primary uppercase">'Tam ca Sấm sét'</span></p>
                <div className="w-full h-4 bg-white rounded-full overflow-hidden border-2 border-primary/10 p-1">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }} />
                </div>
            </div>
            <Button className="rounded-2xl font-black italic uppercase bg-primary hover:bg-primary/90 sticker-shadow shadow-xl px-10 h-14 text-lg">
                Gia nhập
            </Button>
         </CardContent>
      </Card>
    </div>
  );
}
