import {
  Mail,
  MailOpen,
  Search,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

const messages = [
  {
    id: 1,
    name: "Ahmad Hassan",
    email: "ahmad@example.com",
    subject: "Residential Construction",
    message: "I would like to discuss building a new residential property.",
    date: "October 12, 2026",
    isRead: false,
  },
  {
    id: 2,
    name: "Omar Khalil",
    email: "omar@example.com",
    subject: "Commercial Project",
    message: "We are planning a new office building and need a quotation.",
    date: "October 11, 2026",
    isRead: false,
  },
  {
    id: 3,
    name: "Karim Mansour",
    email: "karim@example.com",
    subject: "Renovation Inquiry",
    message: "I want to renovate an existing commercial space.",
    date: "October 10, 2026",
    isRead: true,
  },
];

export default function MessagesPage() {
  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-slate-500">
          View inquiries and messages from website visitors.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Messages", value: messages.length, icon: Mail },
          { label: "Unread", value: unreadCount, icon: Mail },
          {
            label: "Read",
            value: messages.length - unreadCount,
            icon: MailOpen,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <Icon className="mb-4 text-amber-600" size={22} />
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold">Inbox</h2>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">
            <Search size={18} />
            Search messages...
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 ${!message.isRead ? "bg-amber-50/40" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      message.isRead
                        ? "bg-slate-100 text-slate-500"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {message.isRead ? (
                      <MailOpen size={22} />
                    ) : (
                      <Mail size={22} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold">{message.name}</h3>

                      {!message.isRead && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {message.email}
                    </p>

                    <p className="mt-3 font-semibold">{message.subject}</p>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      {message.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={15} />
                  {message.date}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700"
                >
                  Reply by Email
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
