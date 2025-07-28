import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { ViewTransitions } from "next-view-transitions";

import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const gambarino = localFont({
  src: "./gambarino.woff2",
  display: "swap",
  variable: "--font-gambarino",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${raleway.variable} ${gambarino.variable} antialiased`}>
        <body className="bg-neutral-900 text-white">
          <CartProvider>
            {children}
          </CartProvider>
          <PrismicPreview repositoryName={repositoryName} />
        </body>
      </html>
    </ViewTransitions>
  );
}
