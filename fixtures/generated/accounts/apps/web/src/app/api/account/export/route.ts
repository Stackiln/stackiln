import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  const sessions = await auth.api.listSessions({ headers: request.headers });
  const data = {
    exportedAt: new Date().toISOString(),
    profile: session.user,
    sessions: sessions.map(
      ({ id, createdAt, updatedAt, expiresAt, ipAddress, userAgent }) => ({
        id,
        createdAt,
        updatedAt,
        expiresAt,
        ipAddress,
        userAgent,
      }),
    ),
  };
  return Response.json(data, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": 'attachment; filename="account-data.json"',
    },
  });
}
