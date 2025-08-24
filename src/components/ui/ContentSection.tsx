import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <img
                    className="rounded-[var(--radius)] shadow-lg border border-black"
                    src="/hero-img.png"
                    alt="team image"
                    height=""
                    width=""
                    loading="lazy"
                />

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    {/* <h2 className="text-4xl font-medium">The Lyra ecosystem brings together our models, products and platforms.</h2> */}
                    <h2 className="text-4xl font-medium">We provide you Simple & clean design so you can focus on your Work.</h2>
                    <div className="space-y-6">
                    
                        <p>GlamFlow is fast, secure and easy to use. Either you are new in the field or someone with year of expreience we are everything for everyone.Get your Appointments, meeting and workflow on time. Try it now.</p>

                        {/* <Button
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5"
                            onClick={() => window.location.href = "#"}
                        >
                            <span>Learn More</span>
                            <ChevronRight className="size-2" />
                        </Button> */}
                    </div>
                </div>
            </div>
        </section>
    )
}