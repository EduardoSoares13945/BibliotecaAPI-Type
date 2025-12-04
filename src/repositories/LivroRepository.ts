import { Repository } from "typeorm";
import { Livro } from "../entities/Livro";
import { AppDataSource } from "../config/database";

export class LivroRepository {
  private repository: Repository<Livro>;

  constructor() {
    this.repository = AppDataSource.getRepository(Livro);
  }

  async criar(livro: Partial<Livro>): Promise<Livro> {
    const novoLivro = this.repository.create(livro);
    return await this.repository.save(novoLivro);
  }

  async obterTodos(): Promise<Livro[]> {
    return await this.repository.find();
  }

  async obterPorId(id: number): Promise<Livro | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async obterPorIsbn(isbn: string): Promise<Livro | null> {
    return await this.repository.findOne({ where: { isbn } });
  }

  async atualizar(id: number, dados: Partial<Livro>): Promise<Livro | null> {
    await this.repository.update(id, dados);
    return await this.obterPorId(id);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.repository.delete(id);
    return resultado.affected ? resultado.affected > 0 : false;
  }

  async existe(id: number): Promise<boolean> {
    const livro = await this.repository.findOne({ where: { id } });
    return !!livro;
  }

  async contar(): Promise<number> {
    return await this.repository.count();
  }

  async obterDisponiveis(): Promise<Livro[]> {
    return await this.repository.find({ where: { disponivel: true } });
  }
}
