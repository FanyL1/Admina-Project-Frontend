import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Admina - Integración de Trámites Académicos',
  description: 'Admina. Tecnologia que simplifica',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
