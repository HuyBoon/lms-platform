import { Settings as SettingsIcon, Shield, Bell, Palette, User, HardDrive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">
            Cài đặt hệ thống
          </h2>
          <p className="text-muted-foreground font-medium">
            Quản lý cấu hình trải nghiệm và bảo mật tài khoản của bạn.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-primary/10 shadow-xl sticker-shadow transition-all hover:scale-[1.02] bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-2">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <User className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black italic uppercase">Tài khoản</CardTitle>
              <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-primary/60">Quản lý định danh</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <Label className="font-bold">Công khai hồ sơ</Label>
                <Switch defaultChecked />
             </div>
             <p className="text-xs text-muted-foreground italic font-medium">Cho phép người khác tìm thấy bạn trên bảng xếp hạng thế giới.</p>
             <Button variant="outline" className="w-full rounded-xl border-2 font-black italic uppercase">Chỉnh sửa hồ sơ</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/10 shadow-xl sticker-shadow transition-all hover:scale-[1.02] bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-2">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <Bell className="size-6 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black italic uppercase">Thông báo</CardTitle>
              <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-secondary/60">Cập nhật hành trình</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <Label className="font-bold">Nhận thông báo đẩy</Label>
                <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between">
                <Label className="font-bold">Email nhắc nhở học</Label>
                <Switch />
             </div>
             <p className="text-xs text-muted-foreground italic font-medium">Chúng tôi sẽ gửi rồng đưa thư khi có bài học mới.</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-400/10 shadow-xl sticker-shadow transition-all hover:scale-[1.02] bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-2">
            <div className="p-3 bg-pink-400/10 rounded-2xl">
              <Palette className="size-6 text-pink-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-black italic uppercase">Giao diện</CardTitle>
              <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-pink-400/60">Tùy biến không gian</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <Label className="font-bold">Chế độ tối (Dark Mode)</Label>
                <Switch />
             </div>
             <div className="flex items-center justify-between">
                <Label className="font-bold">Giảm chuyển động</Label>
                <Switch />
             </div>
             <p className="text-xs text-muted-foreground italic font-medium">Làm cho thế giới trở nên lung linh hoặc tĩnh lặng tùy ý bạn.</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-primary/10 h-1 rounded-full" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-slate-200 shadow-lg bg-slate-50/50 rounded-[2rem]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-slate-500" />
              <CardTitle className="text-lg font-black italic uppercase">Bảo mật & Quyền riêng tư</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
                <div>
                  <p className="font-black italic uppercase text-sm">Xác thực 2 yếu tố (2FA)</p>
                  <p className="text-xs text-muted-foreground">Tăng cường bảo vệ rương báu của bạn.</p>
                </div>
                <Button size="sm" className="rounded-xl font-bold italic">Kích hoạt</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
                <div>
                  <p className="font-black italic uppercase text-sm">Quản lý phiên đăng nhập</p>
                  <p className="text-xs text-muted-foreground">Kiểm tra các thiết bị đang truy cập.</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl font-bold italic">Xem thêm</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 shadow-lg bg-slate-50/50 rounded-[2rem]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HardDrive className="size-5 text-slate-500" />
              <CardTitle className="text-lg font-black italic uppercase">Dữ liệu & Tài nguyên</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
                <div>
                  <p className="font-black italic uppercase text-sm">Tải xuống dữ liệu</p>
                  <p className="text-xs text-muted-foreground">Xuất lịch sử học tập của bạn.</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl font-bold italic">Tải về</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-2xl border-2 border-destructive/10 shadow-sm">
                <div>
                  <p className="font-black italic uppercase text-sm text-destructive">Xóa tài khoản</p>
                  <p className="text-xs text-destructive/60">Mọi hành trình của bạn sẽ bị xóa vĩnh viễn.</p>
                </div>
                <Button size="sm" variant="destructive" className="rounded-xl font-bold italic">Xóa ngay</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
