import { Hero47 } from "@/components/layouts/hero47";
import CategoryPage from "./category/page";
import { Products } from "@/components/products";
import { Testimonial8 } from "@/components/testimonial8";
import { Feature16 } from "@/components/feature16";
import HomeSections from "@/components/home-sections";

export default function HomePage() {
    return (
        <div>
            <Hero47 />
            <HomeSections />
            <CategoryPage />
            <Products />
            <Testimonial8></Testimonial8>
            <Feature16></Feature16>
        </div>
    )
}
