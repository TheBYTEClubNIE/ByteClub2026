import { adminToken, jsonBody, sameSecret, tooMany } from "@/lib/security";

// Hands out a signed session that expires, never a reusable secret.
export async function POST(request: Request) {
    if (tooMany(request, "login", 5, 15 * 60_000)) {
        return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    }
    const body = await jsonBody(request);
    // both checks always run, so timing doesn't reveal which one failed
    const user = sameSecret(body?.username, process.env.ADMIN_USERNAME);
    const pass = sameSecret(body?.password, process.env.ADMIN_PASSWORD);
    if (!user || !pass) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    return Response.json({ token: adminToken() });
}
