import { Router, Request, Response } from "express";
import { LivroController } from "../controllers/LivroController";

const router = Router();
const livroController = new LivroController();

router.post("/", (req: Request, res: Response) => {
  livroController.criar(req, res);
});

router.get("/", (req: Request, res: Response) => {
  livroController.obterTodos(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  livroController.obterPorId(req, res);
});

router.put("/:id", (req: Request, res: Response) => {
  livroController.atualizar(req, res);
});

router.patch("/:id", (req: Request, res: Response) => {
  livroController.atualizarParcial(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  livroController.remover(req, res);
});

export default router;
