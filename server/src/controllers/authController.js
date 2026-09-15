const login = (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.status(200).json({
            token: process.env.ADMIN_TOKEN
        });
    }

    return res.status(401).json({
        error: "Invalid credentials"
    });
};

module.exports = { login };