export default function ServicesPage() {
  const services = [
    {
      icon: "🛍️",
      title: "Easy Shopping",
      description:
        "Browse thousands of products with powerful search and filtering tools.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly and safely right to your doorstep.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description:
        "Your payments and personal information are protected with secure technology.",
    },
    {
      icon: "💬",
      title: "Customer Support",
      description:
        "Our support team is ready to help you whenever you need assistance.",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description:
        "Changed your mind? Our simple return process makes things hassle-free.",
    },
    {
      icon: "⭐",
      title: "Quality Products",
      description:
        "We carefully select products to provide you with quality and value.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-20 text-center">
        <p className="font-semibold uppercase tracking-wider text-blue-400">
          What we offer
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Our Services
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Everything you need for a simple, secure, and enjoyable shopping
          experience.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                {service.icon}
              </div>

              <h2 className="mt-6 text-xl font-bold text-slate-900">
                {service.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
