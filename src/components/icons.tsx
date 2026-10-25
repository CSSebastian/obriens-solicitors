import type { SVGProps } from "react";

import type { PracticeIcon } from "@/content/practice-areas";
import type { SocialPlatform } from "@/content/site";

type IconProps = SVGProps<SVGSVGElement>;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ------------------------------------------------------------------ */
/* Practice-area line icons (services row)                             */
/* ------------------------------------------------------------------ */

export function DocumentIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M7 4h13l5 5v19H7z" />
        <path d="M20 4v5h5" />
        <path d="M11 15h10M11 20h10M11 25h6" />
      </g>
    </svg>
  );
}

export function TractorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <circle cx="10" cy="21" r="7" />
        <circle cx="10" cy="21" r="2.5" />
        <circle cx="25" cy="24" r="4" />
        <path d="M5 12V6h7l3 8h6v6" />
        <path d="M15 14h-3" />
        <path d="M21 6h5" />
      </g>
    </svg>
  );
}

export function GemIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M16 3 29 16 16 29 3 16z" />
        <path d="M16 3 9 16l7 13" />
      </g>
    </svg>
  );
}

export function ScalesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M16 4v24M9 28h14" />
        <path d="M6 9h20" />
        <path d="M6 9 2 19h8zM26 9l-4 10h8z" />
      </g>
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M5 14 16 5l11 9" />
        <path d="M8 12v15h16V12" />
        <path d="M14 27v-7h4v7" />
      </g>
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <rect x="4" y="10" width="24" height="16" />
        <path d="M12 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
        <path d="M4 17h24" />
        <path d="M16 15v4" />
      </g>
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M16 4 6 8v8c0 6 4 10 10 12 6-2 10-6 10-12V8z" />
        <path d="m12 16 3 3 5-6" />
      </g>
    </svg>
  );
}

const practiceIcons: Record<
  PracticeIcon,
  (props: IconProps) => React.ReactElement
> = {
  home: HomeIcon,
  gem: GemIcon,
  briefcase: BriefcaseIcon,
  scales: ScalesIcon,
  shield: ShieldIcon,
  tractor: TractorIcon,
  document: DocumentIcon,
};

export function PracticeAreaIcon({
  name,
  ...props
}: IconProps & { name: PracticeIcon }) {
  const Component = practiceIcons[name];
  return <Component {...props} />;
}

/* ------------------------------------------------------------------ */
/* Contact card icons                                                  */
/* ------------------------------------------------------------------ */

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <rect x="2.5" y="5" width="19" height="14" />
        <path d="m2.5 6.5 9.5 7 9.5-7" />
      </g>
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M6.5 3h-2a2 2 0 0 0-2 2.2c.6 6.6 5.7 11.7 12.3 12.3A2 2 0 0 0 17 15.5v-2l-3.5-1.3-1.7 1.7a13 13 0 0 1-5.7-5.7l1.7-1.7z" />
      </g>
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
        <circle cx="12" cy="10.5" r="2.6" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Interface icons                                                     */
/* ------------------------------------------------------------------ */

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m6 3 5 5-5 5" {...strokeProps} />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5 12.5 4.5 4.5L19 6.5" {...strokeProps} />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m3 6 5 5 5-5" {...strokeProps} />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m3 10 5-5 5 5" {...strokeProps} />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 7h18M3 12h18M3 17h18" {...strokeProps} strokeWidth={1.8} />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5 5 14 14M19 5 5 19" {...strokeProps} strokeWidth={1.8} />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 12 21 4l-7 17-3-7z" {...strokeProps} />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <path d="M4 4h16v12H9l-5 4z" />
        <path d="M8 9h8M8 12h5" />
      </g>
    </svg>
  );
}

export function ImagePlaceholderIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M6 8h36a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm0 4v18.6l8.7-8.7a2 2 0 0 1 2.8 0l8 8 5.3-5.3a2 2 0 0 1 2.8 0L42 32.6V12H6Zm11 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Social icons                                                        */
/* ------------------------------------------------------------------ */

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 1 0-1.6 19.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-5.9l-4.6-6-5.3 6H3l7-8-6.6-9h6l4.2 5.5L17.5 3Zm-1 16h1.7L8.6 4.8H6.8L16.5 19Z" />
    </svg>
  );
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M3 3h18v18H3V3Zm4.2 6.8H5v8.4h2.2V9.8ZM6.1 5.6a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM19 18.2v-4.9c0-2.4-1.3-3.6-3-3.6-1.4 0-2 .8-2.4 1.3V9.8H11.4c0 .6 0 8.4 0 8.4h2.2v-4.7c0-.3 0-.5.1-.7.2-.5.7-1 1.5-1 1 0 1.5.8 1.5 2v4.4H19Z" />
    </svg>
  );
}

function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z" />
    </svg>
  );
}

function DribbbleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g {...strokeProps}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M5 6.5c4.6 4 8.2 8.3 10 15M2.8 13.8c6-1 11.5.4 16.4 4.1M7 21c2-6 6.6-9.6 14-9.4" />
      </g>
    </svg>
  );
}

const socialIcons: Record<
  SocialPlatform,
  (props: IconProps) => React.ReactElement
> = {
  facebook: FacebookIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  dribbble: DribbbleIcon,
};

export function SocialIcon({
  platform,
  ...props
}: IconProps & { platform: SocialPlatform }) {
  const Component = socialIcons[platform];
  return <Component {...props} />;
}
