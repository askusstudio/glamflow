// TermsPage.tsx
export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">Terms &amp; Conditions</h1>
        <section className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to GlamFlow! By accessing or using our website, mobile app, or services, you agree to the following Terms &amp; Conditions. Please read them carefully before using GlamFlow.
          </p>
        </section>
        <section className="space-y-4 mb-8">
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
            <li>
              <span className="font-semibold text-gray-900">Acceptance of Terms</span>
              <p className="ml-4 mt-1">
                By visiting, registering, or using GlamFlow’s services, you agree to comply with these Terms. If you do not agree, please do not use our platform.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Services Provided</span>
              <p className="ml-4 mt-1">
                GlamFlow offers business management and automation tools designed for freelancers, coaches, consultants, and creative professionals. Features may include appointment booking, invoicing, client management, analytics, and other business growth tools.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Eligibility</span>
              <p className="ml-4 mt-1">
                You must be at least 18 years old to use GlamFlow services. By using our platform, you confirm that all information provided is true, accurate, and complete.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Account Registration</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You agree to notify GlamFlow immediately of any unauthorized access to your account.</li>
                <li>GlamFlow is not liable for losses due to your failure to safeguard login details.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Subscription &amp; Payments</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>GlamFlow services may be offered under different subscription plans.</li>
                <li>All payments are to be made securely via our integrated payment gateway.</li>
                <li>Subscriptions are billed either monthly or annually, depending on the plan you choose.</li>
                <li>Failure to make timely payments may result in suspension or termination of services.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Cancellation &amp; Refund Policy</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You may cancel your subscription anytime through your account dashboard or by contacting support.</li>
                <li>Refunds will be processed in accordance with our Refund Policy.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">User Responsibilities</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>You agree not to misuse GlamFlow services (e.g., spamming, hacking, distributing malicious content).</li>
                <li>You are solely responsible for the content and data you upload to GlamFlow.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Data Privacy</span>
              <p className="ml-4 mt-1">
                Your privacy is important to us. All personal information is handled in accordance with our Privacy Policy.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Intellectual Property</span>
              <ul className="list-disc list-inside ml-8 mt-1 space-y-1">
                <li>All content, branding, design, and technology on GlamFlow are owned by us.</li>
                <li>You may not reproduce, copy, or redistribute any part of the platform without written consent.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Termination of Services</span>
              <p className="ml-4 mt-1">
                GlamFlow reserves the right to suspend or terminate accounts found violating these Terms.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Limitation of Liability</span>
              <p className="ml-4 mt-1">
                GlamFlow is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Modifications</span>
              <p className="ml-4 mt-1">
                We may update these Terms &amp; Conditions from time to time. Updated terms will be effective immediately upon posting.
              </p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Contact Information</span>
              <div className="ml-4 mt-1 space-y-1">
                <div>
                  <span className="font-medium">📧 Email:</span> <a href="mailto:askusstudio@gmail.com" className="hover:text-pink-600 transition-colors">askusstudio@gmail.com</a>
                </div>
                <div>
                  <span className="font-medium">📞 Phone:</span> <a href="tel:+918009227002" className="hover:text-pink-600 transition-colors">+91-8009227002</a>
                </div>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
