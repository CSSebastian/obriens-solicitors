/**
 * Registry of the firm's optimised photography (from client-supplied stock).
 *
 * Sources live in `public/images/*.jpg` — resized to 2400px on the long edge,
 * EXIF-stripped, mozjpeg q80 (94.8 MB of originals -> ~2.1 MB). They are served
 * through `next/image` (see {@link Photo}), which negotiates AVIF/WebP and
 * emits responsive sizes per slot; the committed JPEGs are the fallback source.
 *
 * `alt` describes the image *content* (not the slot it sits in). A slot may
 * override it — pass `alt=""` where the image is purely decorative and the
 * surrounding copy already carries the meaning.
 *
 * Generated from the optimise step; edit `alt` here by hand as needed.
 */
export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny inline preview for next/image `placeholder="blur"` (no CLS, no flash). */
  blurDataURL: string;
}

export const images = {
  "contract-review": {
    src: "/images/contract-review.jpg",
    width: 2400,
    height: 1341,
    alt: "Two colleagues in business suits reviewing a printed contract at a desk, beside a laptop, law books and a small set of scales of justice",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAJABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAmEAABAgQDCQAAAAAAAAAAAAABAgQAAxMhBREUBhIxMjNBg6HB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABYRAQEBAAAAAAAAAAAAAAAAAAEAIf/aAAwDAQACEQMRAD8ATxPDS70rhaaS2695GYuo9gfUGadTVaXzydNlTTNq0qfFQsQL3GUWKeaJra3qeH7BU0gCg3//2Q==",
  },
  "sheena-bookshelf": {
    src: "/images/sheena-bookshelf.jpg",
    width: 1800,
    height: 1800,
    alt: "Sheena Vagg, Principal Solicitor, seated at a desk with a pen in front of shelves of law books",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQP/xAAiEAADAAEDAwUAAAAAAAAAAAABAgMABBEhEhNBIjEyYaH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABgRAAIDAAAAAAAAAAAAAAAAAAARITGB/9oADAMBAAIRAxEAPwAyTQWk1Z+4GcDoUct9cZatIN1BaAAN59wRxtzgsVqLTI2BVgQd8Q1OiUWt26rYN6iQvxO/j9yeiUUf/9k=",
  },
  "family-consultation": {
    src: "/images/family-consultation-clean.jpg",
    width: 2356,
    height: 1571,
    alt: "A solicitor explaining a document to a client across a desk with a laptop",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEEBv/EACAQAAICAQQDAQAAAAAAAAAAAAECAwQRAAUSIRQycWH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAABB/9oADAMBAAIRAxEAPwBbdZmlk8lY3eRh7BS2Pz5q/dt6rwUJYpoDJKVK4KELyI6HehII02wcVwXBLEE5J+6ylq7YetYrvMzQoy8VJzjvUpH/2Q==",
  },
  "conveyancing-keys": {
    src: "/images/conveyancing-keys.jpg",
    width: 1672,
    height: 941,
    alt: "A smiling couple standing on the verandah of a sandstone home, holding the keys to their new house",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EACIQAAEEAQIHAAAAAAAAAAAAAAIAAQMRBCFyEhM0QUKRwf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAERAiH/2gAMAwEAAhEDEQA/AMjmz8DxSAI1ro1Ezd7V8qJgEBgoyOrb26TI8tgoLr8bZ8U8pNUVnD//2Q==",
  },
  "office-meeting": {
    src: "/images/office-meeting.jpg",
    width: 2400,
    height: 1617,
    alt: "A senior solicitor and a colleague talking across a table in a bright, modern office",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwUGB//EACMQAAICAQMDBQAAAAAAAAAAAAECAwQRAAUxEhMhFDJBsdH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwAL0N89Qgkro0S4LPF5BXOQMnnk50p3WEUZpUeNo5GfKKOAPOR+asb9+zBOUik6VCOQOkfAONZ9euz3pnltSdyTPuwB9acEf//Z",
  },
  "courtroom-bench": {
    src: "/images/courtroom-bench.jpg",
    width: 2400,
    height: 1600,
    alt: "A judge at a wooden courtroom bench receiving documents from counsel, a gavel resting on the desk",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwQFBv/EACEQAAIBAwMFAAAAAAAAAAAAAAECEQADBBIhMQUTUWGh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABcRAAMBAAAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/AMvitiX5XIe4jERIiPVH7uOvTriKMgMX1SWBRo2EjzzUq0Abig8E00BqtsDwo2+0Rp3T/9k=",
  },
  "hero-documents": {
    src: "/images/hero-documents.jpg",
    width: 2356,
    height: 1571,
    alt: "A solicitor and two clients reviewing contract documents together at a white desk",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQT/xAAjEAACAQMDBAMAAAAAAAAAAAABAwIABBEFITEGEhNBImGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBy3bEWhDlhJnEkYO5GOagRZORfquZQ8aFwJOMHkcbUPpRLeqAGEyBgdifqk/Kwa9dLDJdgWfjnb16/ao//2Q==",
  },
  "client-consultation": {
    src: "/images/client-consultation.jpg",
    width: 2400,
    height: 1266,
    alt: "A lawyer and a client in discussion across a desk, hands gesturing, a set of scales of justice by a bright window",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAIABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMF/8QAIBAAAgIBAwUAAAAAAAAAAAAAAQIDEQAEBRIGEyFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAXEQEAAwAAAAAAAAAAAAAAAAAAESFB/9oADAMBAAIRAxEAPwC3S28wLpZYiGMzycgqrZYBQL8fbzV1G6iJpO8jJagLzUgUfeMYaYp//9k=",
  },
  "lawyer-and-client": {
    src: "/images/lawyer-and-client.jpg",
    width: 2400,
    height: 1602,
    alt: "A solicitor and a client talking across a desk in a calm, sunlit office",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQMFBv/EACMQAAIBBAEDBQAAAAAAAAAAAAECAwAEESESBTFBExQlUYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFxEBAQEBAAAAAAAAAAAAAAAAAREAAv/aAAwDAQACEQMRAD8A00Vw0ly4BiFtwX03Dbc+fyo3VLv50RQ8i0rBQSoO8bIHnVCxkb20QzpEjK67ZbBp97PJFEJEIV245bAz3+6HqMcnNKb/2Q==",
  },
  "courtroom-verdict": {
    src: "/images/courtroom-verdict.jpg",
    width: 2400,
    height: 1607,
    alt: "A judge standing to read a verdict in a wood-panelled courtroom as people look on",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQMG/8QAIBABAAICAgEFAAAAAAAAAAAAAQIDABEEIQUSFUFRof/EABQBAQAAAAAAAAAAAAAAAAAAAAT/xAAXEQEBAQEAAAAAAAAAAAAAAAABABEx/9oADAMBAAIRAxEAPwAb3TkcaZG6661jpUsex7x7w/m41cWyyxlZJD01ynt+v3eZKndqk1Tr5ys1rUhKURO9OHeyw0y//9k=",
  },
  "solicitor-at-work": {
    src: "/images/solicitor-at-work.jpg",
    width: 2400,
    height: 1600,
    alt: "A solicitor reviewing documents at a desk with a laptop, briefcase and law books",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQFBv/EACIQAAEDAwMFAAAAAAAAAAAAAAECAxEABAUSIUETMVGBwf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCo5mGbbGG5gkhWiJAM+ftFYZdnIW5iULSSlQXtMc+6w7glbjZJKCskpJ2me9P4Rht7Jjqp1wgq3PIoP//Z",
  },
  "agribusiness-vineyard": {
    src: "/images/agribusiness-vineyard.jpg",
    width: 2400,
    height: 1476,
    alt: "Rows of green vines in the foreground with rolling vineyards and hills behind in a South Australian wine region",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwT/xAAiEAABAwIGAwAAAAAAAAAAAAABAAIDBRMEEiExM5JDceH/xAAVAQEBAAAAAAAAAAAAAAAAAAABBP/EABkRAAIDAQAAAAAAAAAAAAAAAAABAgMTUf/aAAwDAQACEQMRAD8AZtXlJAE2H12AH1I2rTDKC+NxPpWWYh42dQldDFa42dQp9JdFVo//2Q==",
  },
  "gavel-and-books": {
    src: "/images/gavel-and-books.jpg",
    width: 2400,
    height: 1600,
    alt: "A wooden gavel beside a row of hardcover law books on a desk",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQP/xAAgEAACAQMEAwAAAAAAAAAAAAABAhEAAwQFEjFRIUGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAABAP/aAAwDAQACEQMRAD8AM1fBxsaBj29rbS3JMwRP2i2JQGQY79UpqCK7KWkkT5mp2raxxwO6LQv/2Q==",
  },
  "case-discussion": {
    src: "/images/case-discussion.jpg",
    width: 2400,
    height: 1600,
    alt: "Two legal professionals reviewing case notes on a tablet beside a desk with law books and scales of justice",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQIG/8QAIhAAAgEDBAIDAAAAAAAAAAAAAQIDAAQRBRITIRQxInGx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAABB/9oADAMBAAIRAxEAPwB+413j1PwntpFRot3L79jrGM1m4JDdatpj852KXlYEZ27WOBj6/aq8LQQ2bwu6MEI+LEdYoCKRhcFge8nuimP/2Q==",
  },
  "lady-justice": {
    src: "/images/lady-justice.jpg",
    width: 2400,
    height: 1600,
    alt: "A bronze statuette of Lady Justice holding scales and a sword on a desk with law books",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAX/xAAgEAACAQQBBQAAAAAAAAAAAAABAgMABBESQQUhMTJh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAAMBAAAAAAAAAAAAAAAAAAABIRH/2gAMAwEAAhEDEQA/AEzXgstI3RlYt2ORhhzzVWV0gid0wcLtrQesxobZMqPYcfaWltERqUyAPGaEsgun/9k=",
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
