

import Link from "next/link";
import { Pill, Thermometer, Heart, Package, Stethoscope, Baby, Eye, Bone } from "lucide-react";

export default function CategoryPage() {
    const categories = [
        {
            name: "Pain Relief",
            icon: Pill,
            description: "Headaches, muscle pain & fever",
            color: "bg-red-100 text-red-600",
            url: "/shop?category=pain-relief"
        },
        {
            name: "Cold & Flu",
            icon: Thermometer,
            description: "Cough, cold & flu medicines",
            color: "bg-blue-100 text-blue-600",
            url: "/shop?category=cold-flu"
        },
        {
            name: "Heart Health",
            icon: Heart,
            description: "Cardiovascular care products",
            color: "bg-pink-100 text-pink-600",
            url: "/shop?category=heart-health"
        },
        {
            name: "First Aid",
            icon: Package,
            description: "Bandages, antiseptics & more",
            color: "bg-green-100 text-green-600",
            url: "/shop?category=first-aid"
        },
        {
            name: "Vitamins",
            icon: Stethoscope,
            description: "Supplements & multivitamins",
            color: "bg-yellow-100 text-yellow-600",
            url: "/shop?category=vitamins"
        },
        {
            name: "Baby Care",
            icon: Baby,
            description: "Products for infants & kids",
            color: "bg-purple-100 text-purple-600",
            url: "/shop?category=baby-care"
        },
        {
            name: "Eye Care",
            icon: Eye,
            description: "Eye drops & vision care",
            color: "bg-indigo-100 text-indigo-600",
            url: "/shop?category=eye-care"
        },
        {
            name: "Bone & Joint",
            icon: Bone,
            description: "Joint pain & bone health",
            color: "bg-orange-100 text-orange-600",
            url: "/shop?category=bone-joint"
        }
    ];

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse our wide range of medical categories and find the right products for your health needs
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.name}
                                href={category.url}
                                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {category.description}
                                </p>
                                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                                    Browse products
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8 md:mt-12">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                        View All Products
                        
                    </Link>
                </div>
            </div>
        </section>
    );
}