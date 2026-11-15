import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import Footer from "@/components/Shared/Footer/Footer";
import StatusBarInit from "@/components/Shared/Native/StatusBarInit";
import './globals.css';

export const metadata: Metadata = {
  title: 'Admina - Trámites Académicos AIS',
  description: 'Admina. Tecnologia que simplifica',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StatusBarInit />
            {children}
            <Footer/>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}