import type { Metadata } from "next";

import MessagesInbox from "@/components/admin/messages/MessagesInbox";
import { getAdminMessages } from "@/lib/adminMessages";

export const metadata: Metadata = { title: "Messages" };
// Visitors send messages at any time, so the inbox is read on every request.
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getAdminMessages();

  return <MessagesInbox initialMessages={messages} />;
}
