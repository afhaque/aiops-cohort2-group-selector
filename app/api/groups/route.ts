import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  const groups = await sql`
    SELECT
      g.id,
      g.channel_name,
      g.sector,
      g.description,
      g.max_members,
      COUNT(s.id)::int AS member_count
    FROM gs_groups g
    LEFT JOIN gs_signups s ON s.group_id = g.id
    GROUP BY g.id
    ORDER BY g.id
  `;

  return NextResponse.json({ groups });
}
