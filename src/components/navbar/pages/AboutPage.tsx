import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Hero content */}
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                About our store
              </span>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Shopping made
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  simple & enjoyable.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                We built our store to make online shopping easier, faster, and
                more enjoyable. Discover quality products, trusted brands, and a
                shopping experience designed around you.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  Explore Products
                </Link>

                <Link
                  to="/"
                  className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 sm:p-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-100">
                        Our Promise
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-white">
                        Shop with confidence.
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                      🛍️
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-2xl font-bold text-white">10K+</p>
                      <p className="mt-1 text-xs text-blue-100">
                        Happy customers
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-2xl font-bold text-white">5K+</p>
                      <p className="mt-1 text-xs text-blue-100">Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 lg:grid-cols-4">
          <div className="px-5 py-8 text-center">
            <p className="text-3xl font-bold text-slate-900">10K+</p>
            <p className="mt-1 text-sm text-slate-500">Happy Customers</p>
          </div>

          <div className="px-5 py-8 text-center">
            <p className="text-3xl font-bold text-slate-900">5K+</p>
            <p className="mt-1 text-sm text-slate-500">Products</p>
          </div>

          <div className="border-t border-slate-200 px-5 py-8 text-center lg:border-t-0">
            <p className="text-3xl font-bold text-slate-900">50+</p>
            <p className="mt-1 text-sm text-slate-500">Brands</p>
          </div>

          <div className="border-t border-slate-200 px-5 py-8 text-center lg:border-t-0">
            <p className="text-3xl font-bold text-slate-900">24/7</p>
            <p className="mt-1 text-sm text-slate-500">Support</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ====================================================== */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-100/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-2xl bg-slate-100 p-8 sm:p-12">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-6xl shadow-xl shadow-blue-600/20">
                  🛒
                </div>

                <div className="mt-8 space-y-3">
                  <div className="h-3 w-3/4 rounded-full bg-slate-300" />
                  <div className="h-3 w-full rounded-full bg-slate-200" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="aspect-square rounded-xl bg-white shadow-sm" />
                  <div className="aspect-square rounded-xl bg-white shadow-sm" />
                  <div className="aspect-square rounded-xl bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-xs font-bold tracking-[3px] text-blue-600">
              OUR STORY
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built around a better way to shop.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              We believe online shopping should be simple. You should be able to
              find what you need quickly, understand what you're buying, and
              enjoy a smooth experience from browsing to checkout.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              That's why we created a marketplace that brings products, brands,
              and customers together in one convenient place.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              From discovering new products to receiving your order, every part
              of the experience is designed with convenience and reliability in
              mind.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  ✓
                </div>

                <h3 className="font-semibold text-slate-900">Quality First</h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Products selected with quality and value in mind.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  ♥
                </div>

                <h3 className="font-semibold text-slate-900">Customer Focus</h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your experience is at the heart of what we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ====================================================== */}
      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold tracking-[3px] text-blue-600">
              WHY SHOP WITH US
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need in one place.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              We focus on the things that make online shopping easier and more
              reliable.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                🚚
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Fast Delivery
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                🔒
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Secure Shopping
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your information and shopping experience are kept secure.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                ⭐
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Quality Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover products chosen to offer quality and great value.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                💬
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Helpful Support
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                We're here to help whenever you need assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION
      ====================================================== */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-14 text-center shadow-2xl sm:px-12 lg:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <span className="text-xs font-bold tracking-[3px] text-blue-300">
              OUR MISSION
            </span>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Making every shopping experience better.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Our mission is to connect people with products they love while
              providing convenience, affordability, and a shopping experience
              they can trust.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
