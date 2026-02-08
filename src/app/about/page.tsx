'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="space-y-16">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About MediStore</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          Your trusted online medicine shop. We make healthcare accessible and convenient.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3 text-center">
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-600">
            To provide affordable and reliable medicines to everyone, everywhere.
          </p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p className="text-gray-600">
            Revolutionizing online healthcare with fast and secure delivery.
          </p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-2">Our Values</h2>
          <p className="text-gray-600">
            Trust, Transparency, and Customer Satisfaction.
          </p>
        </div>
      </section>

      {/* Team / Info Cards */}
      <section className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Image
            src="/team1.jpg"
            alt="Team Member 1"
            width={120}
            height={120}
            className="mx-auto rounded-full mb-4"
          />
          <h3 className="text-lg font-semibold">Dr. John Doe</h3>
          <p className="text-gray-500">Founder & CEO</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Image
            src="/team2.jpg"
            alt="Team Member 2"
            width={120}
            height={120}
            className="mx-auto rounded-full mb-4"
          />
          <h3 className="text-lg font-semibold">Jane Smith</h3>
          <p className="text-gray-500">Head of Operations</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Image
            src="/team3.jpg"
            alt="Team Member 3"
            width={120}
            height={120}
            className="mx-auto rounded-full mb-4"
          />
          <h3 className="text-lg font-semibold">Ali Khan</h3>
          <p className="text-gray-500">Lead Developer</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-50 py-16 text-center px-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to explore our shop?</h2>
        <p className="text-gray-600 mb-6">Browse our medicines and place your order today!</p>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Shop Now</Button>
      </section>

    </div>
  )
}
