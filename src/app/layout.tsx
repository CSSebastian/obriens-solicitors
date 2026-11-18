import type { Metadata } from "next";

import { ChatWidget } from "@/components/chat/chat-widget";
import { ContactModal } from "@/components/contact/contact-modal";
import { ContentProvider } from "@/components/content-provider";
import { OverlayProvider } from "@/components/overlay/overlay-context";
import { BackToTop } from "@/components/site/back-to-top";
import { DraftModeTools } from "@/components/site/draft-mode-tools";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { TeamProfileModal } from "@/components/site/team-profile-modal";
import { buildNavigation } from "@/content/lookups";
import { rethinkSans, robotoSerif } from "@/lib/fonts";
import { getCleanContent, getContent } from "@/sanity/content";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  const title = `${site.name} — Solicitors in Berri, South Australia`;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_AU",
      title,
      description: site.description,
      url: site.url,
    },
    // Card type; the image is supplied by the file-convention twitter-image route.
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
    },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();
  // Only what client components need — the rest stays on the server.
  const clientContent = {
    site: content.site,
    nav: buildNavigation(content),
    team: content.team,
    areas: content.practiceAreas.map(({ slug, navLabel, hasPage }) => ({
      slug,
      navLabel,
      hasPage,
    })),
  };

  return (
    <html lang="en-AU" className={`${rethinkSans.variable} ${robotoSerif.variable}`}>
      <body>
        {/* No-JS fallback: scroll-reveal elements must be visible if JS is off. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ContentProvider value={clientContent}>
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
            <BackToTop />
            <ContactModal />
            <TeamProfileModal />
          </OverlayProvider>
        </ContentProvider>
        <DraftModeTools />
      </body>
    </html>
  );
}
