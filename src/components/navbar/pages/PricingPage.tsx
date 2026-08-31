import { Link } from "react-router-dom";

function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started.",
      features: [
        "Browse all products",
        "Basic product search",
        "Product wishlist",
        "Customer support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      description: "For regular shoppers who want more.",
      features: [
        "Everything in Free",
        "Advanced product filters",
        "Priority support",
        "Exclusive offers",
        "Faster delivery options",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "$39",
      description: "The ultimate shopping experience.",
      features: [
        "Everything in Pro",
        "Premium deals",
        "Free priority delivery",
        "VIP customer support",
        "Early access to products",
      ],
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-20 text-center">
        <p className="font-semibold uppercase tracking-wider text-blue-400">
          Simple pricing
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Choose your plan
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Pick the plan that works best for you. Upgrade whenever you need.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-white p-8 shadow-sm ${
                plan.popular
                  ? "border-blue-500 shadow-xl shadow-blue-100"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </span>
              )}

              <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>

              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>

              <div className="mt-7">
                <span className="text-5xl font-black text-slate-900">
                  {plan.price}
                </span>

                {plan.price !== "$0" && (
                  <span className="text-slate-500"> / month</span>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ✓
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default PricingPage;
