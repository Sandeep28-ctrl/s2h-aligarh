 import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// प्रोफेशनल मेटाडेटा: नया नाम अपडेट कर दिया गया है
export const metadata: Metadata = {
  title: "S2H - Smart Services to Home | Aligarh",
  description: "Book Smart Home Services in Aligarh. Professional Cleaning, AC Repair, Electrician and more.",
  verification: {
    google: "google65f3ee484653599a", // आपका वेरिफिकेशन कोड यहाँ सुरक्षित है
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* गूगल वेरिफिकेशन टैग - इसे हटाना नहीं है */}
        <meta name="google-site-verification" content="google65f3ee484653599a" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}