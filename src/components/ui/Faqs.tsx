export default function FAQs() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p className="text-muted-foreground">
                            Everything you need to know about GlamFlow and how it can help your business.
                        </p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">What is GlamFlow?</h3>
                            <p className="text-muted-foreground mt-4">
                                GlamFlow is an all-in-one salon and beauty business management platform designed for freelancers, independent makeup artists, personal trainers, spas, and salons.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Why Choose GlamFlow?</h3>
                            <p className="text-muted-foreground mt-4">
                                Running a small beauty or wellness business comes with daily challenges:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-4 text-muted-foreground">
                        
                                <li>Time wasted on manual scheduling and payment tracking.</li>
                                <li>Lack of a professional online presence and marketing support.</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                GlamFlow solves these problems by automating your operations and helping you scale without hiring extra staff. It’s built for freelancers and small businesses who want to compete with big brands.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">How Does GlamFlow Work?</h3>
                            <ul className="list-decimal list-outside space-y-2 pl-4 text-muted-foreground mt-4">
                                <li>
                                    <span className="font-medium">Create your profile:</span> Add your services, prices, and availability.
                                </li>
                                <li>
                                    <span className="font-medium">Accept online bookings:</span> Share your booking page link on WhatsApp, Instagram, or your website.
                                </li>
                                <li>
                                    <span className="font-medium">Get automated reminders:</span> Reduce no-shows with SMS/WhatsApp notifications.
                                </li>
                                <li>
                                    <span className="font-medium">Track payments &amp; packages:</span> Accept UPI/cards, manage memberships, and monitor revenue.
                                </li>
                                <li>
                                    <span className="font-medium">Market your business:</span> Use built-in tools like referral programs, loyalty points, and email/SMS promotions.
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                Everything is accessible via mobile app or desktop dashboard, making it seamless for you and your clients.
                            </p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Why Is GlamFlow Important for You?</h3>
                            <ul className="list-disc list-outside space-y-2 pl-4 text-muted-foreground mt-4">
                                <li>Save hours of admin work.</li>
                                <li>Boost revenue by reducing missed appointments.</li>
                                <li>Build a strong digital presence with zero coding skills.</li>
                              
                            </ul>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">How Useful Is GlamFlow?</h3>
                            <ul className="list-disc list-outside space-y-2 pl-4 text-muted-foreground mt-4">
                                <li>Automates bookings, payments, and marketing in one place.</li>
                                <li>Provides real-time business analytics (sales, clients, busiest hours).</li>
                                <li>Makes your business look professional and trustworthy online.</li>
                             
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}