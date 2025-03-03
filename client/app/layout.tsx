import "./globals.css";
import ContextAPI from "@/context/context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sweepo | Clean your data",
  description: "Explore a wide range of Data cleaning methods.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <ContextAPI>
        <body>
          <main>
          {children}
          </main>
        </body>
      </ContextAPI>
    </html>
  );
}
