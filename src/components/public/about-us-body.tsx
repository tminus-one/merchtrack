'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Award, Heart } from 'lucide-react';
import { ABOUT_DEVELOPERS, ABOUT_US_CONTENT, ABOUT_DEVELOPERS_LEAD as lead } from '@/constants';
import PageTitle from '@/components/public/page-title';

function AboutUsBody() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const values = [
    {
      title: "Innovation",
      description: "Pushing boundaries and exploring new possibilities",
      icon: <Lightbulb className="size-6 text-primary" />,
      gradient: "from-blue-50 to-blue-100",
      hoverGradient: "hover:from-primary-50 hover:to-primary-100",
      hoverText: "group-hover:text-primary-700"
    },
    {
      title: "Excellence",
      description: "Delivering quality in everything we do",
      icon: <Award className="size-6 text-primary" />,
      gradient: "from-green-50 to-green-100",
      hoverGradient: "hover:from-green-50 hover:to-green-100",
      hoverText: "group-hover:text-green-700"
    },
    {
      title: "Integrity",
      description: "Building trust through honest practices",
      icon: <Heart className="size-6 text-primary" />,
      gradient: "from-purple-50 to-purple-100",
      hoverGradient: "hover:from-purple-50 hover:to-purple-100",
      hoverText: "group-hover:text-purple-700"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">   
        <motion.div 
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <PageTitle
            title={ABOUT_US_CONTENT.title}
            description="Learn about MerchTrack's mission, vision, and the dedicated team behind our innovative merchandise management platform."
          />

          <div className="p-8 sm:p-12">
            {/* Mission Section */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
                <span className="mr-4 flex size-12 items-center justify-center rounded-lg bg-primary-100 p-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label='Mission Icon'>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Our Mission
              </h2>
              <div className="rounded-xl bg-blue-50 p-6">
                <p className="text-gray-700 sm:text-lg">
                  We are dedicated to creating innovative solutions that empower businesses 
                  and individuals to achieve their goals. Through cutting-edge technology 
                  and exceptional service, we strive to make a positive impact in the world.
                </p>
              </div>
            </motion.div>
        
            {/* Values Section */}
            <motion.div 
              className="mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="mb-8 flex items-center text-2xl font-bold text-gray-800">
                <span className="mr-4 flex size-12 items-center justify-center rounded-lg bg-primary-100 p-2 text-primary">
                  <Award className="size-6" />
                </span>
                Our Values
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`group rounded-xl bg-gradient-to-br ${value.gradient} p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 ${value.hoverGradient}`}
                  >
                    <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-white/70 shadow-sm">
                      {value.icon}
                    </div>
                    <h3 className={`mb-3 text-lg font-semibold tracking-tight text-gray-800 ${value.hoverText}`}>{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        
            {/* Team Experience Section */}
            <motion.div 
              className="mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-800">
                <span className="mr-4 flex size-12 items-center justify-center rounded-lg bg-primary-100 p-2 text-primary">
                  <Users className="size-6" />
                </span>
                Our Team
              </h2>
              <p className="mb-8 text-gray-700 sm:text-lg">
                Our diverse team of experts brings together years of experience in 
                software development, design, and customer service. We&apos;re passionate 
                about creating solutions that make a difference.
              </p>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <motion.div variants={itemVariants} className="group overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-lg bg-white/70 shadow-sm">
                      <Lightbulb className="size-8 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Creativity</h3>
                      <p className="text-gray-600">Inspiring ideas that shape the future</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="group overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-lg bg-white/70 shadow-sm">
                      <Users className="size-8 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Community</h3>
                      <p className="text-gray-600">Empowering connections and fostering growth</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
    
            {/* Developers Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="mb-8 flex items-center text-2xl font-bold text-gray-800">
                <span className="mr-4 flex size-12 items-center justify-center rounded-lg bg-primary-100 p-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                Meet Our Developers
              </h2>

              {/* Lead Developer */}
              <motion.div 
                variants={itemVariants}
                className="from-primary-50 mb-12 overflow-hidden rounded-xl bg-gradient-to-r to-blue-50 p-8 shadow-sm"
              >
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                  <div className="mb-6 sm:mb-0 sm:mr-8">
                    <div className="relative mx-auto inline-block size-40 overflow-hidden rounded-xl bg-white p-1 shadow-md sm:mx-0">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-200 to-primary-400 opacity-50 blur-md"></div>
                      <div className="relative size-full overflow-hidden rounded-lg">
                        <Image
                          src={lead.image}
                          alt={`${lead.name}'s Profile Picture`}
                          height={300}
                          width={300}
                          className="size-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary">
                      Team Lead
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-800">{lead.name}</h3>
                    <p className="mb-4 text-lg text-gray-600">{lead.role}</p>
                    <p className="text-gray-600">
                      Leading our development team with expertise in full-stack development
                      and a passion for creating elegant, user-friendly applications.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Developer Team */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {ABOUT_DEVELOPERS.map((developer, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className="group overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
                  >
                    <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner">
                      <Image
                        src={developer.image}
                        alt={`${developer.name}'s Profile Picture`}
                        height={300}
                        width={300}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-800 group-hover:text-primary">{developer.name}</h3>
                    <p className="text-sm text-gray-600">{developer.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutUsBody;
