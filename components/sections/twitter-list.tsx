import Image from "next/image";

import { TweetCard } from "@/components/magicui/tweet-card";
import { HeaderSection } from "@/components/shared/header-section";
 
const twitters = [
  "1821151712138424775",
  "1822281691878101324",
  "1820113381120209004",
];

export default function TwitterList() {
  return (
    <section>
      <div className="container">
        <div className="max-w-pc mx-auto grid grid-cols-1 gap-2.5 px-2 lg:grid-cols-4 lg:px-0">
          <div className="flex flex-col gap-2">
            {twitters.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
