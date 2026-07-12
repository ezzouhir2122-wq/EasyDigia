import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { ContactForm } from "@/components/ContactForm";

const messages = {
  contact: {
    name: "Nom",
    email: "Email",
    company: "Entreprise",
    service: "Service",
    message: "Message",
    submit: "Envoyer",
    success: "Merci !",
    error: "Erreur",
    required: "Requis",
  },
};

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <ContactForm />
    </NextIntlClientProvider>
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    );
  });

  it("submits and shows success", async () => {
    setup();
    await userEvent.type(screen.getByLabelText("Nom"), "Ali");
    await userEvent.type(screen.getByLabelText("Email"), "ali@test.com");
    await userEvent.type(screen.getByLabelText("Message"), "Bonjour");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() => expect(screen.getByText("Merci !")).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith(
      "/api/lead",
      expect.objectContaining({ method: "POST" })
    );
  });
});
