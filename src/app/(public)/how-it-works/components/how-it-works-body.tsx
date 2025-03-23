'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle,
  ArrowRight, 
  ChevronDown, 
  User,
  Tag,
  MessageSquareText,
  LogIn,
  Store,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import FAQBody from '@/components/public/faq-body';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Step data structure
interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  iframe?: React.ReactNode;
  links?: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Create Your Account',
    description: 'Sign up for an account to access our platform. Choose your role (Student, Faculty, or Alumni) to get role-specific pricing.',
    icon: <User className="size-6" />,
    color: 'bg-blue-500 text-white',
    image: '/img/carousel-image.jpg',
    features: [
      {
        title: 'Role Selection',
        description: 'Select your role to get special discounts and pricing.',
        icon: <Tag className="size-5 text-blue-500" />
      },
      {
        title: 'Account Verification',
        description: 'Verify your account with your university email.',
        icon: <CheckCircle className="size-5 text-green-500" />
      },
      {
        title: 'Profile Setup',
        description: 'Complete your profile for a personalized experience.',
        icon: <User className="size-5 text-blue-500" />
      }
    ],
    links: [
      {
        title: 'Sign Up',
        url: '/sign-up',
        icon: <User className="size-4" />
      },
      {
        title: 'Login',
        url: '/sign-in',
        icon: <LogIn className="size-4" />
      }
    ],
    iframe: <iframe className='rounded-md' src="https://app.tango.us/app/embed/a2f72339-4671-4f9e-afbc-df00a2897b2c?skipCover=true&defaultListView=false&skipBranding=true&makeViewOnly=true&hideAuthorAndDetails=true" sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin" security="restricted" title="How to Create your Account at MerchTrack" width="100%" height="100%" referrerPolicy="strict-origin-when-cross-origin" frameBorder="0" allowFullScreen></iframe>
  },
  {
    id: 2,
    title: 'Browse & Add to Cart',
    description: 'Explore our wide range of university merchandise. Filter products, view details, and add items to your cart.',
    icon: <ShoppingCart className="size-6" />,
    color: 'bg-green-500 text-white',
    image: '/img/carousel-image.jpg',
    features: [
      {
        title: 'Advanced Filtering',
        description: 'Filter products by category, price, and availability.',
        icon: <Search className="size-5 text-green-500" />
      },
      {
        title: 'Role-based Pricing',
        description: 'See special prices based on your university role.',
        icon: <Tag className="size-5 text-green-500" />
      },
      {
        title: 'Item Notes',
        description: 'Add special notes or requirements for each item.',
        icon: <MessageSquareText className="size-5 text-green-500" />
      }
    ],
    links: [
      {
        title: 'Products',
        url: '/products',
        icon: <Store className="size-4" />
      },
    ],
    iframe: <iframe src="https://app.tango.us/app/embed/cae95383-3bbe-4b25-9fbd-e4df72c8891e?skipCover=false&defaultListView=false&skipBranding=false&makeViewOnly=true&hideAuthorAndDetails=false" sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin" security="restricted" title="How to browse and add merch to cart on MerchTrack" width="100%" height="100%" referrerPolicy="strict-origin-when-cross-origin" frameBorder="0"  allowFullScreen></iframe>
  },
  {
    id: 3,
    title: 'Payment & Checkout',
    description: 'Complete your purchase securely. Choose from multiple payment options and receive instant order confirmation via email.',
    icon: <CreditCard className="size-6" />,
    color: 'bg-purple-500 text-white',
    image: '/img/carousel-image.jpg',
    features: [
      {
        title: 'Multiple Payment Options',
        description: 'Choose from onsite or offsite payment methods.',
        icon: <CreditCard className="size-5 text-purple-500" />
      },
      {
        title: 'Instant Confirmation',
        description: 'Receive order confirmation email with details.',
        icon: <CheckCircle className="size-5 text-green-500" />
      },
      {
        title: 'Payment Status Updates',
        description: 'Get email notifications for payment verification.',
        icon: <MessageSquareText className="size-5 text-purple-500" />
      }
    ],
    links: [
      {
        title: 'Place Order',
        url: '/checkout',
        icon: <CreditCard className="size-4" />
      },
      {
        title: 'My Orders',
        url: '/my-account/orders',
        icon: <Package className="size-4" />
      }
    ],
    iframe: <iframe src="https://app.tango.us/app/embed/7040f540-df4c-42f8-87a0-8617cf7e176a?skipCover=false&defaultListView=false&skipBranding=false&makeViewOnly=true&hideAuthorAndDetails=false" sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin" security="restricted" title="How to checkout your cart and report an offsite payment at MerchTrack" width="100%" height="100%" referrerPolicy="strict-origin-when-cross-origin" frameBorder="0"  allowFullScreen></iframe>
  },
  {
    id: 4,
    title: 'Track & Receive Order',
    description: 'Monitor your order status in real-time. Get email notifications for every status update until delivery.',
    icon: <Package className="size-6" />,
    color: 'bg-orange-500 text-white',
    image: '/img/carousel-image.jpg',
    features: [
      {
        title: 'Status Updates',
        description: 'Receive emails for every order status change.',
        icon: <MessageSquareText className="size-5 text-orange-500" />
      },
      {
        title: 'Real-time Tracking',
        description: 'Track your order progress from processing to ready.',
        icon: <Package className="size-5 text-orange-500" />
      },
      {
        title: 'Delivery Confirmation',
        description: 'Get notified when your order is ready for pickup.',
        icon: <Truck className="size-5 text-orange-500" />
      }
    ],
    links: [
      {
        title: 'Track Order',
        url: '/my-account/orders',
        icon: <Package className="size-4" />
      }
    ],
    iframe: <iframe src="https://app.tango.us/app/embed/7ced7224-627c-4056-94b7-df0a45eec45a?skipCover=false&defaultListView=false&skipBranding=false&makeViewOnly=true&hideAuthorAndDetails=false" sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin" security="restricted" title="How to track your order and feedback at MerchTrack" width="100%" height="100%" referrerPolicy="strict-origin-when-cross-origin" frameBorder="0" allowFullScreen></iframe>
  },
  {
    id: 5,
    title: 'Contact Support',
    description: 'Need help? Create support tickets through your account for any inquiries or assistance.',
    icon: <MessageSquareText className="size-6" />,
    color: 'bg-indigo-500 text-white',
    image: '/img/carousel-image.jpg',
    features: [
      {
        title: 'Support Tickets',
        description: 'Create and track support tickets in your account.',
        icon: <MessageSquareText className="size-5 text-indigo-500" />
      },
      {
        title: 'Quick Response',
        description: 'Get email notifications for ticket updates.',
        icon: <ArrowRight className="size-5 text-indigo-500" />
      },
      {
        title: 'Order Assistance',
        description: 'Get help with orders, payments, or general inquiries.',
        icon: <User className="size-5 text-indigo-500" />
      }
    ],
    links: [
      {
        title: 'Support',
        url: '/my-account/tickets',
        icon: <MessageSquareText className="size-4" />
      },
      {
        title: 'FAQs',
        url: '/faqs',
        icon: <HelpCircle className="size-4" />
      }
    ],
    iframe: <iframe src="https://app.tango.us/app/embed/efd38e42-569c-4049-9537-e37742c19e89?skipCover=false&defaultListView=false&skipBranding=false&makeViewOnly=true&hideAuthorAndDetails=false" sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin" security="restricted" title="How to contact Support team on MerchTrack" width="100%" height="100%" referrerPolicy="strict-origin-when-cross-origin" frameBorder="0" allowFullScreen></iframe>
  }
];

