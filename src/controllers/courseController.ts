import { Request, Response } from "express";
import { AppDataSource } from "../config/database/ormconfig";
import { Course } from "../entity/Course";

class CourseController {

    async listAll(req: Request, res: Response): Promise<void> {
        try {

            const courseRepository = AppDataSource.getRepository(Course);

            const courses = await courseRepository.find();
            res.status(200).json({
                message: "Lista de cursos obtida com sucesso",
                data: { courses },
                success: true
            });
            return
        } catch (error) {
            console.error("Erro listAll courses:", error);
            res.status(500).json({
                message: "Erro ao obter lista de cursos",
                success: false,
            });
            return
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {

            const courseRepository = AppDataSource.getRepository(Course);

            const course = await courseRepository.findOneBy({ id: Number(id) });
            if (!course) {
                res.status(404).json({
                    message: "Curso não encontrado",
                    success: false,
                });
                return
            }
            res.status(200).json({
                message: "Curso obtido com sucesso",
                data: { course },
                success: true,
            });
            return
        } catch (error) {
            console.error("Erro getById course:", error);
            res.status(500).json({
                message: "Erro ao buscar curso",
                success: false,
            });
            return
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const { name, description, modality, type, enade } = req.body;
        if (!name) {
            res.status(400).json({
                message: "O campo 'name' é obrigatório.",
                success: false,
            });
            return
        }

        try {

            let imagePath;

            if (req.files) {
                if (Array.isArray(req.files)) {
                    const file = req.files[0] as Express.Multer.File;
                    if (file && file.filename) {
                        imagePath = `uploads/${file.filename}`;
                    }
                } 
            }

            const courseRepository = AppDataSource.getRepository(Course);


            const newCourse = courseRepository.create({
                name,
                description,
                modality,
                type,
                enade,
                image: imagePath,
            });

            const saved = await courseRepository.save(newCourse);

            res.status(201).json({
                message: "Curso criado com sucesso",
                data: { course: saved },
                success: true,
            });
            return
        } catch (error) {
            console.error("Erro create course:", error);
            res.status(500).json({
                message: "Erro ao criar curso",
                success: false,
            });
            return
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { name, description, image, modality, type, enade } = req.body;

        try {

            const courseRepository = AppDataSource.getRepository(Course);

            const course = await courseRepository.findOneBy({ id: Number(id) });
            if (!course) {
                res.status(404).json({
                    message: "Curso não encontrado",
                    success: false,
                });
                return
            }

            let imagePath = course.image;

            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if (files['image']) {
                    const image = files['image'][0];
                    imagePath = `uploads/${image.filename}`;
                }
            }

            courseRepository.merge(course, { name, description, image: imagePath, modality, type, enade });
            const updated = await courseRepository.save(course);

            res.status(200).json({
                message: "Curso atualizado com sucesso",
                data: { course: updated },
                success: true,
            });
            return
        } catch (error) {
            console.error("Erro update course:", error);
            res.status(500).json({
                message: "Erro ao atualizar curso",
                success: false,
            });
            return
        }
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const courseRepository = AppDataSource.getRepository(Course);

            const result = await courseRepository.delete({ id: Number(id) });
            if (result.affected === 0) {
                res.status(404).json({
                    message: "Curso não encontrado",
                    success: false,
                });
                return
            }
            res.status(200).json({
                message: "Curso removido com sucesso",
                success: true,
            });
            return
        } catch (error) {
            console.error("Erro remove course:", error);
            res.status(500).json({
                message: "Erro ao remover curso",
                success: false,
            });
            return
        }
    }
}

export default new CourseController();
