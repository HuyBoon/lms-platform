"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginUser } from "@/lib/actions/auth";

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl =
        searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
    const [loading, setLoading] = useState(false);

    const handleSocialClick = (provider: "google") => {
        signIn(provider, {
            callbackUrl,
        });
    };

    async function onSubmit(formData: FormData) {
        setLoading(true);
        const result = await loginUser(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    }

    return (
        <Card className="w-100 border-4 border-slate-200 rounded-[2.5rem] sticker-shadow overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pt-10 pb-6">
                <CardTitle className="text-4xl font-black tracking-tight text-foreground uppercase italic underline decoration-yellow-400 decoration-8 underline-offset-4 mb-2">
                    Thời gian Khám phá!
                </CardTitle>
                <CardDescription className="text-slate-500 font-bold text-lg italic uppercase tracking-wider">
                    Quay lại cuộc phiêu lưu của bạn ngay!
                </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-10 space-y-8">
                <div className="space-y-6">
                    {/* Social Login */}
                    <button
                        onClick={() => handleSocialClick("google")}
                        className="w-full h-16 bg-white border-4 border-slate-100 rounded-2xl sticker-shadow-sm flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <FcGoogle className="size-8" />
                        <span className="font-black italic uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors">
                            Đăng nhập Google
                        </span>
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-4 border-slate-100 border-dashed" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase italic">
                            <span className="bg-white px-4 py-1 text-slate-300 font-black tracking-[0.3em]">
                                HOẶC SỬ DỤNG KHÓA
                            </span>
                        </div>
                    </div>

                    <form action={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">
                                    Email Bí mật
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="hero@playhub.com"
                                        required
                                        className="pl-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-2 italic">
                                    Mật khẩu Ẩn
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-2xl text-xl font-black italic uppercase bouncy-hover"
                        >
                            {loading ? (
                                <Loader2 className="size-6 animate-spin" />
                            ) : (
                                "Bắt đầu ngay!"
                            )}
                            {!loading && <ArrowRight className="size-6" />}
                        </Button>
                    </form>
                </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 border-t-4 border-slate-100 p-8 flex flex-col items-center">
                <p className="text-slate-400 font-bold italic text-sm uppercase">
                    Người mới?{" "}
                    <Link
                        href="/register"
                        className="text-primary font-black hover:underline underline-offset-8"
                    >
                        Tạo Học viên
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
