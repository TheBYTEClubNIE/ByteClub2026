export async function POST(request: Request) {
    const { username, password } = await request.json();

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return Response.json({ token: process.env.ADMIN_TOKEN });
    }

    return Response.json({ error: "Invalid credentials" }, { status: 401 });
}
