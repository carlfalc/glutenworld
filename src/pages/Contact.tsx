import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Bug, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FAQModal } from '@/components/FAQModal';
import { SupportModal } from '@/components/SupportModal';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  inquiryType: z.enum(['general', 'technical', 'billing', 'feature', 'bug'], {
    required_error: 'Please select an inquiry type'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      inquiryType: 'general',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - in real implementation, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just mailto since no email edge function exists yet
      const emailBody = `
Name: ${data.name}
Email: ${data.email}
Inquiry Type: ${data.inquiryType}
Subject: ${data.subject}

Message:
${data.message}
      `.trim();

      const mailtoUrl = `mailto:glutenworldhelp@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
      
      toast({
        title: "Thank you for contacting us!",
        description: "Your email client has been opened. We'll respond within 24-48 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or email us directly at glutenworldhelp@gmail.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Question', icon: MessageSquare },
    { value: 'technical', label: 'Technical Support', icon: HelpCircle },
    { value: 'billing', label: 'Billing & Subscriptions', icon: Mail },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'bug', label: 'Bug Report', icon: Bug }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact <span className="text-gluten-primary">Gluten World</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team for any questions, feedback, or assistance you need.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="w-6 h-6 text-gluten-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the type of inquiry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inquiryTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="w-4 h-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your inquiry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide details about your inquiry..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gluten-primary hover:bg-gluten-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Quick Links */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gluten-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">glutenworldhelp@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gluten-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gluten-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Global Coverage</p>
                    <p className="text-sm text-muted-foreground">Supporting users worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Help</CardTitle>
                <CardDescription>
                  Get instant answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowFAQ(true)}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Frequently Asked Questions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowSupport(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Support Categories
                </Button>
              </CardContent>
            </Card>

            {/* Support Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Common Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Account & Billing</p>
                  <p className="text-muted-foreground">Subscription, payments, refunds</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Technical Issues</p>
                  <p className="text-muted-foreground">App bugs, login problems, syncing</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Recipe Conversion</p>
                  <p className="text-muted-foreground">AI accuracy, ingredient suggestions</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Store Locator</p>
                  <p className="text-muted-foreground">Missing locations, incorrect info</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FAQModal open={showFAQ} onOpenChange={setShowFAQ} />
      <SupportModal open={showSupport} onOpenChange={setShowSupport} />
    </div>
  );
};

export default Contact;