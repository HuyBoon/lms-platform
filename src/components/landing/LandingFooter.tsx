import {
    GraduationCap,
    Heart,
    Gamepad2,
    ShieldAlert,
    Users,
    Rocket,
} from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="pt-20 pb-10 bg-white border-t-4 border-dashed border-slate-200 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-tl-full -z-10" />
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    {/* Cột 1: Brand & Mô tả */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 w-fit group bouncy-hover"
                        >
                            <div className="p-2 bg-primary rounded-xl rotate-[-3deg] group-hover:rotate-12 transition-transform shadow-md border-2 border-white">
                                <GraduationCap className="size-6 text-white" />
                            </div>
                            <span className="text-2xl font-black italic text-slate-800 uppercase tracking-tight">
                                HuyBoon PlayHub
                            </span>
                        </Link>
                        <p className="text-slate-500 font-bold max-w-sm text-lg leading-relaxed">
                            Nền tảng học tập kết hợp trò chơi siêu thú vị. Nơi
                            mỗi bài học là một chuyến phiêu lưu kỳ thú!
                        </p>
                    </div>

                    {/* Cột 2: Menu Khám phá */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-black text-slate-800 uppercase italic">
                            Căn Cứ
                        </h4>
                        <div className="flex flex-col gap-4 text-slate-500 font-bold">
                            <Link
                                href="#"
                                className="hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                <Gamepad2 className="size-4 group-hover:-rotate-12 transition-transform" />{" "}
                                Bảng Xếp Hạng
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                <Users className="size-4 group-hover:scale-110 transition-transform" />{" "}
                                Hội Quán (Cộng đồng)
                            </Link>
                        </div>
                    </div>

                    {/* Cột 3: Menu Hỗ trợ */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-black text-slate-800 uppercase italic">
                            Hỗ Trợ
                        </h4>
                        <div className="flex flex-col gap-4 text-slate-500 font-bold">
                            <Link
                                href="#"
                                className="hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                <ShieldAlert className="size-4 group-hover:rotate-12 transition-transform" />{" "}
                                Luật Chơi (Điều khoản)
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                <Heart className="size-4 group-hover:scale-110 transition-transform text-pink-500" />{" "}
                                Trạm Hồi Máu (Help Center)
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Phần Bottom: Copyright & Status */}
                <div className="pt-8 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 font-bold flex items-center gap-2 text-sm md:text-base text-center md:text-left">
                        &copy; {new Date().getFullYear()} HuyBoon PlayHub. Phá
                        đảo bằng
                        <Heart className="size-4 text-pink-500 fill-pink-500 animate-pulse" />
                        & Next.js + Prisma.
                    </p>

                    <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm cursor-default hover:scale-105 transition-transform">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Máy chủ Online
                    </div>
                </div>
            </div>
        </footer>
    );
}
