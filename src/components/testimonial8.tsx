"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllMedicines, getMedicineReviews } from "@/lib/api/medicine";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type ReviewCard = {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  createdAt: string;
};

interface Testimonial8Props {
  className?: string;
}

type Medicine = {
  id: string;
  name: string;
};

const avatarPool = [
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp",
];

const Testimonial8 = ({ className }: Testimonial8Props) => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicTestimonials = async () => {
      try {
        const medicinesResponse = await getAllMedicines();
        const medicines: Medicine[] = Array.isArray(medicinesResponse)
          ? medicinesResponse
          : Array.isArray(medicinesResponse?.data)
            ? medicinesResponse.data
            : [];

        const collected: ReviewCard[] = [];
        const chunkSize = 6;

        for (let i = 0; i < medicines.length && collected.length < 24; i += chunkSize) {
          const chunk = medicines.slice(i, i + chunkSize);

          const reviewBatches = await Promise.all(
            chunk.map(async (medicine) => {
              try {
                const reviews = await getMedicineReviews(medicine.id);
                return reviews.map((review) => ({
                  name: review.user?.name || "Verified Customer",
                  role: `Reviewed ${medicine.name}`,
                  avatar: avatarPool[Math.floor(Math.random() * avatarPool.length)],
                  content: review.comment,
                  rating: review.rating,
                  createdAt: review.createdAt,
                }));
              } catch {
                return [];
              }
            }),
          );

          collected.push(...reviewBatches.flat());
        }

        const flattened: ReviewCard[] = collected
          .filter((item) => item.content && item.content.trim().length > 0)
          .sort((a, b) => {
            const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (dateDiff !== 0) return dateDiff;
            return b.rating - a.rating;
          })
          .slice(0, 12);

        setDynamicTestimonials(flattened);
      } catch (error) {
        console.error("Failed to load dynamic testimonials", error);
        setDynamicTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    void loadDynamicTestimonials();
  }, []);

  const renderedTestimonials = useMemo(() => dynamicTestimonials, [dynamicTestimonials]);

  return (
    <section className={cn("py-32 ", className)}>
      <div className="container m-auto justify-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-3xl font-semibold lg:text-5xl">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground lg:text-xl">
            Trusted by thousands of customers for authentic medicines and quality healthcare
          </p>
        </div>
        <div className="relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background">
          {loading && dynamicTestimonials.length === 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, idx) => (
                <div key={`testimonial-skeleton-${idx}`} className="h-44 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
              ))}
            </div>
          ) : (
          renderedTestimonials.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              No user reviews found in the database yet.
            </div>
          ) : (
          <div
            className="columns-1 gap-5 md:columns-2 lg:columns-3"
            style={{ columnGap: "20px" }}
          >
            {renderedTestimonials.map((testimonial, idx) => {
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

                    <div className="mt-3 flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={`${idx}-star-${starIndex}`}
                          className={cn(
                            "h-3.5 w-3.5",
                            starIndex < Math.round(testimonial.rating) ? "fill-current" : "fill-transparent",
                          )}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          )
          )}
        </div>
      </div>
    </section>
  );
};

export { Testimonial8 };
