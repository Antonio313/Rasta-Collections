import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@rasta/shared";
import { Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function ContactPage() {
  useDocumentTitle("Contact Us");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/contact", data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-rasta-black sm:text-3xl">
          Contact Us
        </h1>
        <p className="mt-1 text-muted-foreground">
          Have a question? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-rasta-green" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:contact@rastacollections.com"
                className="text-rasta-green hover:underline"
              >
                contact@rastacollections.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="h-5 w-5 text-rasta-green" />
                eBay Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.ebay.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rasta-green hover:underline"
              >
                Visit our eBay store
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our full catalogue and purchase items directly.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="How can we help you?"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-rasta-green hover:bg-rasta-green/90"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
