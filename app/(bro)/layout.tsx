import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://recipe-bro.vercel.app"),
  title: "Recipe Bro (I let you cook)",
  description: "Recipe Bro. Experimental preview of schema generation with useObject hook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
