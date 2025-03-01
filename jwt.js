const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const jwtAuthMiddleware = (req, res, next) => {
    // Check if Authorization header is present
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "Token Not Found" });

    // Extract the JWT token from the Authorization header
    const token = authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    if (!userData || typeof userData !== "object") {
        throw new Error("Invalid user object for token generation.");
    }

    // Ensure only plain object data is used
    const payload = {
        id: userData._id.toString(), // Convert ObjectId to string
        email: userData.email
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { jwtAuthMiddleware, generateToken };
