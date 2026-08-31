import { useState } from "react";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-20 text-center">
        <p className="font-semibold uppercase tracking-wider text-blue-400">
          Get in touch
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Contact Us
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Have a question or need help? Send us a message and we'll get back to
          you.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact information */}
          <div className="rounded-3xl bg-slate-950 p-8 text-white lg:col-span-2">
            <h2 className="text-2xl font-bold">Let's talk</h2>

            <p className="mt-3 leading-7 text-slate-400">
              Our team is here to answer your questions and help you get the
              most out of our platform.
            </p>

            <div className="mt-10 space-y-7">
              <div className="flex gap-4">
                <span className="text-2xl">📧</span>

                <div>
                  <p className="font-semibold">Email</p>
                  <p className="mt-1 text-sm text-slate-400">
                    support@example.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📞</span>

                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="mt-1 text-sm text-slate-400">+1 234 567 890</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📍</span>

                <div>
                  <p className="font-semibold">Address</p>
                  <p className="mt-1 text-sm text-slate-400">
                    123 Main Street
                    <br />
                    New York, NY
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-3">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
                  ✓
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Message sent!
                </h2>

                <p className="mt-2 text-slate-500">
                  Thank you for contacting us. We'll get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Name
                      </label>

                      <input
                        required
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email
                      </label>

                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Subject
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Message
                    </label>

                    <textarea
                      required
                      rows={6}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
