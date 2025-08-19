import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Max Mustermann - Premium KI-Consultant & Diplom-Ingenieur",
  description: "Enterprise-KI-Beratung von der Strategie bis zur Umsetzung. Deutsche Expertise, DSGVO-konform, technisch fundiert. Durchschnittlich 300% ROI in 12 Monaten.",
  keywords: "KI Consultant, Artificial Intelligence, Machine Learning, Enterprise AI, DSGVO, Max Mustermann",
  authors: [{ name: "Max Mustermann" }],
  creator: "Max Mustermann",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: "Max Mustermann - Premium KI-Consultant",
    description: "Enterprise-KI-Beratung mit nachweisbarem ROI. Deutsche Expertise, DSGVO-konform.",
    type: "website",
    locale: "de_DE",
    siteName: "Max Mustermann KI-Consultant",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Max Mustermann - Premium KI-Consultant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Mustermann - Premium KI-Consultant',
    description: 'Enterprise-KI-Beratung mit nachweisbarem ROI',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-inter`}
      >
        {children}
      </body>
    </html>
  );
}
