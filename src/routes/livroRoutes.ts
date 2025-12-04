import { Router, Request, Response } from "express";
import { LivroController } from "../controllers/LivroController";

const router = Router();
const livroController = new LivroController();

/**
 * POST /api/livros
 * Cria um novo livro
 */
router.post("/", (req: Request, res: Response) => {
  livroController.criar(req, res);
});

/**
 * GET /api/livros
 * Retorna todos os livros
 */
router.get("/", (req: Request, res: Response) => {
  livroController.obterTodos(req, res);
});

/**
 * GET /api/livros/:id
 * Retorna um livro específico
 */
router.get("/:id", (req: Request, res: Response) => {
  livroController.obterPorId(req, res);
});

/**
 * PUT /api/livros/:id
 * Atualiza todas as informações de um livro
 */
router.put("/:id", (req: Request, res: Response) => {
  livroController.atualizar(req, res);
});

/**
 * PATCH /api/livros/:id
 * Atualiza parcialmente um livro
 */
router.patch("/:id", (req: Request, res: Response) => {
  livroController.atualizarParcial(req, res);
});

/**
 * DELETE /api/livros/:id
 * Remove um livro
 */
router.delete("/:id", (req: Request, res: Response) => {
  livroController.remover(req, res);
});

export default router;
