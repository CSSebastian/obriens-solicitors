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
  "conveyancing-keys": {
    src: "/images/conveyancing-keys.jpg",
    width: 1672,
    height: 941,
    alt: "A smiling couple standing on the verandah of a sandstone home, holding the keys to their new house",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EACIQAAEEAQIHAAAAAAAAAAAAAAIAAQMRBCFyEhM0QUKRwf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAERAiH/2gAMAwEAAhEDEQA/AMjmz8DxSAI1ro1Ezd7V8qJgEBgoyOrb26TI8tgoLr8bZ8U8pNUVnD//2Q==",
  },
  "hero-documents": {
    src: "/images/hero-documents.jpg",
    width: 2356,
    height: 1571,
    alt: "A solicitor and two clients reviewing contract documents together at a white desk",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQT/xAAjEAACAQMDBAMAAAAAAAAAAAABAwIABBEFITEGEhNBImGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwBy3bEWhDlhJnEkYO5GOagRZORfquZQ8aFwJOMHkcbUPpRLeqAGEyBgdifqk/Kwa9dLDJdgWfjnb16/ao//2Q==",
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
  "family-law-close": {
    src: "/images/family-law-close.jpg",
    width: 1536,
    height: 1024,
    alt: "A solicitor listens to a mother and her young son seated close together at a table by a window overlooking eucalyptus trees",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAAD/8QAIxAAAgEDBAEFAAAAAAAAAAAAAQIRAAMEBRITMSFCUnGRof/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAYEQEBAAMAAAAAAAAAAAAAAAABAAIRIf/aAAwDAQACEQMRAD8A2bUCcgAvONu442+onv78UXM1E4eUyNu45CmI7jv8q0lFey7uAzG6SZ+afex7N66vLaR49wmh4Mpjsv/Z",
  },
  "commercial-meeting": {
    src: "/images/commercial-meeting.jpg",
    width: 1536,
    height: 1024,
    alt: "Two lawyers discuss a case over an open file and laptop in a bright office with a bookshelf behind them",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQEE/8QAIRAAAQMEAgMBAAAAAAAAAAAAAQIDEQAEEiEFEzFBUXH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAECE0H/2gAMAwEAAhEDEQA/AJyF+6HW1JKlYMKOj89eKOfvlKCLpQyxHXiToyJkfninLxhpl5fUgIjICPVZeVaR1tjHWA1OtiaNTWiVn//Z",
  },
  "property-tower": {
    src: "/images/property-tower.jpg",
    width: 1536,
    height: 1024,
    alt: "A glass office tower rising behind a historic sandstone building and plane tree in golden evening light",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAID/8QAIBAAAgEEAgMBAAAAAAAAAAAAAQIRAAMEIQUxEhMiwf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQMCMf/aAAwDAQACEQMRAD8AwLW7GMXRgDEQO1pnHX/ZcVGIuA6Dj9oT/OTfUAeIeAI6ETV8K5OQi6A2dADqKTo+Dc0f/9k=",
  },
  "criminal-courtroom": {
    src: "/images/criminal-courtroom.jpg",
    width: 1536,
    height: 1024,
    alt: "A barrister in robes addresses the judge in a timber-panelled courtroom while two people look on",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQL/xAAdEAACAgIDAQAAAAAAAAAAAAABAgMRABIEBTGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABgRAAMBAQAAAAAAAAAAAAAAAAABAhEh/9oADAMBAAIRAxEAPwAlZNJVbYxuvhI9OXPylSMPoNgRVYUXZwAxv5jPBAl6ktIqs25WyouhWG4Wiq94f//Z",
  },
  "employment-discussion": {
    src: "/images/employment-discussion.jpg",
    width: 1536,
    height: 1024,
    alt: "A lawyer points to a document while a colleague listens, with shelves of law reports behind them",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAP/xAAgEAEBAAEEAgMBAAAAAAAAAAABAhEAAwQhEhMiIzGR/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABcRAQEBAQAAAAAAAAAAAAAAAAEAAhL/2gAMAwEAAhEDEQA/AC8/nVyOVZPsZghZHpfzyxoW/wAnaaAy7hTNGX+6a/VeYAWjLjvULmd632RD4vXxDR9Eplv/2Q==",
  },
  "aml-id-check": {
    src: "/images/aml-id-check.jpg",
    width: 1672,
    height: 941,
    alt: "A solicitor checks a client's photo ID against a property contract, with a laptop, house-shaped key ring and pot plant on the desk",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIxAAAgEDAQkAAAAAAAAAAAAAAQIDAAQRcQUSITEzNFFygf/EABQBAQAAAAAAAAAAAAAAAAAAAAL/xAAVEQEBAAAAAAAAAAAAAAAAAAABAP/aAAwDAQACEQMRAD8ALsSSOV4raAmKYkliACMfeelLvkK3QVroSnPEBN0r5rNWHex61SfpL7Uwi3//2Q==",
  },
  "client-window-consult": {
    src: "/images/client-window-consult.jpg",
    width: 1536,
    height: 1024,
    alt: "A female lawyer takes notes as a male client talks, seated at a desk by a window with a leafy green tree outside",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgMEBv/EAB8QAAIBBQEAAwAAAAAAAAAAAAECAwAEERIhBRNRkf/EABQBAQAAAAAAAAAAAAAAAAAAAAL/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREC/9oADAMBAAIRAxEAPwAZ/R+KXGrbCMvIoxz6Gap9KNJ7K2iS4MTbb5FNMaLbg6gkoenprPXdzKz7FySF5+UcyiaiP//Z",
  },
  "hero-farm-family": {
    src: "/images/hero-farm-family.jpg",
    width: 2400,
    height: 1350,
    alt: "A farming family at their sandstone homestead in the Riverland at sunset: parents on the veranda, children running across the yard and a man tending the vines, with the river beyond",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAH/xAAjEAACAQIEBwAAAAAAAAAAAAABAgMABAURITESE0FRcXKR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAXEQADAQAAAAAAAAAAAAAAAAAAASEx/9oADAMBAAIRAxEAPwCx4rcTxlOceFjlr1o7PJASzBW1Bz7fKFa7ReTTjufWp1B9R//Z",
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
