import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./config/database";
import livroRoutes from "./routes/livroRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/livros", livroRoutes);

// Rota de health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "API de Biblioteca está funcionando",
  });
});

// Rota raiz
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

// Tratamento de rotas não encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    erro: "Recurso não encontrado",
    caminho: req.path,
    metodo: req.method,
  });
});

// Inicializar banco de dados e servidor
async function iniciarServidor() {
  try {
    // Inicializar conexão com o banco de dados
    await AppDataSource.initialize();
    console.log("✓ Banco de dados inicializado com sucesso");

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
      console.log(`✓ Para testar: http://localhost:${PORT}/health`);
      console.log(`✓ Endpoints de livros em: http://localhost:${PORT}/api/livros`);
    });
  } catch (erro) {
    console.error("✗ Erro ao iniciar o servidor:", erro);
    process.exit(1);
  }
}

iniciarServidor();

export default app;
