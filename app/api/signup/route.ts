import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

const EMAIL_UNIQUE_CONSTRAINT = "gs_signups_email_unique";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, group_id } = body;

  if (!name || !email || !group_id) {
    return NextResponse.json({ error: "Name, email, and group are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Fetch group info for response messaging
  const [group] = await sql`SELECT id, sector, channel_name, max_members FROM gs_groups WHERE id = ${group_id}`;
  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  // Atomic conditional INSERT: only inserts if group is under capacity.
  // Avoids TOCTOU race between separate SELECT+INSERT.
  try {
    const inserted = await sql`
      INSERT INTO gs_signups (name, email, group_id)
      SELECT ${name.trim()}, ${email.trim().toLowerCase()}, ${group_id}
      FROM gs_groups g
      WHERE g.id = ${group_id}
        AND (SELECT COUNT(*) FROM gs_signups WHERE group_id = ${group_id}) < g.max_members
      RETURNING id
    `;

    if (inserted.length === 0) {
      return NextResponse.json({
        error: `This group is full (${group.max_members}/${group.max_members} members).`,
      }, { status: 409 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes(EMAIL_UNIQUE_CONSTRAINT)) {
      return NextResponse.json({
        error: "This email is already registered. Each student can only join one group.",
      }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({
    success: true,
    message: `You've joined ${group.sector} (${group.channel_name})!`,
  });
}
