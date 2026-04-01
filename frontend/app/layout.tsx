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

// प्रोफेशनल मेटाडेटा: ताकि गूगल सर्च में आपकी साइट अच्छी दिखे
export const metadata: Metadata = {
  title: "S2H Services - Aligarh's Best Home Services",
  description: "Book professional home services in Aligarh including Cleaning, AC Repair, Electrician and more.",
  verification: {
    google: "google65f3ee484653599a", // आपका वेरिफिकेशन कोड यहाँ सेट है
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
        {/* गूगल वेरिफिकेशन टैग */}
        <meta name="google-site-verification" content="google65f3ee484653599a" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}