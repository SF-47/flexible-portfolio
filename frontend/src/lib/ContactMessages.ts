export type ContactMessageRequest = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactMessage(
  data: ContactMessageRequest,
): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact-messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (response.status === 429) {
    throw new Error("Too many messages. Please try again later.");
  }

  if (response.status === 400) {
    throw new Error("Please check your contact information.");
  }

  if (!response.ok) {
    throw new Error("Unable to send your message. Please try again.");
  }
}
