import { Request, Response } from "express";
import { LivroRepository } from "../repositories/LivroRepository";
import { Livro } from "../entities/Livro";

export class LivroController {
  private livroRepository: LivroRepository;

  constructor() {
    this.livroRepository = new LivroRepository();
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      if (!titulo || !autor || !isbn || anoPublicacao === undefined) {
        res.status(400).json({
          erro: "Erro na validação dos dados",
          mensagem: "Campos obrigatórios: titulo, autor, isbn, anoPublicacao",
        });
        return;
      }

      if (isbn.length < 10 || isbn.length > 17) {
        res.status(400).json({
          erro: "Erro na validação do ISBN",
          mensagem: "ISBN deve ter entre 10 e 17 caracteres",
        });
        return;
      }

      const anoAtual = new Date().getFullYear();
      if (anoPublicacao < 1000 || anoPublicacao > anoAtual) {
        res.status(400).json({
          erro: "Erro na validação do ano",
          mensagem: `Ano de publicação deve estar entre 1000 e ${anoAtual}`,
        });
        return;
      }

      const livroExistente = await this.livroRepository.obterPorIsbn(isbn);
      if (livroExistente) {
        res.status(409).json({
          erro: "Livro já existe",
          mensagem: "Um livro com este ISBN já está cadastrado",
        });
        return;
      }

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
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
    }
  }

  async obterTodos(req: Request, res: Response): Promise<void> {
    try {
      const livros = await this.livroRepository.obterTodos();

      res.status(200).json({
        total: livros.length,
        livros: livros,
      });
    } catch (erro) {
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

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
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "ID deve ser um número positivo",
        });
        return;
      }

      const livroExistente = await this.livroRepository.obterPorId(Number(id));
      if (!livroExistente) {
        res.status(404).json({
          erro: "Livro não encontrado",
          mensagem: `Nenhum livro com ID ${id}`,
        });
        return;
      }

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
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
    }
  }

  async remover(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        res.status(400).json({
          erro: "Erro na validação",
          mensagem: "ID deve ser um número positivo",
        });
        return;
      }

      const livroExistente = await this.livroRepository.obterPorId(Number(id));
      if (!livroExistente) {
        res.status(404).json({
          erro: "Livro não encontrado",
          mensagem: `Nenhum livro com ID ${id}`,
        });
        return;
      }

      await this.livroRepository.remover(Number(id));

      res.status(200).json({
        mensagem: "Livro removido com sucesso",
        livroRemovido: livroExistente,
      });
    } catch (erro) {
      res.status(500).json({
        erro: "Erro interno do servidor",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      });
    }
  }

  async atualizarParcial(req: Request, res: Response): Promise<void> {
    await this.atualizar(req, res);
  }
}
