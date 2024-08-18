import Image from "next/image";

import { TweetCard } from "@/components/magicui/tweet-card";
import { HeaderSection } from "@/components/shared/header-section";
 
const twitters = [
  "1821151712138424775",
  "1822281691878101324",
  "1820405546450583948",
];

const twitters2 = [
  '1821605619927019974',
  "1821150855921594669",
  "1820268355636392086"
]

const twitters3 = [
  '1820822465112686770',
  "1823916772107354265",
  "1823916776163336484"
]

const twitters4 = [
  '1822777661086720231',
  "1822067005987369357",
  "1823857074843082908"
]

export default function TwitterList() {
  return (
    <section>
      <div className="container my-4">
        <div className="max-w-pc mx-auto grid grid-cols-1 gap-2.5 px-2 lg:grid-cols-4 lg:px-0">
          <div className="flex flex-col gap-2">
            {twitters.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters2.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters3.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {twitters4.map((item) => (
              <TweetCard key={item} id={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
