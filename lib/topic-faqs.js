// Starter FAQs per topic. Used to render an FAQ section + FAQPage JSON-LD
// on /category/<slug> pages. Edit the answers to match your editorial voice;
// each q/a appears in Google's "People also ask"-style rich snippets once
// indexed.
//
// Keep answers short (1-3 sentences) and factually conservative.
export const TOPIC_FAQS = {
  railway: [
    {
      q: 'How can I apply for Railway jobs in 2026?',
      a: 'Visit the official Railway Recruitment Board (RRB) regional website, register with your email and mobile, fill the online form for the relevant notification, upload the required documents, and pay the application fee online.',
    },
    {
      q: 'What is the minimum qualification for RRB jobs?',
      a: '10th pass (Matriculation) is enough for Group D, ITI is required for many Technician posts, 12th pass for NTPC Undergraduate, and a graduate degree for NTPC Graduate-level posts.',
    },
    {
      q: 'What is the selection process for RRB Group D?',
      a: 'A single-stage Computer-Based Test (CBT), followed by a Physical Efficiency Test (PET), document verification and medical examination. Final selection is based on CBT marks and PET qualification.',
    },
    {
      q: 'Which exams does the Railway Recruitment Board conduct?',
      a: 'RRB conducts recruitment for Non-Technical Popular Categories (NTPC), Group D, Assistant Loco Pilot (ALP), Technician, Junior Engineer (JE), Senior Section Engineer (SSE) and several specialist roles across the 21 RRB zones.',
    },
    {
      q: 'What is the application fee for RRB exams?',
      a: 'The fee is typically ₹500 for General/OBC candidates (refundable on appearing for CBT) and ₹250 for SC/ST/Female/Ex-Servicemen candidates (also partially refundable). Exact fees are listed in each notification.',
    },
  ],

  banking: [
    {
      q: 'How do I apply for government bank jobs in India?',
      a: 'Apply through the official IBPS, SBI or RBI websites depending on the notification. Each opens an online application window with form filling, document upload and fee payment. Most public-sector bank exams now run through IBPS as a common gateway.',
    },
    {
      q: 'What is the eligibility for IBPS PO and Clerk exams?',
      a: 'For IBPS PO you need a graduate degree in any discipline and age 20-30. For IBPS Clerk the qualification is the same graduate degree but age range is 20-28. Age relaxations apply for reserved categories.',
    },
    {
      q: 'What is the difference between SBI PO and IBPS PO?',
      a: 'SBI PO is conducted directly by State Bank of India only for SBI vacancies. IBPS PO is conducted by IBPS for 11+ public-sector banks. Syllabus and pattern are similar; SBI PO is generally considered harder.',
    },
    {
      q: 'Which exam is conducted by RBI for officer recruitment?',
      a: 'RBI conducts the Grade B Officer exam (Phase I, Phase II, interview) for general officer roles and the Assistant exam for clerical positions. Specialised cadres (DEPR, DSIM, Legal) have separate notifications.',
    },
    {
      q: 'Is graduation required for bank clerk jobs?',
      a: 'Yes — a bachelor\'s degree in any discipline from a recognised university is the minimum qualification for IBPS Clerk and SBI Clerk roles. Some private banks accept 12th pass for entry-level positions.',
    },
  ],

  ssc: [
    {
      q: 'What is the eligibility for the SSC CGL exam?',
      a: 'A bachelor\'s degree in any discipline is required for most CGL posts. Age limits vary by post — usually 18-32, with relaxations for reserved categories.',
    },
    {
      q: 'What posts are filled through SSC GD Constable?',
      a: 'General Duty Constable posts in CAPFs (BSF, CRPF, CISF, ITBP, SSB), Assam Rifles, NIA and SSF. Selection involves a CBT, Physical Efficiency Test, Physical Standard Test, medical exam and document verification.',
    },
    {
      q: 'How many tiers are there in the SSC CHSL exam?',
      a: 'Two tiers since 2022 — Tier I (objective CBT, 200 marks) and Tier II (objective + descriptive + skill test). The earlier four-tier format was simplified.',
    },
    {
      q: 'What is the age limit for SSC exams?',
      a: 'The standard range is 18-27 for most SSC exams (CGL upper limit goes to 32 for some posts). SC/ST candidates get a 5-year relaxation, OBC 3 years, PWD 10-15 years.',
    },
    {
      q: 'How many times can I attempt SSC CGL?',
      a: 'There is no fixed attempt limit for SSC CGL — you can apply every year as long as you meet the age criteria for that post.',
    },
  ],

  upsc: [
    {
      q: 'What is the age limit for the UPSC Civil Services exam?',
      a: '21-32 years for General category. SC/ST candidates may apply until age 37, OBC until 35. Specific service-level age cut-offs also apply.',
    },
    {
      q: 'How many stages are there in the UPSC CSE?',
      a: 'Three stages: Preliminary (objective screening, two papers), Main (descriptive, nine papers), and Personality Test (interview). Final merit is calculated from Main + Interview.',
    },
    {
      q: 'What is the minimum qualification for UPSC IAS?',
      a: 'A bachelor\'s degree in any discipline from a recognised university. Final-year students can also apply provisionally and submit their degree certificate at the Main exam stage.',
    },
    {
      q: 'Can I apply for UPSC after my final year of college?',
      a: 'Yes — final-year students can appear for the Prelims. If you clear Prelims you must submit proof of graduation when filling the Main application.',
    },
    {
      q: 'How many attempts are allowed in UPSC CSE?',
      a: 'General category candidates get 6 attempts. OBC gets 9, SC/ST get unlimited (within the age limit), and PWD candidates have specific provisions.',
    },
  ],

  defence: [
    {
      q: 'What is the minimum age for joining the Indian Army?',
      a: '17.5 years for Agniveer entry, 16.5 for Technical Entry Scheme, 19 for NDA, and 19-25 for Combined Defence Services (CDS) depending on the wing. Upper limits vary by entry.',
    },
    {
      q: 'How do I apply for Agniveer recruitment?',
      a: 'Apply on the official joinindianarmy.nic.in portal during the open notification window. The process includes online registration, a Common Entrance Examination, a physical fitness test and a medical examination.',
    },
    {
      q: 'What is the selection process for Indian Navy SSR?',
      a: 'A written exam, followed by Physical Fitness Test (PFT), medical examination and document verification. Final merit is based on written exam marks.',
    },
    {
      q: 'What is the eligibility for IAF Airmen recruitment?',
      a: '17-21 years of age and 10+2 with Mathematics, Physics and English (with at least 50% in PCM and 50% in English) for technical trades. Non-technical trades have lighter academic requirements.',
    },
    {
      q: 'Are women eligible for Defence jobs in India?',
      a: 'Yes. Women can apply for Indian Army (Agniveer for women, SSC officers, Military Police), Navy (Agniveer, SSC), Air Force (Agniveer Vayu, SSC) and central armed forces like CRPF and BSF. Eligibility per role varies.',
    },
  ],
}
