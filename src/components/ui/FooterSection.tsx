// FooterSection.tsx
const links = [
  {
    title: 'Features',
    href: '#features',
  },
  {
    title: 'FAQs',
    href: '#faq',
  },
  {
    title: 'Pricing',
    href: '#pricing',
  },
  {
    title: 'About',
    href: '#about',
  },
  {
    title: 'Privacy Policy',
    href: '/PrivacyPolicy',
    external: true,
  },
  {
    title: 'Terms & Conditions',
    href: '/TermsPage',
    external: true,
  },
]

export default function FooterSection() {
  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto w-full max-w-full lg:max-w-5xl px-2 sm:px-4 lg:px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} GlamFlow, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}