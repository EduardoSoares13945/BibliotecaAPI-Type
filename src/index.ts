import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./config/database";
import livroRoutes from "./routes/livroRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/livros", livroRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "API de Biblioteca está funcionando",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    nome: "API de Gerenciamento de Biblioteca",
    versao: "1.0.0",
    descricao: "API REST para gerenciamento de livros",
    endpoints: {
      livros: "/api/livros",
      saude: "/health",
    },
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    erro: "Recurso não encontrado",
    caminho: req.path,
    metodo: req.method,
  });
});

async function iniciarServidor() {
  try {
    await AppDataSource.initialize();
    console.log("✓ Banco de dados inicializado com sucesso");

    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
      console.log(`✓ Para testar: http://localhost:${PORT}/health`);
      console.log(`✓ Endpoints de livros em: http://localhost:${PORT}/api/livros`);
    });
  } catch (erro) {
    console.log("✗ Erro ao iniciar o servidor:", erro);
    process.exit(1);
  }
}

iniciarServidor();

export default app;
