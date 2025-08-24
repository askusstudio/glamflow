// FooterSection.tsx
import { Link } from 'react-router-dom';

const links = [
  { title: 'Features', href: '/#features' },
  { title: 'FAQs', href: '/#faq' },
  { title: 'Pricing', href: '/#pricing' },
  { title: 'About', href: '/#about' },
  { title: 'Privacy Policy', href: '/PrivacyPolicy', external: true },
  { title: 'Terms & Conditions', href: '/TermsPage', external: true },
];

export default function FooterSection() {
  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} GlamFlow, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, idx) =>
              link.external ? (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary block duration-150"
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  key={idx}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary block duration-150"
                >
                  {link.title}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
