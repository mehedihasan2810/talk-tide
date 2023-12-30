import BgGradients from "@/components/Home/BgGradients";
import Hero from "@/components/Home/Hero";
import MockMessageItems from "@/components/Home/MockMessageItems";

export default function Home() {
  return (
    <section className="relative isolate grid h-screen w-screen place-items-center overflow-hidden">
      <Hero />

      <BgGradients />

      <MockMessageItems />
    </section>
  );
}