export default function HowItWorksBody() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Get the current step data
  const currentStep = steps.find(step => step.id === activeStep) || steps[0];
  
  // Handle step change
  const handleStepChange = (stepId: number) => {
    setActiveStep(stepId);
    setIsExpanded(false);
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
      setIsExpanded(false);
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      setIsExpanded(false);
    }
  };

  return (
    <div className="mx-auto mb-24 mt-8 w-full">
      {/* Progress Steps */}
      <div className="mb-10 hidden md:block">
        <div className="relative mx-auto flex justify-between px-8">
          {/* Progress line */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
          
          {/* Steps */}
          {steps.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: step.id * 0.1 }}
              className="relative z-10"
            >
              <button
                onClick={() => handleStepChange(step.id)}
                className={cn('flex size-14 items-center text-white justify-center rounded-full border-2 transition-all duration-300',
                  step.id === activeStep
                    ? `${currentStep.color.replace('text-white', 'border-' + currentStep.color.split('-')[1])}`
                    : step.id < activeStep
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-400"
                )}
                aria-label={`Go to step ${step.id}: ${step.title}`}
              >
                {step.id < activeStep ? (
                  <CheckCircle className="size-6" />
                ) : (
                  step.icon
                )}
              </button>
              <div className={`mt-2 text-center text-sm font-medium ${
                step.id === activeStep ? "text-primary" : "text-gray-500"
              }`}>
                {step.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Steps Dropdown */}
      <div className="mb-8 block md:hidden">
        <button
          type='button' 
          className="relative rounded-lg border bg-white shadow-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex cursor-pointer items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-full ${currentStep.color}`}>
                {currentStep.icon}
              </div>
              <div>
                <div className="font-medium">Step {currentStep.id}: {currentStep.title}</div>
                <div className="text-sm text-gray-500">{currentStep.id} of {steps.length}</div>
              </div>
            </div>
            <ChevronDown className={`size-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t p-2">
                  {steps.map((step) => (
                    <motion.div
                      key={step.id}
                      whileHover={{ x: 4 }}
                      className={`cursor-pointer rounded-md p-2 ${
                        step.id === activeStep ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleStepChange(step.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('flex text-white size-8 items-center justify-center rounded-full', 
                          step.id === activeStep
                            ? currentStep.color.replace('text-white', 'border-' + currentStep.color.split('-')[1])
                            : step.id < activeStep
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-500"
                        )}>
                          {step.id < activeStep ? (
                            <CheckCircle className="size-4" />
                          ) : (
                            <div className="text-sm font-medium">{step.id}</div>
                          )}
                        </div>
                        <div className="font-medium">{step.title}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Step Content */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className={currentStep.color.replace('bg-', 'bg-opacity-10 text-').replace('text-white', '')}>
                  Step {currentStep.id} of {steps.length}
                </Badge>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">{currentStep.title}</h2>
                <p className="mt-3 text-lg text-gray-600">{currentStep.description}</p>
              </motion.div>

              {/* Features List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 space-y-4"
              >
                {currentStep.features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Step Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative min-h-[600px] overflow-hidden rounded-2xl shadow-2xl md:min-h-[400px]"
            >
              <div className="relative size-full overflow-hidden rounded-sm">
                {currentStep.iframe}
              </div>
            </motion.div>
          </div>

          {/* Interactive Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 rounded-xl border bg-gray-50 p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
              <span className={`flex size-8 items-center justify-center rounded-full ${currentStep.color}`}>
                {currentStep.id}
              </span>
              Interactive Demo: {currentStep.title}
            </h3>
            
            <Card className="overflow-hidden">
              <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Try it yourself</h4>
                  <p className="text-gray-600">Experience how easy it is to {currentStep.title.toLowerCase()}.</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${currentStep.color}`}>
                      {currentStep.icon}
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <motion.div 
                        className={`h-full rounded-full ${currentStep.color.replace('text-white', '')}`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative rounded-lg bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-primary">Relevant Links</h3>
                  <div className="grid gap-3">
                    {currentStep.links?.map((link, index) => (
                      <Link 
                        key={index} 
                        href={link.url} 
                        className={cn(
                          "flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200",
                          "hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md",
                          "active:scale-[0.98]"
                        )}
                      >
                        <div className={cn(
                          "flex size-8 items-center justify-center rounded-full",
                          currentStep.color.replace('bg-', 'bg-opacity-10 ').replace('text-white', '')
                        )}>
                          {link.icon}
                        </div>
                        <span className="font-medium">{link.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={activeStep === 1}
          className="gap-2"
        >
          <ArrowRight className="size-4 rotate-180" />
          Previous Step
        </Button>
        
        <div className="hidden items-center gap-1 md:flex">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`size-2 rounded-full transition-colors ${
                step.id === activeStep
                  ? currentStep.color.replace('text-white', '')
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <Button
          onClick={handleNextStep}
          disabled={activeStep === steps.length}
          className="gap-2"
        >
          Next Step
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 p-8 text-center text-white shadow-lg"
      >
        <h2 className="mb-2 text-3xl font-bold">Ready to Get Started?</h2>
        <p className="mb-6 text-lg text-blue-100">Browse our collection of university merchandise today!</p>
        <Link href='/products' className="rounded-md bg-white px-4 py-2 font-semibold text-primary hover:bg-blue-50">
          Shop Now
        </Link>

      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-20 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className='-mb-24 flex flex-col items-center justify-between'>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mb-6 text-gray-600">Have questions? We have answers! Check out our FAQ section.</p>
        </div>
        <FAQBody displayTitle={false} />
      </motion.div>
    </div>
  );
}