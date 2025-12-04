import { Request, Response } from "express";
import { LivroRepository } from "../repositories/LivroRepository";
import { Livro } from "../entities/Livro";

export class LivroController {
  private livroRepository: LivroRepository;

  constructor() {
    this.livroRepository = new LivroRepository();
  }

  /**
   * POST /api/livros
   * Cria um novo livro com validações de negócio
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      // Validações de negócio
      if (!titulo || !autor || !isbn || anoPublicacao === undefined) {
        res.status(400).json({
          erro: "Erro na validação dos dados",
          mensagem: "Campos obrigatórios: titulo, autor, isbn, anoPublicacao",
        });
        return;
      }

      // Validar formato ISBN (básico: comprimento entre 10 e 17)
      if (isbn.length < 10 || isbn.length > 17) {
        res.status(400).json({
          erro: "Erro na validação do ISBN",
          mensagem: "ISBN deve ter entre 10 e 17 caracteres",
        });
        return;
      }

      // Validar ano de publicação
      const anoAtual = new Date().getFullYear();
      if (anoPublicacao < 1000 || anoPublicacao > anoAtual) {
        res.status(400).json({
          erro: "Erro na validação do ano",
          mensagem: `Ano de publicação deve estar entre 1000 e ${anoAtual}`,
        });
        return;
      }

      // Verificar se ISBN já existe
      const livroExistente = await this.livroRepository.obterPorIsbn(isbn);
      if (livroExistente) {
        res.status(409).json({
          erro: "Livro já existe",
          mensagem: "Um livro com este ISBN já está cadastrado",
        });
        return;
      }

      // Criar o livro
      const novoLivro = await this.livroRepository.criar({
        titulo,
        autor,
        isbn,
        anoPublicacao,
        disponivel: disponivel !== undefined ? disponivel : true,
      });

      res.status(201).json({
        mensagem: "Livro criado com sucesso",
        livro: novoLivro,
      });
    } catch (erro) {
      console.error("Erro ao criar livro:", erro);
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: "Falha ao criar o livro",
      });
    }
  }

  /**
   * GET /api/livros
   * Retorna a lista completa de livros
   */
  async obterTodos(req: Request, res: Response): Promise<void> {
    try {
      const livros = await this.livroRepository.obterTodos();

      res.status(200).json({
        total: livros.length,
        livros: livros,
      });
    } catch (erro) {
      console.error("Erro ao obter livros:", erro);
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: "Falha ao obter a lista de livros",
      });
    }
  }

  /**
   * GET /api/livros/:id
   * Retorna os detalhes de um livro específico
   */
  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar se o ID é um número
      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "ID deve ser um número positivo",
        });
        return;
      }

      const livro = await this.livroRepository.obterPorId(Number(id));

      if (!livro) {
        res.status(404).json({
          erro: "Livro não encontrado",
          mensagem: `Nenhum livro com ID ${id}`,
        });
        return;
      }

      res.status(200).json({
        livro: livro,
      });
    } catch (erro) {
      console.error("Erro ao obter livro:", erro);
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: "Falha ao obter o livro",
      });
    }
  }

  /**
   * PUT /api/livros/:id
   * Atualiza todas as informações de um livro
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      // Validar se o ID é um número
      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "ID deve ser um número positivo",
        });
        return;
      }

      // Verificar se o livro existe
      const livroExistente = await this.livroRepository.obterPorId(Number(id));
      if (!livroExistente) {
        res.status(404).json({
          erro: "Livro não encontrado",
          mensagem: `Nenhum livro com ID ${id}`,
        });
        return;
      }

      // Validar dados se forem fornecidos
      if (titulo !== undefined && (!titulo || typeof titulo !== "string")) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "Título deve ser uma string não vazia",
        });
        return;
      }

      if (autor !== undefined && (!autor || typeof autor !== "string")) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "Autor deve ser uma string não vazia",
        });
        return;
      }

      if (isbn !== undefined) {
        if (isbn.length < 10 || isbn.length > 17) {
          res.status(400).json({
            erro: "Erro na validação do ISBN",
            mensagem: "ISBN deve ter entre 10 e 17 caracteres",
          });
          return;
        }

        // Verificar se novo ISBN já existe em outro livro
        if (isbn !== livroExistente.isbn) {
          const livroComIsbn = await this.livroRepository.obterPorIsbn(isbn);
          if (livroComIsbn) {
            res.status(409).json({
              erro: "ISBN duplicado",
              mensagem: "Um livro com este ISBN já está cadastrado",
            });
            return;
          }
        }
      }

      if (anoPublicacao !== undefined) {
        const anoAtual = new Date().getFullYear();
        if (anoPublicacao < 1000 || anoPublicacao > anoAtual) {
          res.status(400).json({
            erro: "Erro na validação do ano",
            mensagem: `Ano de publicação deve estar entre 1000 e ${anoAtual}`,
          });
          return;
        }
      }

      // Preparar dados para atualização (apenas campos fornecidos)
      const dadosAtualizacao: Partial<Livro> = {};
      if (titulo !== undefined) dadosAtualizacao.titulo = titulo;
      if (autor !== undefined) dadosAtualizacao.autor = autor;
      if (isbn !== undefined) dadosAtualizacao.isbn = isbn;
      if (anoPublicacao !== undefined) dadosAtualizacao.anoPublicacao = anoPublicacao;
      if (disponivel !== undefined) dadosAtualizacao.disponivel = disponivel;

      const livroAtualizado = await this.livroRepository.atualizar(Number(id), dadosAtualizacao);

      res.status(200).json({
        mensagem: "Livro atualizado com sucesso",
        livro: livroAtualizado,
      });
    } catch (erro) {
      console.error("Erro ao atualizar livro:", erro);
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: "Falha ao atualizar o livro",
      });
    }
  }

  /**
   * DELETE /api/livros/:id
   * Remove um livro do sistema
   */
  async remover(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar se o ID é um número
      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "ID deve ser um número positivo",
        });
        return;
      }

      // Verificar se o livro existe
      const livroExistente = await this.livroRepository.obterPorId(Number(id));
      if (!livroExistente) {
        res.status(404).json({
          erro: "Livro não encontrado",
          mensagem: `Nenhum livro com ID ${id}`,
        });
        return;
      }

      // Remover o livro
      await this.livroRepository.remover(Number(id));

      res.status(200).json({
        mensagem: "Livro removido com sucesso",
        livroRemovido: livroExistente,
      });
    } catch (erro) {
      console.error("Erro ao remover livro:", erro);
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: "Falha ao remover o livro",
      });
    }
  }

  /**
   * PATCH /api/livros/:id
   * Atualiza parcialmente as informações de um livro
   */
  async atualizarParcial(req: Request, res: Response): Promise<void> {
    // Reutiliza a mesma lógica de atualização
    await this.atualizar(req, res);
  }
}
