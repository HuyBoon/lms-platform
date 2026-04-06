import { ShieldCheck, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingFeatures() {
    // Đã đưa data ra ngoài để code clean và dễ quản lý hơn
    const features = [
        {
            title: "Huy Hiệu Phép Thuật",
            desc: "Hoàn thành các nhiệm vụ thú vị và nhận huy chương lấp lánh! Khẳng định đẳng cấp siêu học sinh của bạn!",
            icon: ShieldCheck,
            bg: "bg-yellow-400/10",
            border: "border-yellow-400",
            text: "text-yellow-600",
        },
        {
            title: "Rương Kho Báu",
            desc: "Cất giữ mọi tài liệu, bản đồ và sách vở ở một nơi an toàn. Luôn sẵn sàng cho mọi chuyến phiêu lưu tri thức!",
            icon: BookOpen,
            bg: "bg-blue-400/10",
            border: "border-blue-400",
            text: "text-blue-600",
        },
        {
            title: "Bảng Vàng Anh Hùng",
            desc: "Xem ai là người học nhanh nhất vương quốc! Thử thách bạn bè và cùng nhau leo rank mỗi ngày!",
            icon: BarChart3,
            bg: "bg-pink-400/10",
            border: "border-pink-400",
            text: "text-pink-600",
        },
    ];

    return (
        <section
            id="features"
            className="py-32 bg-white relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />
            <div className="container mx-auto px-6 space-y-20 relative z-10">
                <div className="max-w-3xl text-center mx-auto space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">
                        Vùng Đất Khám Phá
                    </h2>
                    <h3 className="text-5xl md:text-6xl font-black text-foreground leading-[1.1] italic uppercase">
                        Hành Trang Trọn Vẹn <br /> Cho Một{" "}
                        <span className="text-secondary">
                            Nhiệm Vụ Hoàn Hảo!
                        </span>
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={cn(
                                "p-10 rounded-[3rem] bg-white border-4 transition-all group bouncy-hover sticker-shadow",
                                f.border,
                            )}
                        >
                            <div
                                className={cn(
                                    "p-4 rounded-2xl w-fit mb-8 shadow-lg group-hover:rotate-12 transition-transform",
                                    f.bg,
                                    f.text,
                                )}
                            >
                                <f.icon className="size-10" />
                            </div>
                            <h4 className="text-3xl font-black text-foreground mb-4 italic uppercase">
                                {f.title}
                            </h4>
                            <p className="text-slate-500 font-bold leading-relaxed text-lg">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
