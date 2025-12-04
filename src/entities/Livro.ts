import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("livros")
export class Livro {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({ type: "varchar", length: 255 })
  autor!: string;

  @Column({ type: "varchar", length: 17, unique: true })
  isbn!: string;

  @Column({ type: "int" })
  anoPublicacao!: number;

  @Column({ type: "boolean", default: true })
  disponivel!: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  criadoEm?: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  atualizadoEm?: Date;
}
