"use client";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const defaultTestimonials = [
  {
    name: "Sarah Mitchell",
    role: "Healthcare Provider",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "MediStore has revolutionized how I purchase medicines for my clinic. The authentic products, fast delivery, and competitive prices make it my go-to platform. The quality assurance and verification process gives me complete confidence in every order.",
  },
  {
    name: "James Patterson",
    role: "Chronic Patient",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "As someone who needs regular medication, MediStore has been a lifesaver. No more hassle of visiting pharmacies. Quick delivery, genuine medicines, and excellent customer support.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "General Physician",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    content:
      "I recommend MediStore to all my patients. The platform offers a wide range of medications at reasonable prices, and I trust their commitment to quality. The pharmacist consultation feature is particularly helpful for my elderly patients who have questions about their medications.",
  },
  {
    name: "Michael Chen",
    role: "Satisfied Customer",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content:
      "The convenience of ordering medicines online with such reliability is amazing. MediStore's delivery is always on time, and the packaging ensures medications arrive in perfect condition. Their customer service team is always ready to help with any queries.",
  },
  {
    name: "Lisa Anderson",
    role: "Senior Citizen",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Simple interface, reliable service. At my age, it's difficult to visit pharmacies. MediStore makes it so easy to get my regular medicines delivered home.",
  },
  {
    name: "David Kumar",
    role: "Pharmacy Owner",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "As a pharmacy owner, I use MediStore for bulk orders. Their supplier network is excellent, prices are competitive, and the quality of products is consistently high. The business dashboard helps me track orders and manage inventory efficiently.",
  },
  {
    name: "Rachel Thompson",
    role: "Working Professional",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "With my busy schedule, I don't have time to visit pharmacies. MediStore's express delivery and wide range of products make healthcare shopping so convenient. The subscription service for regular medicines is a brilliant feature that I use monthly.",
  },
  {
    name: "Robert Williams",
    role: "Verified Buyer",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp",
    content:
      "Trustworthy platform with genuine products. I've been using MediStore for over a year now and never had any issues. The prices are fair, delivery is prompt, and customer support is excellent.",
  },
];

interface Testimonial8Props {
  testimonials?: Array<{
    name: string;
    role: string;
    avatar: string;
    content: string;
  }>;
  className?: string;
}

const Testimonial8 = ({
  testimonials = defaultTestimonials,
  className,
}: Testimonial8Props) => {
  return (
    <section className={cn("py-32 ", className)}>
      <div className="container m-auto justify-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-3xl font-semibold lg:text-5xl">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground lg:text-xl">
            Trusted by thousands of customers for authentic medicines and quality healthcare
          </p>
        </div>
        <div className="relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background">
          <div
            className="columns-1 gap-5 md:columns-2 lg:columns-3"
            style={{ columnGap: "20px" }}
          >
            {testimonials.map((testimonial, idx) => {
              // Reorder for masonry flow: distribute across columns first
              const displayIdx = (idx % 3) * 3 + Math.floor(idx / 3);

              return (
                <div
                  key={idx}
                  className={cn(
                    "mb-5",
                    displayIdx > 3 && displayIdx <= 5 && "hidden md:block",
                    displayIdx > 5 && "hidden lg:block",
                  )}
                >
                  <Card className="break-inside-avoid p-5">
                    <div className="flex gap-4 leading-5">
                      <Avatar className="size-10 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div className="mb-2 text-sm">
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="leading-7 text-foreground/60">
                      <q>{testimonial.content}</q>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial8 };
