import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

// 1. Đổi sang Nunito và BẮT BUỘC thêm subset "vietnamese"
const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin", "vietnamese"],
    // Thêm các weight 800, 900 (ExtraBold, Black) vì phong cách Game cần chữ cực đậm
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "HuyBoon PlayHub - Học viện Anh hùng",
    description: "Trải nghiệm học tập vui nhộn và đầy thử thách!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="vi"
            className={`${nunito.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col font-sans selection:bg-primary/30">
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}
