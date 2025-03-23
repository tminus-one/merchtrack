"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Zap, Medal, Users } from "lucide-react";

const features = [
  {
    title: "Premium Quality",
    description: "All our merchandise is crafted with high-quality materials that stand the test of time.",
    icon: <Medal className="size-5 text-primary" />,
  },
  {
    title: "Fast Turnaround",
    description: "Quick processing and delivery to meet your university event deadlines.",
    icon: <Zap className="size-5 text-primary" />,
  },
  {
    title: "Custom Designs",
    description: "Personalize your university merchandise with custom designs and branding.",
    icon: <Users className="size-5 text-primary" />,
  },
  {
    title: "University Approved",
    description: "All products are officially licensed and approved by your university.",
    icon: <Check className="size-5 text-primary" />,
  },
];

const UniversityMerchSection = () => {
  return (
    <section className="w-full overflow-hidden py-24">
      <div className="relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Image */}
          <motion.div
            className="relative mx-auto max-w-md px-6 sm:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:px-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 opacity-50 blur-xl"></div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/img/carousel-image.jpg"
                  alt="University merchandise"
                  width={600}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="mt-12 lg:col-span-6 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 lg:pr-0">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                University Merchandise Designed for the Modern Student
              </h2>
              <p className="text-muted-foreground mt-6 text-sm">
                We understand the importance of quality, design, and representing your university with pride. Our merchandise is crafted to exceed your expectations.
              </p>

              <dl className="mt-10 space-y-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <dt>
                      <div className="absolute flex size-10 items-center justify-center rounded-md bg-primary/10">
                        {feature.icon}
                      </div>
                      <p className="ml-16 text-lg font-semibold">{feature.title}</p>
                    </dt>
                    <dd className="ml-16 mt-2 text-sm text-neutral-7">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UniversityMerchSection;

