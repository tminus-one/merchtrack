'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const faqCategories = [
  {
    title: "Ordering Process",
    questions: [
      {
        question: "What information do I need to provide when placing an order?",
        answer: "When placing an order, you must provide accurate and complete information including: Complete Full Name, Email, Phone Number, College Department, Product Name, and Number of items ordered. Gold in Blue is not responsible for any incorrect information inputted by the customer."
      },
      {
        question: "What happens if I provide incorrect information?",
        answer: "Gold in Blue is not responsible for any incorrect information inputted by the customer when placing an order. Please double-check all your information before submitting your order."
      },
      {
        question: "Can I make corrections to my order after submission?",
        answer: "If you need to correct production information, you must submit an email to the official Gold in Blue email three days before production begins. Any correction requests received after production starts will be disregarded."
      },
      {
        question: "What are the requirements for customized orders like jerseys?",
        answer: "For jerseys or customized orders that include team numbers and surnames, you must provide full payment before production can begin."
      }
    ]
  },
  {
    title: "Payment & Fees",
    questions: [
      {
        question: "What are the payment terms?",
        answer: "To process your order, you must settle at least 50% of the total amount as a down payment by the given deadline. Full payment must be made before production begins. Failure to provide the down payment by the deadline will result in automatic cancellation of your order."
      },
      {
        question: "What payment methods are available?",
        answer: "Payments should be made through the PIXELS Treasurer's available service transactions. When you make a payment, always ensure you receive a receipt, either digital or hard copy, which you'll need to present when picking up your order."
      },
      {
        question: "Are there additional fees for delivery?",
        answer: "Yes, a shipping fee will be charged for products delivered outside of Naga City. The amount depends on the delivery location and weight of the package."
      }
    ]
  },
  {
    title: "Delivery & Pickup",
    questions: [
      {
        question: "How can I receive my order?",
        answer: "Gold in Blue merchandise can be either picked up or delivered. Our sales team will inform you of the schedule for pick-up and delivery options."
      },
      {
        question: "What if I can't pick up my order right away?",
        answer: "If you fail to claim your order within three months, the product will no longer be available for purchase. Unclaimed products will be used for Income Generating Project (IGP) purposes."
      }
    ]
  },
  {
    title: "Returns & Refunds",
    questions: [
      {
        question: "What is your refund policy?",
        answer: "Gold in Blue does not offer refunds or exchanges for any products or services sold. All sales are final."
      },
      {
        question: "Are there any exceptions to the no-refund policy?",
        answer: "Gold in Blue will issue a full refund only under the following conditions: Discontinued product production, price increase in production if the customer wants to cancel their order, or mismanagement in handling the product by the Gold in Blue Team."
      }
    ]
  }
];

function FAQBody() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredFAQs, setFilteredFAQs] = React.useState(faqCategories);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredFAQs(faqCategories);
      return;
    }
    
    const filtered = faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.question.toLowerCase().includes(term) || q.answer.toLowerCase().includes(term)
      )
    })).filter(category => category.questions.length > 0);
    
    setFilteredFAQs(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredFAQs(faqCategories);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">   
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary">Frequently Asked Questions</h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Find answers to common questions about our merchandise, ordering process, and policies.
          </p>
        </div>

        <div className="mb-10 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for questions..."
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Button 
              onClick={clearSearch} 
              variant="outline"
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>

        {filteredFAQs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {filteredFAQs.map((category, categoryIndex) => (
              category.questions.length > 0 && (
                <motion.div
                  key={categoryIndex}
                  variants={itemVariants}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                    <div className="flex items-center">
                      <HelpCircle className="mr-2 size-5 text-primary" />
                      <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                    </div>
                  </div>
                  <div className="divide-y">
                    <Accordion type="single" collapsible className="divide-y">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-none">
                          <AccordionTrigger className="px-6 py-4 text-left text-base hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        ) : (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HelpCircle className="mb-4 size-12 text-blue-400" />
                <CardTitle className="mb-2 text-xl font-semibold">No questions found</CardTitle>
                <CardDescription>
                  We couldn&apos;t find any questions matching &quot;{searchTerm}&quot;. Try using different keywords or browse all categories.
                </CardDescription>
                <Button onClick={clearSearch} variant="outline" className="mt-4">
                  View All Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FAQBody;