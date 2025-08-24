import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Why Choose GlamFlow?</h2>
          <p className="mt-4 text-muted-foreground text-lg">Running a small beauty or wellness business comes with daily challenges</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 *:text-center md:mt-16 mx-auto">
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Make your work easy</h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-left">
                <li>Are you Missing or double-booked appointments.</li>
                <li>Did you wastes lot of Time wasted on manual scheduling and payment tracking.</li>
                <li>Lack of a professional online presence on Internet and Not getting marketing support .</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Give you ability to </h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-left">
                <li>Create your profile: Add your services, prices, and availability.</li>
                <li>Accept online bookings: Share your booking page link on WhatsApp, Instagram, or your website.</li>
                <li>Get automated reminders: Reduce no-shows with SMS/WhatsApp notifications.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Easy payment and Marketing</h3>
            </CardHeader>
            <CardContent>
              <ul className=" list-disc list-inside space-y-2 text-sm text-left">
                <li>Track payments & packages: Accept UPI/cards and monitor revenue.</li>
                <li>Market your business: Use built-in tools like referral programs, loyalty points, and email/SMS promotions.</li>
                <li>Everything is accessible via mobile app or desktop dashboard, making it seamless for you.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground text-lg mt-8 text-center">
          GlamFlow solves these problems by automating your operations and helping you scale without hiring extra staff. It’s built for freelancers and small businesses who want to compete with big brands.
        </p>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
)
