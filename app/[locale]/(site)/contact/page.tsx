import { ContactHero } from "@/components/contact/ContactHero";
import { InfoCard } from "@/components/contact/InfoCard";
import { HoursCard } from "@/components/contact/HoursCard";
import { ContactForm } from "@/components/contact/ContactForm";
import { Map } from "@/components/contact/Map";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="pb-12">
        <div className="container grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <InfoCard />
            <HoursCard />
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="pb-20 md:pb-24">
        <div className="container">
          <Map />
        </div>
      </section>
    </>
  );
}
