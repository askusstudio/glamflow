import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sparkles, Calendar, Target, TrendingUp, Users, Palette, Star, ArrowRight } from "lucide-react"
import heroImage from "@/assets/hero-beauty.jpg"

const Landing = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Manage appointments, avoid conflicts, and sync with your calendar seamlessly."
    },
    {
      icon: Target,
      title: "Task Management",
      description: "Organize your beauty kit, client prep, and marketing tasks effortlessly."
    },
    {
      icon: TrendingUp,
      title: "Earnings Analytics",
      description: "Track your income, identify top services, and optimize your pricing."
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Store client preferences, track repeat customers, and grow your business."
    }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Bridal Makeup Artist",
      content: "GlamFlow helped me organize my wedding season bookings perfectly. No more double bookings!",
      rating: 5
    },
    {
      name: "Meera Patel",
      role: "Hair Stylist",
      content: "The earnings tracker showed me which services are most profitable. I increased my income by 40%!",
      rating: 5
    }
  ]

  

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GlamFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => window.location.href = '/auth'} className="bg-gradient-primary hover:shadow-glow transition-all">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                <Palette className="h-3 w-3 mr-1" />
                For Beauty Professionals
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Manage your beauty 
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> freelance </span>
                  business with elegance
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  The all-in-one platform designed specifically for beauty freelancers. 
                  Schedule appointments, manage tasks, track earnings, and grow your business.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>4.9/5 rating</span>
                </div>
                <div>500+ beauty professionals</div>
                <div>Free 14-day trial</div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Beauty workspace with professional tools"
                className="rounded-2xl shadow-elegant w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for beauty professionals with features that understand your unique business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loved by beauty professionals
            </h2>
            <p className="text-xl text-muted-foreground">
              See how GlamFlow is transforming beauty businesses across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-soft transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to elevate your beauty business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of beauty professionals who are already growing their business with GlamFlow.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
                GlamFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 GlamFlow. Built for beauty professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing