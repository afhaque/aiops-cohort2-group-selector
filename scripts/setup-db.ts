import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is required");

const sql = neon(DATABASE_URL);

const GROUPS = [
  { channel: "aiops-c2-03-huddle-r2d2", sector: "Operations & Automation", description: "Build AI tools that streamline business workflows and automate repetitive processes." },
  { channel: "aiops-c2-04-huddle-optimus", sector: "Strategy & Leadership", description: "Develop AI applications that support executive decision-making and organizational strategy." },
  { channel: "aiops-c2-05-huddle-cortana", sector: "Marketing & Brand", description: "Create AI-powered marketing tools, content generation, and brand intelligence systems." },
  { channel: "aiops-c2-06-huddle-robocop", sector: "Security & Compliance", description: "Build AI solutions for threat detection, policy enforcement, and regulatory compliance." },
  { channel: "aiops-c2-07-huddle-bender", sector: "Finance & FinTech", description: "Develop AI tools for financial analysis, forecasting, expense management, and FinTech applications." },
  { channel: "aiops-c2-08-huddle-t3", sector: "Sales & Revenue", description: "Build AI-powered sales assistants, pipeline management, and revenue acceleration tools." },
  { channel: "aiops-c2-09-huddle-hal9000", sector: "Customer Success", description: "Create AI systems for customer onboarding, retention, support automation, and success metrics." },
  { channel: "aiops-c2-10-huddle-sonny", sector: "Education & Training", description: "Build AI learning platforms, personalized coaching tools, and knowledge management systems." },
  { channel: "aiops-c2-11-huddle-baymax", sector: "Healthcare & Wellness", description: "Develop AI applications for health monitoring, clinical workflows, and wellness support." },
  { channel: "aiops-c2-12-huddle-walle", sector: "Sustainability & CleanTech", description: "Create AI tools for environmental monitoring, resource optimization, and sustainable operations." },
];

async function main() {
  console.log("Setting up database tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS gs_groups (
      id SERIAL PRIMARY KEY,
      channel_name TEXT NOT NULL UNIQUE,
      sector TEXT NOT NULL,
      description TEXT NOT NULL,
      max_members INT NOT NULL DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gs_signups (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      group_id INT NOT NULL REFERENCES gs_groups(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT gs_signups_email_unique UNIQUE (email)
    )
  `;

  console.log("Tables created. Seeding groups...");

  for (const g of GROUPS) {
    await sql`
      INSERT INTO gs_groups (channel_name, sector, description)
      VALUES (${g.channel}, ${g.sector}, ${g.description})
      ON CONFLICT (channel_name) DO UPDATE
        SET sector = EXCLUDED.sector,
            description = EXCLUDED.description
    `;
    console.log(`  Seeded: ${g.channel}`);
  }

  console.log("Done! Database ready.");
}

main().catch(console.error);
