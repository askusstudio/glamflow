// PrivacyPolicy.tsx
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">Privacy Policy</h1>
        
        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Data & Privacy</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Your data is stored securely and only used to deliver the service.</li>
            <li>You consent to receiving transactional and promotional communications.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Cookie Policy (for website)</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>We use cookies to improve user experience and analyze traffic.</li>
            <li>Cookies are small files stored on your device; you can disable them via browser.</li>
            <li>Some features may not work properly if cookies are disabled.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Compliance</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Follows Indian IT Act (2000) and Data Protection norms (DPDP Act 2023).</li>
            <li>GST-compliant invoices.</li>
            <li>PCI-DSS-compliant payment processing.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">User Obligations for Privacy</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>You are responsible for all content uploaded (photos, prices, offers) and must ensure they do not violate copyright or third-party rights.</li>
            <li>Content uploaded by users must not violate laws, harm reputation, or include obscene/hate content.</li>
            <li>GlamFlow may remove any content deemed inappropriate.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Intellectual Property and Data</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Users retain rights to their uploaded content (images, offers).</li>
            <li>Unauthorized copying, reverse-engineering, or resale of GlamFlow features is prohibited.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Support & Contact for Privacy Concerns</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Support channels: Email, WhatsApp, and Priority (for Pro plans).</li>
            <li>Average response time: 24–48 hours for basic support, &lt;12 hours for Pro plans.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
