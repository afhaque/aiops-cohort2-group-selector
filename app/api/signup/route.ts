import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

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

  // Check if group exists and get current count atomically
  const [group] = await sql`
    SELECT g.id, g.sector, g.channel_name, g.max_members,
           COUNT(s.id)::int AS member_count
    FROM gs_groups g
    LEFT JOIN gs_signups s ON s.group_id = g.id
    WHERE g.id = ${group_id}
    GROUP BY g.id
  `;

  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  if (group.member_count >= group.max_members) {
    return NextResponse.json({
      error: `This group is full (${group.max_members}/${group.max_members} members).`
    }, { status: 409 });
  }

  try {
    await sql`
      INSERT INTO gs_signups (name, email, group_id)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${group_id})
    `;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("gs_signups_email_unique")) {
      return NextResponse.json({
        error: "This email is already registered. Each student can only join one group."
      }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({
    success: true,
    message: `You've joined ${group.sector} (${group.channel_name})!`
  });
}
