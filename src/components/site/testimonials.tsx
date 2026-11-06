import { AuroraText } from "@/components/magicui/aurora-text";
import { Marquee } from "@/components/magicui/marquee";
import { MagicTweet } from "@/components/magicui/tweet-card";
import { SectionHeading } from "@/components/site/section-heading";

/**
 * Builds a minimal tweet object that satisfies react-tweet's `enrichTweet`
 * (which requires `display_text_range` and `entities`).
 */
function makeTweet(name: string, handle: string, avatar: string, text: string) {
  return {
    id_str: "1790000000000000001",
    text,
    display_text_range: [0, text.length],
    entities: { hashtags: [], urls: [], symbols: [], user_mentions: [] },
    user: {
      name,
      screen_name: handle,
      profile_image_url_https: avatar,
      verified: false,
      is_blue_verified: true,
      url: `https://x.com/${handle}`,
    },
    url: `https://x.com/${handle}/status/1790000000000000001`,
  } as any;
}

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  text: string;
}

const ROW_ONE: Testimonial[] = [
  {
    name: "Amara Chen",
    handle: "amaradesigns",
    avatar: "/images/avatar-1.png",
    text: "Swapped our primary CTA for Magic UI's Shimmer Button. Click-through is up 31% in two weeks. It's annoying how well a little shimmer works.",
  },
  {
    name: "Rizky Pratama",
    handle: "rizkybuilds",
    avatar: "/images/avatar-2.png",
    text: "Wrapped the checkout card in a Border Beam. Completion rate nearly doubled. One component, ten minutes of work, and the team thinks I invented something.",
  },
  {
    name: "Mei Tanaka",
    handle: "meitanaka",
    avatar: "/images/avatar-3.png",
    text: "Put the Globe on our pricing page purely because it looks cool. Now prospects ask about our \"global infrastructure story.\" It's a CSS sphere. It spins. I love it.",
  },
  {
    name: "Diego Alvarez",
    handle: "divalves",
    avatar: "/images/avatar-4.png",
    text: "Replaced our sidebar with the Dock as an experiment. Users think we're cool now. Usage didn't change, but the screenshots on social did. Keeping it forever.",
  },
];

const ROW_TWO: Testimonial[] = [
  {
    name: "Siti Rahma",
    handle: "sitirahma",
    avatar: "/images/avatar-5.png",
    text: "Added Blur Fade to every section and the whole page suddenly feels expensive. Same words, same product — it just enters like it means it now.",
  },
  {
    name: "Jonas Weber",
    handle: "jonaswbr",
    avatar: "/images/avatar-6.png",
    text: "Rebuilt our dashboard headers with Number Ticker. Stakeholders finally read the numbers instead of skimming to the summary. Animating a KPI is a cheat code.",
  },
  {
    name: "Amara Chen",
    handle: "amaradesigns",
    avatar: "/images/avatar-1.png",
    text: "Wired the Confetti burst into our checkout success screen. Support tickets about it: zero. Screenshots of it in the wild: too many. Best three lines of code this quarter.",
  },
  {
    name: "Rizky Pratama",
    handle: "rizkybuilds",
    avatar: "/images/avatar-2.png",
    text: "Copied the install command from the gallery, pasted it into the terminal, 40 seconds later: magic. No config, no glue code. It just showed up and worked.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-[340px] shrink-0 px-3">
      <MagicTweet
        tweet={makeTweet(
          testimonial.name,
          testimonial.handle,
          testimonial.avatar,
          testimonial.text,
        )}
        className="border-border/70 bg-card/80 backdrop-blur-sm"
      />
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Wall of Love"
          title={
            <>
              Builders{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                obsess
              </AuroraText>{" "}
              over it.
            </>
          }
          description="Fictional builders, real feelings. The tweets are lovingly fabricated — the components are the real thing."
        />
      </div>

      <div className="relative mt-16 space-y-6">
        <Marquee
          pauseOnHover
          className="[--duration:70s] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          {ROW_ONE.map((testimonial) => (
            <TestimonialCard key={`${testimonial.handle}-${testimonial.text}`} testimonial={testimonial} />
          ))}
        </Marquee>

        <Marquee
          reverse
          pauseOnHover
          className="[--duration:85s] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          {ROW_TWO.map((testimonial) => (
            <TestimonialCard key={`${testimonial.handle}-${testimonial.text}`} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
