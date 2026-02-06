import { ShieldCheck, Truck, HeartPulse } from "lucide-react";

import { cn } from "@/lib/utils";

interface Feature16Props {
  className?: string;
}

const Feature16 = ({ className }: Feature16Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container m-auto justify-center">
        <p className="mb-4 text-sm text-muted-foreground lg:text-base">
          OUR PROMISE
        </p>
        <h2 className="text-3xl font-medium lg:text-4xl">Why Choose MediStore?</h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <div className="rounded-lg bg-accent p-5 transition-all hover:shadow-lg">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-6 text-primary" />
            </span>
            <h3 className="mb-2 text-xl font-medium">100% Authentic</h3>
            <p className="leading-7 text-muted-foreground">
              All our medicines are sourced directly from verified manufacturers and distributors. 
              We guarantee authenticity and quality with every purchase, ensuring your health and safety.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5 transition-all hover:shadow-lg">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Truck className="size-6 text-primary" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Fast Delivery</h3>
            <p className="leading-7 text-muted-foreground">
              Express delivery across the country. Get your medicines delivered to your doorstep 
              within 24-48 hours. We ensure safe and timely delivery with proper packaging.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5 transition-all hover:shadow-lg">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <HeartPulse className="size-6 text-primary" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Expert Support</h3>
            <p className="leading-7 text-muted-foreground">
              Our team of licensed pharmacists is available 24/7 to answer your questions. 
              Get professional advice and guidance on medicine usage, dosage, and health concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature16 };
