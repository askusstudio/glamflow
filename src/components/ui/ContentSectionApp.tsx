// Vite+React version: use normal <img> tags instead of next/image

export default function ContentSectionApp() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                    The Lyra ecosystem brings together our models.
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <img
                                src="/app-img.png"
                                className="hidden rounded-[15px] dark:block"
                                alt="payments illustration dark"
                                width={1207}
                                height={929}
                                loading="lazy"
                            />
                            <img
                                src="/app-img.png"
                                className="rounded-[15px] shadow dark:hidden"
                                alt="payments illustration light"
                                width={1207}
                                height={929}
                                // height={929}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            GlamFlow is workflow friend of yours that{" "}
                            <span className="text-accent-foreground font-bold">
                            Automates bookings, payments, and marketing.
                            </span>{" "}
                            — Everything at one place.
                        </p>
                        <p className="text-muted-foreground">
                            It supports an Multiple payments ecosystem — from Marketing to Scheduling to promotions it do everything. We Worry for you so you don't have to. 
                        </p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4">
                                <p>
                                    Using GlamFlow has been like unlocking a secret workflow superpower. It's the perfect for someone looking for simplicity and powerfull tool, enabling you to grow more and worry less with user-friendly enviroment.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">Kulbhushan Vishwakarma, CEO</cite>
                                    {/* <img
                                        className="h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        height={20}
                                        width="auto"
                                        loading="lazy"
                                    /> */}
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}