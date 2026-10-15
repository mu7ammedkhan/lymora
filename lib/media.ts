/* Films and photography used across the public site. Credits: public/images/CREDITS.md */

type FilmMedia = { video: string; mobile: string; poster: string };
type PhotoMedia = { image: string };

export const heroMedia = {
  home: { video: "/media/hero-home.mp4", mobile: "/media/hero-home-m.mp4", poster: "/media/hero-home.jpg" },
  academy: { video: "/media/academy.mp4", mobile: "/media/academy-m.mp4", poster: "/media/academy.jpg" },
  workforce: { video: "/media/workforce.mp4", mobile: "/media/workforce-m.mp4", poster: "/media/workforce.jpg" },
  city: { video: "/media/city.mp4", mobile: "/media/city-m.mp4", poster: "/media/city.jpg" },
  enterprise: { image: "/images/meeting.webp" },
  insights: { image: "/images/abstract-light.webp" },
  methods: { image: "/images/analyst.webp" },
  legal: { image: "/images/office-night.webp" },
} satisfies Record<string, FilmMedia | PhotoMedia>;

export type HeroMediaKey = keyof typeof heroMedia;

export const photos = {
  teamCollab: { src: "/images/team-collab.webp", alt: "Six colleagues of different ages and backgrounds gather around a laptop at a desk in an open-plan office, discussing what is on screen." },
  workshop: { src: "/images/workshop.webp", alt: "Adults with laptops sit around long tables in a loft-style training room at dusk while a facilitator presents beside a wall screen under pendant lamps." },
  leader: { src: "/images/leader.webp", alt: "Portrait of a confident woman in a headscarf and cream blazer standing at a desk in a bright, minimal office." },
  operator: { src: "/images/operator.webp", alt: "A professional types on a laptop by the warm glow of a desk lamp in a dark, teal-toned room." },
  analyst: { src: "/images/analyst.webp", alt: "A hand points at a large display of financial charts, with the person's silhouette reflected in the glass screen." },
  meeting: { src: "/images/meeting.webp", alt: "A team meets around a table with laptops inside a glass-walled meeting room off a dim office corridor in the evening." },
  mentor: { src: "/images/mentor.webp", alt: "A senior colleague in shirt and tie points at a tablet as he walks a colleague in a dark suit through the work in a glass-walled office." },
  graduate: { src: "/images/graduate.webp", alt: "A smiling graduate in a black gown with a yellow stole celebrates, holding a red diploma folder and a bouquet of white roses." },
  dubaiSkyline: { src: "/images/dubai-skyline.webp", alt: "Dubai's Business Bay skyline and the Burj Khalifa lit up at night, reflected in still water under a deep blue sky." },
  dubaiArchitecture: { src: "/images/dubai-architecture.webp", alt: "The Burj Khalifa framed through the curved, calligraphy-clad steel facade of Dubai's Museum of the Future." },
  handsLaptop: { src: "/images/hands-laptop.webp", alt: "Close-up of a hand typing on a laptop keyboard in dim blue and violet light." },
  abstractLight: { src: "/images/abstract-light.webp", alt: "Abstract ribbons of violet and magenta light curving through dark space." },
  officeNight: { src: "/images/office-night.webp", alt: "Looking in from outside at night through tall windows into a brightly lit office where a few colleagues talk among the desks." },
  presentation: { src: "/images/presentation.webp", alt: "Audience members in silhouette watch a speaker in front of a large glowing screen under purple stage lights." },
} as const;

export const industryPhotos: Record<string, string> = {
  education: "/images/industry-education.webp",
  healthcare: "/images/industry-healthcare.webp",
  "real-estate": "/images/industry-real-estate.webp",
  "professional-services": "/images/industry-professional.webp",
  "marketing-agencies": "/images/industry-marketing.webp",
  hospitality: "/images/industry-hospitality.webp",
};
