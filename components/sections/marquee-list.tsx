import Marquee from "@/components/magicui/marquee";
import { Ratio } from "@/config/constants";
import { cn, createRatio } from "@/lib/utils";

const examples1 = [
  {
    ratio: "16:9",
    prompt: `an ancient Landscape painting, poetic, invisible
the prospect is a Chinese architecture, moon, trees, the sky is filled with clouds
the minimalist style, prints
the architectures are golden, a red background`,
    img: "https://no-person-static.douni.one/flux/ybvv35aa65rga0chcgz820bxkg.jpg",
  },
  {
    ratio: "9:16",
    prompt: `The prospect is a Chinese architecture, moon, trees, the sky is filled with clouds`,
    img: "https://no-person-static.douni.one/flux/x93c6cxrx9rga0chcgx9qkm10r.jpg",
  },
  {
    ratio: "1:1",
    prompt: `穆夏新艺术风格海报，一位美丽的红发女性站在海报中央，她佩戴着弓箭，手里拿着一捧风信子，微笑眺望着远处海上的帆船。海报的顶部中央写着：“Hyacinth”.`,
    img: "https://no-person-static.douni.one/flux/y7vzd8pccxrge0chcgcbn7ty7w.jpg",
  },
  {
    ratio: "16:9",
    prompt: `a photo of a beautiful street in Freiburg with a tram passing by and people walking about and riding bikes`,
    img: "https://no-person-static.douni.one/%22/1268030332691808257_2.jpg",
  },
  {
    ratio: "3:2",
    prompt:
      "detailed cinematic dof render of an old dusty detailed CRT monitor on a wooden desk in a dim room with items around, messy dirty room. On the screen are the letters “FLUX” glowing softly. High detail hard surface render",
    img: "https://no-person-static.douni.one/flux-input/1268529580285759508_1.png",
  },
];

const examples2 = [
  {
    ratio: "16:9",
    prompt:
      "a portal into a mythical forest on the wall of my small messy bedroom",
    img: "https://no-person-static.douni.one/flux-input/1267262452559642715_3.jpg",
  },

  {
    ratio: "9:16",
    prompt: `a little girl are playing in a beautiful bedroom of a big house which is in the center of a giant stone`,
    img: "https://no-person-static.douni.one/flux/hsek0kfhg1rga0chc2atd5qyj4.jpg",
  },
  {
    prompt:
      "A hidden cenote in the heart of a lush jungle beckons with crystalline turquoise waters. Vibrant emerald vines cascade down weathered limestone walls, their tendrils barely kissing the water’s surface. Shafts of golden sunlight pierce through a natural skylight above, creating a mystical interplay of light and shadow on the cavern walls. Iridescent butterflies flit between exotic orchids clinging to rocky outcrops. A partially submerged Mayan ruin, its intricate carvings softened by time, stands as a silent sentinel at the water’s edge. Schools of tiny silver fish dart through the crystal-clear depths, their scales glinting like underwater stars. At the far end of the cenote, a small waterfall tumbles melodiously into the pool, its mist creating ephemeral rainbows in the dappled light.",
    ratio: "16:9",
    img: "https://no-person-static.douni.one/flux-input/1265955685338845235_3.jpg",
  },
  {
    ratio: "4:3",
    prompt: "a tiny astronaut hatching from an egg on the moon",
    img: "https://no-person-static.douni.one/flux-input/1265781086697426957_2.-1.jpg",
  },
  {
    ratio: "16:9",
    prompt: `Epic artwork of a massive brutalist building floating above a favela in a tropical landscape, the large brutalist building has large wires and cables hanging from it, cinematic art`,
    img: "https://no-person-static.douni.one/flux-input/1263379197175267380_1.jpg",
  },
];

const ReviewCard = ({
  img,
  ratio,
  prompt,
}: {
  img: string;
  prompt: string;
  ratio: string;
}) => {
  return (
    <figure
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          src={img}
          alt={prompt}
          className={`h-[280px] rounded-xl object-cover ${createRatio(ratio as Ratio)} pointer-events-none`}
        />
      </div>
    </figure>
  );
};

export function MarqueeList() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <Marquee pauseOnHover className="[--duration:20s]">
        {examples1.map((review) => (
          <ReviewCard key={review.prompt} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {examples2.map((review) => (
          <ReviewCard key={review.prompt} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
