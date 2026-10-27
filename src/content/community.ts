/**
 * Community Support — organisations the firm supports. Logos live in
 * /public/images/community (original colours, as supplied).
 * TODO CONFIRM: short descriptions and event photos for each organisation.
 * The section launches with logos only.
 */

export interface CommunityOrg {
  name: string;
  logo: string;
  width: number;
  height: number;
  /**
   * Tile padding override (Tailwind class). Default is p-5. Logos that read too
   * small are trimmed of their built-in white margin and given a tighter tile so
   * they fill it — see the Oct 2026 review feedback.
   */
  tilePadding?: string;
}

export const communityIntro =
  "We're proud to support the clubs and organisations that make the Riverland a great place to live.";

export const communityOrgs: CommunityOrg[] = [
  { name: "Berri Tennis Club", logo: "/images/community/berri-tennis-club.png", width: 375, height: 201, tilePadding: "p-2" },
  { name: "Berri Golf Club", logo: "/images/community/berri-golf-club.jpg", width: 177, height: 165 },
  { name: "Renmark North Cricket Club", logo: "/images/community/renmark-north-cricket-club.jpg", width: 204, height: 192 },
  { name: "Berri Hockey Club", logo: "/images/community/berri-hockey-club.jpg", width: 128, height: 121 },
  { name: "Berri Swimming Club", logo: "/images/community/berri-swimming-club.png", width: 1500, height: 277 },
  { name: "Berri Rowing Club", logo: "/images/community/berri-rowing-club.png", width: 827, height: 827 },
  { name: "Royal Flying Doctor Service", logo: "/images/community/royal-flying-doctor-service.png", width: 330, height: 302, tilePadding: "p-3" },
  { name: "Rosie Clark School of Ballet and Tap", logo: "/images/community/rosie-clark-school-of-ballet-and-tap.jpg", width: 372, height: 468, tilePadding: "p-4" },
  { name: "Make-A-Wish", logo: "/images/community/make-a-wish.jpg", width: 148, height: 148, tilePadding: "p-3" },
];
