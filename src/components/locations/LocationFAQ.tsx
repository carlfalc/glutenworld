import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LocationFAQ = () => {
  const faqs = [
    {
      question: "How do I find 100% gluten-free restaurants near me?",
      answer: "Use our dedicated GF kitchen filter in the search results. This shows only restaurants with completely separate gluten-free preparation areas, eliminating cross-contamination risk."
    },
    {
      question: "Which cities have the most gluten-free restaurants?",
      answer: "New York City leads with 1,234 GF locations, followed by Los Angeles (987), London (876), and Paris (654). We update these numbers daily as new restaurants are added."
    },
    {
      question: "Can I find gluten-free bakeries in Europe?",
      answer: "Yes! We have extensive coverage across Europe with 2,187 verified GF bakeries. France, Germany, and Italy have particularly strong offerings with many 100% dedicated facilities."
    },
    {
      question: "How do you verify restaurants are celiac-safe?",
      answer: "Our verification process includes on-site visits, staff interviews, kitchen inspections, and ongoing community reviews from diagnosed celiacs who've dined there safely."
    },
    {
      question: "Does the app work offline when traveling?",
      answer: "Yes! Download city guides before traveling to access restaurant information, maps, and reviews without internet connection. Perfect for international travel."
    },
    {
      question: "Can I filter for dedicated gluten-free kitchens?",
      answer: "Absolutely. Our 'Dedicated GF Kitchen' filter shows only restaurants with completely separate preparation areas, utensils, and cooking surfaces for gluten-free food."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about finding safe gluten-free dining worldwide
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border border-border">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LocationFAQ;