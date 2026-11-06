import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PRISM — The Complete Magic UI Collection",
  description:
    "All 78 free Magic UI components, alive on one impossibly beautiful page. A living showcase of animated components built with Magic UI, Tailwind CSS and Motion.",
  keywords: [
    "Magic UI",
    "components",
    "animations",
    "Tailwind CSS",
    "Motion",
    "React",
    "showcase",
    "design engineering",
  ],
  authors: [{ name: "Prism Labs" }],
  openGraph: {
    title: "PRISM — The Complete Magic UI Collection",
    description:
      "All 78 free Magic UI components, alive on one impossibly beautiful page.",
    siteName: "PRISM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRISM — The Complete Magic UI Collection",
    description:
      "All 78 free Magic UI components, alive on one impossibly beautiful page.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0c11" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
