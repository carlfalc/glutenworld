import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Clock, Users } from "lucide-react";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportModal = ({ open, onOpenChange }: SupportModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Support Center</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Get Help & Support</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We're here to help you make the most of Gluten World. Whether you have questions about features, 
                need technical assistance, or want to share feedback, our support team is ready to assist you.
              </p>
            </section>

            <section className="bg-muted/50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-primary">Email Support</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                For all support inquiries, technical issues, or general questions, please contact us at:
              </p>
              <div className="bg-background p-4 rounded border">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = 'mailto:glutenworldhelp@gmail.com'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  glutenworldhelp@gmail.com
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                We typically respond to emails within 24-48 hours during business days.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">What to Include in Your Email</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Account Information</h4>
                    <p className="text-muted-foreground">Your registered email address and username (if applicable)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Detailed Description</h4>
                    <p className="text-muted-foreground">Clear description of the issue or question you're experiencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Steps to Reproduce</h4>
                    <p className="text-muted-foreground">If reporting a bug, include steps that led to the issue</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground">Device & Browser Information</h4>
                    <p className="text-muted-foreground">What device and browser you're using (helps with troubleshooting)</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Support Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Technical Issues</h4>
                  <p className="text-sm text-muted-foreground">
                    App crashes, login problems, feature not working, sync issues
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Account & Billing</h4>
                  <p className="text-sm text-muted-foreground">
                    Subscription questions, payment issues, account management
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Feature Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    How to use features, recipe conversion help, AI assistance
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">General Inquiries</h4>
                  <p className="text-sm text-muted-foreground">
                    Feedback, suggestions, partnership opportunities
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Technical Issues</span>
                  <span className="text-sm text-muted-foreground">24-48 hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">Account & Billing</span>
                  <span className="text-sm text-muted-foreground">12-24 hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="font-medium">General Inquiries</span>
                  <span className="text-sm text-muted-foreground">48-72 hours</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Response times may be longer during weekends and holidays. We appreciate your patience!
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Before Contacting Support</h3>
              <p className="text-muted-foreground mb-3">
                Try these quick troubleshooting steps that often resolve common issues:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Refresh your browser or restart the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Check your internet connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Try using a different browser or device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">Check our FAQ section for common questions</span>
                </li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};