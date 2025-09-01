import { Router } from "express";

const userRouter = Router();

import { prisma } from "db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../../packages/db/generated/prisma";

userRouter.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                role: Role.User,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User created successfully.", user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

userRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "devforces_secret",
            { expiresIn: "1d" }
        );

        res.json({ message: "Signin successful.", token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

export default userRouter;