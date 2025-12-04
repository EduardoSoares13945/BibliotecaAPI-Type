import { Repository } from "typeorm";
import { Livro } from "../entities/Livro";
import { AppDataSource } from "../config/database";

export class LivroRepository {
  private repository: Repository<Livro>;

  constructor() {
    this.repository = AppDataSource.getRepository(Livro);
  }

  /**
   * Cria um novo livro no banco de dados
   */
  async criar(livro: Partial<Livro>): Promise<Livro> {
    const novoLivro = this.repository.create(livro);
    return await this.repository.save(novoLivro);
  }

  /**
   * Retorna todos os livros
   */
  async obterTodos(): Promise<Livro[]> {
    return await this.repository.find();
  }

  /**
   * Obtém um livro pelo ID
   */
  async obterPorId(id: number): Promise<Livro | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Obtém um livro pelo ISBN
   */
  async obterPorIsbn(isbn: string): Promise<Livro | null> {
    return await this.repository.findOne({ where: { isbn } });
  }

  /**
   * Atualiza um livro existente
   */
  async atualizar(id: number, dados: Partial<Livro>): Promise<Livro | null> {
    await this.repository.update(id, dados);
    return await this.obterPorId(id);
  }

  /**
   * Remove um livro pelo ID
   */
  async remover(id: number): Promise<boolean> {
    const resultado = await this.repository.delete(id);
    return resultado.affected ? resultado.affected > 0 : false;
  }

  /**
   * Verifica se um livro com o ID existe
   */
  async existe(id: number): Promise<boolean> {
    const livro = await this.repository.findOne({ where: { id } });
    return !!livro;
  }

  /**
   * Conta o número total de livros
   */
  async contar(): Promise<number> {
    return await this.repository.count();
  }

  /**
   * Obtém livros disponíveis
   */
  async obterDisponiveis(): Promise<Livro[]> {
    return await this.repository.find({ where: { disponivel: true } });
  }
}
