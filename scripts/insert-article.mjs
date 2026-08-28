/**
 * Insert a manually written article into Supabase blog_articles table.
 * Run: node scripts/insert-article.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = join(__dirname, "../.env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const bodyFr = readFileSync(
  join(__dirname, "../geo-seo-blog-engine-system/equipment/article_body_formation_ia.html"),
  "utf-8"
);

const bodyEn = `
<p>68% of employees received no AI training in the past 12 months (LSE/Protiviti, October 2025). Yet trained employees save 11 hours per week versus only 5 hours for untrained ones — a 2.2x gap. This guide gives Moroccan SME managers five concrete prompt techniques to teach their teams, with worked examples, so they can close this gap without a large budget or technical skills.</p>

<h2>Why Is AI Training Urgent for Your SME?</h2>
<p>67% of Moroccan business leaders consider AI a strategic priority, but only 19% believe their teams have the skills to use it (APEBI 2025, via Clarodigi, March 2026). Globally, 64% of trained employees report 20%+ productivity gains versus 36% for untrained workers — a 28-point gap (Cognizant, June 2026). The opportunity cost of inaction is real: 53% of Moroccan companies already struggle to find candidates with AI skills (Morocco World News / CGEM / OECD, July 2026).</p>

<h2>What Makes a Good Prompt?</h2>
<p>A good prompt is a precise instruction that gives the AI enough context to produce a directly usable output. The four elements are: Role (who the AI should be), Context (background information), Task (what to do), and Format (how to present the answer). Most employees write two-word prompts. Training them to use four-element prompts is the single highest-impact change a manager can make.</p>

<h2>5 Prompt Techniques to Teach Your Team</h2>
<h3>1. RCTF: Role, Context, Task, Format</h3>
<p>The base structure for any business prompt. Example for a restaurant manager: "You are a Moroccan hospitality marketing expert. My restaurant in Casablanca specializes in traditional cuisine targeting families. Write me 3 WhatsApp messages to invite past customers to our new weekend brunch offer. Maximum 50 words each, warm and informal tone."</p>
<h3>2. Few-Shot Priming</h3>
<p>Provide 2-3 examples before the task. Example for a sales assistant: "Here are two follow-up emails I like: [example 1] [example 2]. Write a similar email for a prospect who visited our website but did not book a meeting."</p>
<h3>3. Chain-of-Thought</h3>
<p>Add "Think step by step before answering" for complex tasks. Example for a finance manager: "Think step by step. We want to reduce our supplier costs by 15%. List 5 concrete negotiation levers adapted to a Moroccan SME, with the estimated impact of each."</p>
<h3>4. Constraint Injection</h3>
<p>Add explicit negative constraints. Example for e-commerce: "Write a product description for our leather bag. Do not mention competitors. No jargon. Maximum 100 words. End with a clear call to action."</p>
<h3>5. Iterative Refinement</h3>
<p>Treat the first output as a draft and give structured feedback: "This is good but too formal. Rewrite it keeping the first paragraph and making the tone more conversational, as if speaking to a friend." Teach teams this loop replaces frustration with results.</p>

<h2>How to Set Up an AI Training Program in 4 Steps</h2>
<p>Step 1: Audit current usage (which tools, which tasks, which risks). Step 2: Define 3-5 priority use cases for your business (emails, summaries, product descriptions, meeting notes). Step 3: Run a 90-minute workshop with real examples from your industry. Step 4: Create a shared prompt library your team can reuse and improve together.</p>

<h2>What Are the Risks of Unmanaged AI?</h2>
<p>Shadow AI is the main risk: 68% of organizations report staff use unapproved AI tools at least occasionally (SAP/Oxford Economics, February 2026). Shadow AI was involved in 20% of AI-related data breaches, adding an average of $670,000 per incident (IBM Cost of a Data Breach Report 2025). 61% of IT leaders say AI increases cybersecurity risks (Lenovo Work Reborn Research, May 2026). A simple internal policy — approved tools, forbidden data types — reduces this risk significantly.</p>

<h2>What ROI Can You Expect?</h2>
<p>Organizations with a company-wide AI training program nearly double their reports of significant AI ROI (DataCamp, 2026). At the individual level, the 11 hours per week saved by trained employees translate to roughly 550 hours per year per employee — equivalent to more than 13 additional work weeks. For a team of 5, that is 65 extra weeks of productive capacity per year, at no additional hiring cost.</p>

<h2>FAQ</h2>
<p><strong>Do my employees need a technical background?</strong> No. The five techniques in this guide require no coding. A 90-minute workshop is enough to get started.</p>
<p><strong>Which AI tool should we use?</strong> ChatGPT (OpenAI) and Claude (Anthropic) are both suitable for teams. Start with the free versions, then upgrade to the business plans when usage is established.</p>
<p><strong>Is our data safe?</strong> Never enter client data, contracts, or banking information into a public AI tool. Use only anonymized or generic information unless your organization has a dedicated enterprise plan with data protection guarantees.</p>
<p><strong>How long before we see results?</strong> Most teams report time savings from the first week when given concrete use cases. Measurable productivity gains appear within 30 days of structured practice.</p>
<p><strong>What is the cost of setting up AI training?</strong> For a team of 5-10 people, a structured internal workshop costs primarily time (one day of preparation, one 90-minute session). External facilitation by a specialist costs 5,000-15,000 MAD for a half-day session tailored to your industry.</p>

<p>To build a prompt training program tailored to your team's actual tasks, <a href="https://easydigia.com/contact">contact EasyDigia</a> — we design practical AI workshops for Moroccan SMEs.</p>
`;

const bodyAr = `
<p>68% من الموظفين لم يتلقوا أي تدريب على الذكاء الاصطناعي في الاثني عشر شهراً الماضية (LSE/Protiviti، أكتوبر 2025). ومع ذلك، يوفر الموظفون المدرَّبون 11 ساعة في الأسبوع مقابل 5 ساعات فقط لغير المدرَّبين، فجوة بنسبة 2.2x. يمنحك هذا الدليل خمس تقنيات عملية للـ prompt لتعليمها لفريقك، مع أمثلة ملموسة، لتحسين الإنتاجية دون ميزانية ضخمة أو مهارات تقنية.</p>

<h2>لماذا التدريب على الذكاء الاصطناعي أولوية للمقاولات المغربية؟</h2>
<p>67% من مديري الأعمال المغاربة يعتبرون الذكاء الاصطناعي أولوية استراتيجية، لكن 19% فقط يعتقدون أن فرقهم تمتلك المهارات اللازمة (APEBI 2025، عبر Clarodigi، مارس 2026). عالمياً، 64% من الموظفين المدرَّبين يُبلغون عن مكاسب إنتاجية تتجاوز 20% مقابل 36% لغير المدرَّبين (Cognizant، يونيو 2026). و53% من الشركات المغربية تجد صعوبة في إيجاد مرشحين يمتلكون مهارات الذكاء الاصطناعي (Morocco World News / CGEM / OCDE، يوليو 2026).</p>

<h2>ما هو الـ Prompt الجيد؟</h2>
<p>الـ prompt الجيد هو تعليمة دقيقة تمنح الذكاء الاصطناعي السياق الكافي لإنتاج نتيجة قابلة للاستخدام مباشرة. العناصر الأربعة: الدور (من يجب أن يكون الذكاء الاصطناعي)، السياق (معلومات خلفية)، المهمة (ما يجب فعله)، والتنسيق (كيفية تقديم الإجابة).</p>

<h2>5 تقنيات Prompt لتعليمها لفريقك</h2>
<h3>1. RCTF: الدور، السياق، المهمة، التنسيق</h3>
<p>الهيكل الأساسي لأي prompt مهني. مثال لمدير مطعم: "أنت خبير تسويق في قطاع الضيافة المغربية. مطعمي في الدار البيضاء متخصص في المطبخ التقليدي يستهدف العائلات. اكتب لي 3 رسائل واتساب لدعوة العملاء القدامى لبرنامج الإفطار الجديد. الحد الأقصى 50 كلمة لكل رسالة، بنبرة دافئة وغير رسمية."</p>
<h3>2. التلقين بالأمثلة (Few-Shot)</h3>
<p>قدم 2-3 أمثلة قبل المهمة. مثال لمساعد مبيعات: "إليك مثالان على رسائل المتابعة التي أفضلها: [المثال 1] [المثال 2]. اكتب رسالة مماثلة لعميل محتمل زار موقعنا لكنه لم يحجز اجتماعاً."</p>
<h3>3. التفكير خطوة بخطوة (Chain-of-Thought)</h3>
<p>أضف "فكر خطوة بخطوة قبل الإجابة" للمهام المعقدة. مثال لمسؤول مالي: "فكر خطوة بخطوة. نريد تخفيض تكاليف الموردين بنسبة 15%. اسرد 5 روافع تفاوضية ملموسة مناسبة لمقاولة مغربية متوسطة مع التأثير المتوقع لكل منها."</p>
<h3>4. حقن القيود (Constraint Injection)</h3>
<p>أضف قيوداً سلبية صريحة. مثال لتجارة إلكترونية: "اكتب وصفاً لحقيبتنا الجلدية. لا تذكر المنافسين. بدون مصطلحات تقنية. الحد الأقصى 100 كلمة. انتهِ بدعوة واضحة للشراء."</p>
<h3>5. التحسين التكراري</h3>
<p>عامل الإخراج الأول كمسودة وقدم ملاحظات منظمة: "هذا جيد لكنه رسمي جداً. أعد صياغته مع الإبقاء على الفقرة الأولى وتليين النبرة كأنك تتحدث لصديق." علّم فريقك هذه الحلقة لتحويل الإحباط إلى نتائج.</p>

<h2>ما هي مخاطر الذكاء الاصطناعي غير المُدار؟</h2>
<p>Shadow AI هو المخاطرة الرئيسية: 68% من المنظمات تُبلغ عن استخدام الموظفين لأدوات ذكاء اصطناعي غير معتمدة (SAP/Oxford Economics، فبراير 2026). كان Shadow AI متورطاً في 20% من خروقات البيانات المرتبطة بالذكاء الاصطناعي بتكلفة إضافية متوسطة قدرها 670,000 دولار (IBM، يوليو 2025). سياسة داخلية بسيطة، الأدوات المعتمدة وأنواع البيانات المحظورة، تقلل هذا الخطر بشكل كبير.</p>

<h2>ما العائد على الاستثمار المتوقع؟</h2>
<p>المنظمات التي لديها برنامج تدريب ذكاء اصطناعي على مستوى الشركة تُضاعف تقريباً تقاريرها عن عائد استثمار ذكاء اصطناعي كبير (DataCamp، 2026). على المستوى الفردي، الـ 11 ساعة أسبوعياً التي يوفرها الموظف المدرَّب تعادل أكثر من 13 أسبوع عمل إضافي في السنة. لفريق من 5 أشخاص: 65 أسبوع إنتاجي إضافي سنوياً دون أي توظيف جديد.</p>

<p>لبناء برنامج تدريب prompt مصمم خصيصاً لمهام فريقك، <a href="https://easydigia.com/contact">تواصل مع EasyDigia</a> لتصميم ورش عمل ذكاء اصطناعي عملية للمقاولات المغربية.</p>
`;

const record = {
  slug: "formation-ia-equipe-prompt-dirigeants",
  category: "strategy",
  read_min: 10,
  published: true,
  image_url: "https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  content: {
    fr: {
      title: "Former son équipe à l'IA : le guide du prompt pour dirigeants de PME (2026)",
      tag: "Stratégie IA",
      excerpt: "68% des employés n'ont reçu aucune formation IA. Ce guide pratique enseigne 5 techniques de prompt pour booster la productivité de votre PME dès cette semaine.",
      body: bodyFr,
    },
    en: {
      title: "AI Training for Your Team: The Prompt Guide for SME Managers (2026)",
      tag: "AI Strategy",
      excerpt: "68% of employees received no AI training. This practical guide teaches 5 prompt techniques to boost your SME's productivity starting this week.",
      body: bodyEn,
    },
    ar: {
      title: "تدريب فريقك على الذكاء الاصطناعي: دليل الـ Prompt لمسيري المقاولات (2026)",
      tag: "استراتيجية الذكاء الاصطناعي",
      excerpt: "68% من الموظفين لم يتلقوا أي تدريب على الذكاء الاصطناعي. هذا الدليل يعلمك 5 تقنيات prompt لرفع إنتاجية مقاولتك ابتداءً من هذا الأسبوع.",
      body: bodyAr,
    },
  },
};

const { data, error } = await supabase
  .from("blog_articles")
  .insert(record)
  .select("id, slug")
  .single();

if (error) {
  console.error("❌ Insert failed:", error.message);
  process.exit(1);
}

console.log(`✅ Article inséré — id: ${data.id}, slug: ${data.slug}`);
console.log(`🔗 https://easydigia.com/fr/blog/${data.slug}`);
