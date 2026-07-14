import { Resend } from "resend";

const FROM = "EasyDigia <noreply@easydigia.com>";
const ADMIN_URL = "https://easydigia.com/fr/admin/blog";

function getTo(): string {
  return process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com";
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[blog-notifier] RESEND_API_KEY absent — email non envoyé");
    return null;
  }
  return new Resend(key);
}

export async function sendArticleReadyEmail(params: {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: getTo(),
    subject: `📝 Nouvel article prêt — ${params.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <h2 style="color:#8FD400;margin:0 0 24px">Nouvel article généré ✅</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#9BA1B0;width:120px">Titre</td>
            <td style="padding:8px 0;font-weight:600">${params.title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9BA1B0">Catégorie</td>
            <td style="padding:8px 0">${params.category}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9BA1B0">Extrait</td>
            <td style="padding:8px 0;color:#9BA1B0">${params.excerpt}</td>
          </tr>
        </table>
        <div style="margin-top:28px;text-align:center">
          <a href="${ADMIN_URL}"
             style="display:inline-block;background:linear-gradient(135deg,#8FD400,#C6FF00);color:#0A0B10;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px">
            → Valider et publier
          </a>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#9BA1B0;text-align:center">
          Slug : <code>${params.slug}</code>
        </p>
      </div>
    `,
  });
}

export async function sendArticleErrorEmail(params: {
  theme: string;
  error: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: getTo(),
    subject: `❌ Erreur génération article — ${params.theme}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <h2 style="color:#FF4444;margin:0 0 24px">Erreur de génération ❌</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#9BA1B0;width:120px">Thème</td>
            <td style="padding:8px 0;font-weight:600">${params.theme}</td>
          </tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#12141C;border-radius:8px;border-left:3px solid #FF4444">
          <p style="margin:0;color:#9BA1B0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Erreur</p>
          <p style="margin:8px 0 0;font-family:monospace;font-size:13px;color:#FF8888">${params.error}</p>
        </div>
        <p style="margin-top:16px;font-size:13px;color:#9BA1B0">
          Le compteur de thème n'a pas été incrémenté. Le prochain run reprendra sur ce thème.
        </p>
      </div>
    `,
  });
}
