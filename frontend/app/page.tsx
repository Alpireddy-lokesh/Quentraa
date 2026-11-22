import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Quentraa</h1>
      <p className="text-xl text-gray-600 mb-10">
        Inclusive Digital Queue &amp; Appointment Management Platform
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Branch Manager",
            desc: "Overview, reports, staff & service management",
            href: "/manager",
          },
          {
            title: "Receptionist",
            desc: "Register walk-in visitors and create tokens",
            href: "/receptionist",
          },
          {
            title: "Counter Staff",
            desc: "Call next token and manage service",
            href: "/counter",
          },
          {
            title: "Customer Portal",
            desc: "Join a queue and track your token",
            href: "/customer",
          },
          {
            title: "Public Display",
            desc: "Now-serving token and counter",
            href: "/display",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="card flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-blue-700">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
            <span className="mt-auto btn-secondary inline-block">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
