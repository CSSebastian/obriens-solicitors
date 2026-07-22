import type { Metadata } from "next";

import { ChatWidget } from "@/components/chat/chat-widget";
import { ContactModal } from "@/components/contact/contact-modal";
import { OverlayProvider } from "@/components/overlay/overlay-context";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { site } from "@/content/site";
import { sans, serif } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Solicitors in Berri, South Australia`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    title: `${site.name} — Solicitors in Berri, South Australia`,
    description: site.description,
    url: site.url,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <OverlayProvider>
          <SmoothScroll />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-button-light focus:px-4 focus:py-2 focus:text-text-on-light"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
          <ContactModal />
        </OverlayProvider>
      </body>
    </html>
  );
}
