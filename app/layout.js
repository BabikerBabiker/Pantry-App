import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry App",
  description: "Created by Babiker Babiker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/icon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}