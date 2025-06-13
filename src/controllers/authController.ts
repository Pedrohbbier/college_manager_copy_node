import { Request, Response } from "express";
import { auth } from "../config/firebase/firebase";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AppDataSource } from "../config/database/ormconfig";
import { User } from "../entity/User";

class AuthController {

    private userRepo = AppDataSource.getRepository(User);

    async register(req: Request, res: Response): Promise<void> {
        const { email, password, name, role } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email e senha são obrigatórios." , success: false });
            return;
        }

        if(!name) {
            res.status(400).json({ message: "Nome é obrigatório." , success: false });
            return;
        }

        if (!role) {
            res.status(400).json({ message: "Função é obrigatória." , success: false });
            return;
        }

        let firebaseId = null;

        try {
            const firebaseUser = await auth.createUser({ email, password });
            firebaseId = firebaseUser.uid;

            const newUser = this.userRepo.create({
                firebaseUid: firebaseUser.uid,
                email,
                name,
            });

            const existingUser = await this.userRepo.findOneBy({ email });

            if (existingUser) {
                res.status(400).json({ message: "Email já cadastrado.", success: false });
                return;
            }

            const savedUser = await this.userRepo.save(newUser);

            const token = jwt.sign(
                { id: savedUser.id, uid: firebaseUser.uid, email: savedUser.email },
                process.env.JWT_SECRET!,
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso', data: {
                    user: savedUser,
                    token
                },
                success: true,
            });
        } catch (error) {

            if (firebaseId) {
                try {
                    await auth.deleteUser(firebaseId);
                } catch (deleteError) {
                }
            }

            res.status(500).json({ message: "Erro ao criar usuário, tente novamente.", success: false });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email e senha são obrigatórios." , success: false });
            return;
        }

        try {
            const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
            const response = await axios.post(firebaseUrl, {
                email,
                password,
                returnSecureToken: true,
            });

            const { localId, email: firebaseEmail } = response.data;


            let user = await this.userRepo.findOneBy({ firebaseUid: localId });


            if (!user) {
                user = this.userRepo.create({ firebaseUid: localId, email: firebaseEmail });
                await this.userRepo.save(user);
            }

            const token = jwt.sign(
                { id: user.id, uid: localId, email: firebaseEmail },
                process.env.JWT_SECRET!,
            );

            res.status(200).json({ message: "Login realizado com sucesso" , data: {
                user: user,
                token
            },
            success: true
        });
        } catch (error: any) {

            res.status(401).json({
                message: "Ocorreu um erro, cheque suas credenciais e tente novamente!",
            });
        }
    }

}

export default new AuthController();