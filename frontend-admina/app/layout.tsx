import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import Footer from "@/components/Shared/Footer/Footer";

export const metadata: Metadata = {
  title: 'Admina - Trámites Académicos AIS',
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
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
