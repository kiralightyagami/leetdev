import { Router } from "express";

const adminRouter = Router();


import { prisma } from "db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../../packages/db/generated/prisma";


adminRouter.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        
        const existingAdmin = await prisma.user.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(409).json({ error: "Admin already exists." });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const admin = await prisma.user.create({
            data: {
                email: email,
                role: Role.Admin,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "Admin created successfully.", admin: { id: admin.id, email: admin.email } });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});


adminRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

       
        const admin = await prisma.user.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

   
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

     
        const token = jwt.sign(
            { adminId: admin.id, email: admin.email },
            process.env.JWT_SECRET || "devforces_secret",
            { expiresIn: "1d" }
        );

        res.json({ message: "Signin successful.", token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});



export default adminRouter;