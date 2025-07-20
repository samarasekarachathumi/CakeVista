import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
    // Prevent unauthorized admin creation
    if (req.body.role === "admin") {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to create an admin user" });
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || "customer",
        createdAt: new Date(),
    });

    user.save()
        .then(() => res.status(201).json({ message: "User created successfully" }))
        .catch(err => res.status(500).json({ message: err.message }));
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    image: user.image,
                },
                "cbcbatch2023",
            );

            res.status(200).json({
                message: "Login successful",
                token: token,
            });
        })
        .catch(err => res.status(500).json({ message: err.message }));
    
}
