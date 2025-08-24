import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { useMemo } from 'react'

export default function Pricing() {
  // Memoize static feature lists to prevent unnecessary re-creation on each render
  const freeFeatures = useMemo(() => [
    'Appointment Scheduling (Calendar + WhatsApp reminders)',
    'Client Management (CRM): Basic client list',
    'Service Menu & Pricing Display (Mini Portfolio): Basic',
    'Digital Payments (UPI, Cards, Wallets)',
    'Automated Reminders (SMS/Email/WhatsApp): 5/month',
    'Reports & Analytics (Revenue/Expenses): Basic (monthly summary)',
 
  ], [])

  const proFeatures = useMemo(() => [
    'Everything in Starter',
    'Appointment Scheduling (Calendar + WhatsApp reminders)',
    'Client Management (CRM): Full CRM + Notes',
    'Service Menu & Pricing Display (Mini Portfolio): Advanced with images',
    'Digital Payments (UPI, Cards, Wallets): + Payment Links',
    'Team Management: 2 team members',
    'Inventory Management (Products sold): Basic stock alerts',
    'Automated Reminders (SMS/Email/WhatsApp): 30/month',
    'Reports & Analytics (Revenue/Expenses): Advanced (filters, CSV export)',
    'Marketing Automation (Offers, Coupons): Basic',
 
  ], [])

  const startupFeatures = useMemo(() => [
    'Everything in Growth',
    'Appointment Scheduling (Calendar + WhatsApp reminders): Advanced (multi-staff)',
    'Client Management (CRM): Advanced CRM + segmentation',
    'Service Menu & Pricing Display (Mini Portfolio): Advanced + Website/Booking page',
    'Digital Payments (UPI, Cards, Wallets): + Auto Invoices',
    'Team Management: 5 team members with roles',
    'Inventory Management (Products sold): Full inventory with low-stock notifications',
    'Automated Reminders (SMS/Email/WhatsApp): 100/month',
    'Reports & Analytics (Revenue/Expenses): Pro (predictive analytics)',
    'Marketing Automation (Offers, Coupons): Advanced (auto campaigns)',
  ], [])

  // For Vite+React, use <a> tags for navigation or handle with react-router-dom if needed
  return (
    <section className="py-16 md:py-32 relative z-10"> {/* Ensure higher stacking context */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
          <p>Choose the plan that fits your beauty business needs, from freelancers to growing studios.</p>
        </div>

        {/* Add an opaque background to the cards container */}
        <div className="mt-8 md:mt-20 grid gap-6 md:grid-cols-3 bg-white/95 border border-zinc-100 rounded-2xl shadow-xl p-6 md:p-10 backdrop-blur-sm">
          <Card className="flex flex-col shadow border-none bg-white rounded-xl">
            <CardHeader>
              <CardTitle className="font-medium">Starter</CardTitle>
              <span className="my-3 block text-2xl font-semibold">₹499 / mo</span>
              <CardDescription className="text-sm">Per month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {freeFeatures.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full" asChild>
                <a href="#">Get Started</a>
              </Button>
            </CardFooter>
          </Card>

          <div className="relative flex flex-col">
            {/* Popular Label */}
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-gradient-to-br from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5 shadow">
              Popular
            </span>
            <Card className="flex flex-col shadow-xl border-none bg-white rounded-xl z-0 mt-3">
              <CardHeader>
                <CardTitle className="font-medium">Growth</CardTitle>
                <span className="my-3 block text-2xl font-semibold">₹999 / mo</span>
                <CardDescription className="text-sm">Per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {proFeatures.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href="#">Get Started</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="flex flex-col shadow border-none bg-white rounded-xl">
            <CardHeader>
              <CardTitle className="font-medium">Pro Studio</CardTitle>
              <span className="my-3 block text-2xl font-semibold">₹1,999 / mo</span>
              <CardDescription className="text-sm">Per month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {startupFeatures.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full" asChild>
                <a href="#">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
