# API Web de Gerenciamento de Biblioteca

Uma API REST desenvolvida em **TypeScript**, **Node.js** e **Express.js** para gerenciar livros em um sistema de biblioteca. A aplicação implementa operações CRUD completas com arquitetura em camadas (Controller/Repository).

## 📋 Descrição

Este projeto foi desenvolvido como exercício individual para a disciplina **Eletiva 01 – Arquitetura e Desenvolvimento Back-end**, sob orientação do Prof. Danilo Farias.

A API segue os princípios de arquitetura em camadas, separando claramente as responsabilidades entre:
- **Controller**: Lógica de negócio e validações
- **Repository**: Acesso e persistência de dados

## 🚀 Características

- ✅ Operações CRUD completas para entidade Livro
- ✅ Validações robustas de negócio
- ✅ Arquitetura em camadas (Controller/Repository)
- ✅ ORM TypeORM para persistência
- ✅ Banco de dados SQLite (configurável)
- ✅ Endpoints RESTful seguindo padrões HTTP
- ✅ Tratamento de erros
- ✅ Documentação completa

## 📦 Entidade: Livro

```typescript
{
  id: number;                  // Identificador único (chave primária)
  titulo: string;              // Título do livro
  autor: string;               // Nome do autor principal
  isbn: string;                // Número ISBN (10-17 caracteres, único)
  anoPublicacao: number;       // Ano de publicação (1000 até ano atual)
  disponivel: boolean;         // Status de disponibilidade (padrão: true)
  criadoEm: Date;              // Data de criação (gerada automaticamente)
  atualizadoEm: Date;          // Data da última atualização (gerada automaticamente)
}
```

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework Web**: Express.js v4.18+
- **ORM**: TypeORM v0.3+
- **Banco de Dados**: SQLite
- **Ferramentas**: ts-node, tsc

## 📋 Requisitos

- Node.js v16 ou superior
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/BibliotecaAPI-Type.git
cd BibliotecaAPI-Type
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o TypeScript:
```bash
npm run build
```

## 🚀 Como Executar

### Modo Desenvolvimento (com ts-node)
```bash
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

O servidor iniciará em `http://localhost:3000`

## 📚 Endpoints da API

### Criar Livro
```http
POST /api/livros
Content-Type: application/json

{
  "titulo": "Clean Code",
  "autor": "Robert C. Martin",
  "isbn": "978-0132350884",
  "anoPublicacao": 2008,
  "disponivel": true
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Livro criado com sucesso",
  "livro": {
    "id": 1,
    "titulo": "Clean Code",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008,
    "disponivel": true,
    "criadoEm": "2025-12-04T10:30:00.000Z",
    "atualizadoEm": "2025-12-04T10:30:00.000Z"
  }
}
```

### Obter Todos os Livros
```http
GET /api/livros
```

**Resposta (200 OK):**
```json
{
  "total": 2,
  "livros": [
    {
      "id": 1,
      "titulo": "Clean Code",
      "autor": "Robert C. Martin",
      "isbn": "978-0132350884",
      "anoPublicacao": 2008,
      "disponivel": true,
      "criadoEm": "2025-12-04T10:30:00.000Z",
      "atualizadoEm": "2025-12-04T10:30:00.000Z"
    },
    {
      "id": 2,
      "titulo": "Design Patterns",
      "autor": "Gang of Four",
      "isbn": "978-0201633610",
      "anoPublicacao": 1994,
      "disponivel": false,
      "criadoEm": "2025-12-04T10:35:00.000Z",
      "atualizadoEm": "2025-12-04T10:35:00.000Z"
    }
  ]
}
```

### Obter Livro por ID
```http
GET /api/livros/1
```

**Resposta (200 OK):**
```json
{
  "livro": {
    "id": 1,
    "titulo": "Clean Code",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008,
    "disponivel": true,
    "criadoEm": "2025-12-04T10:30:00.000Z",
    "atualizadoEm": "2025-12-04T10:30:00.000Z"
  }
}
```

### Atualizar Livro (PUT - Completo)
```http
PUT /api/livros/1
Content-Type: application/json

{
  "titulo": "Clean Code - Edição Revisada",
  "autor": "Robert C. Martin",
  "isbn": "978-0132350884",
  "anoPublicacao": 2008,
  "disponivel": false
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Livro atualizado com sucesso",
  "livro": {
    "id": 1,
    "titulo": "Clean Code - Edição Revisada",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008,
    "disponivel": false,
    "criadoEm": "2025-12-04T10:30:00.000Z",
    "atualizadoEm": "2025-12-04T10:45:00.000Z"
  }
}
```

### Atualizar Livro (PATCH - Parcial)
```http
PATCH /api/livros/1
Content-Type: application/json

{
  "disponivel": true
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Livro atualizado com sucesso",
  "livro": {
    "id": 1,
    "titulo": "Clean Code - Edição Revisada",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008,
    "disponivel": true,
    "criadoEm": "2025-12-04T10:30:00.000Z",
    "atualizadoEm": "2025-12-04T10:50:00.000Z"
  }
}
```

### Remover Livro
```http
DELETE /api/livros/1
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Livro removido com sucesso",
  "livroRemovido": {
    "id": 1,
    "titulo": "Clean Code - Edição Revisada",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008,
    "disponivel": true,
    "criadoEm": "2025-12-04T10:30:00.000Z",
    "atualizadoEm": "2025-12-04T10:50:00.000Z"
  }
}
```

### Health Check
```http
GET /health
```

**Resposta (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-12-04T10:55:00.000Z",
  "message": "API de Biblioteca está funcionando"
}
```

## 🔍 Validações de Negócio Implementadas

### Ao Criar um Livro
- ✅ Todos os campos obrigatórios devem estar presentes
- ✅ ISBN deve ter entre 10 e 17 caracteres
- ✅ Ano de publicação deve estar entre 1000 e o ano atual
- ✅ ISBN deve ser único (não pode existir outro livro com o mesmo ISBN)
- ✅ Disponibilidade padrão: `true`

### Ao Atualizar um Livro
- ✅ ID deve ser um número positivo válido
- ✅ Livro deve existir no banco de dados
- ✅ Se ISBN for alterado, deve estar entre 10 e 17 caracteres
- ✅ Se ISBN for alterado, não pode ser duplicado
- ✅ Se ano for alterado, deve estar entre 1000 e o ano atual
- ✅ Campos opcionais podem ser omitidos na requisição

### Ao Remover um Livro
- ✅ ID deve ser um número positivo válido
- ✅ Livro deve existir no banco de dados

## 📁 Estrutura do Projeto

```
BibliotecaAPI-Type/
├── src/
│   ├── config/
│   │   └── database.ts           # Configuração TypeORM e DataSource
│   ├── entities/
│   │   └── Livro.ts              # Entidade Livro (modelo)
│   ├── repositories/
│   │   └── LivroRepository.ts     # Camada de acesso a dados
│   ├── controllers/
│   │   └── LivroController.ts     # Camada de lógica de negócio
│   ├── routes/
│   │   └── livroRoutes.ts         # Definição de rotas
│   └── index.ts                  # Arquivo principal da aplicação
├── dist/                         # Código compilado (gerado)
├── package.json                  # Dependências do projeto
├── tsconfig.json                 # Configuração TypeScript
├── .gitignore                    # Arquivo de exclusão Git
├── README.md                     # Este arquivo
└── LICENSE                       # Licença MIT
```

## 🏗️ Arquitetura

### Fluxo de Requisição

```
HTTP Request
    ↓
Express Router
    ↓
Controller (LivroController)
├─ Validação de entrada
├─ Lógica de negócio
└─ Decisões de negócio
    ↓
Repository (LivroRepository)
├─ Consultas TypeORM
└─ Operações CRUD
    ↓
Banco de Dados (SQLite)
    ↓
Response JSON
```

### Responsabilidades por Camada

**Controller (src/controllers/LivroController.ts)**
- Recebe requisições HTTP
- Valida dados de entrada
- Aplica regras de negócio
- Controla o fluxo de dados
- Retorna respostas apropriadas

**Repository (src/repositories/LivroRepository.ts)**
- Acesso exclusivo ao banco de dados
- Operações CRUD básicas
- Consultas específicas de dados
- Abstração do ORM

**Entity (src/entities/Livro.ts)**
- Define a estrutura do modelo
- Mapeamento objeto-relacional
- Decoradores TypeORM

## 📊 Códigos de Status HTTP Utilizados

| Código | Significado | Situação |
|--------|------------|----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Livro criado com sucesso |
| 400 | Bad Request | Dados inválidos ou mal formatados |
| 404 | Not Found | Livro ou rota não encontrada |
| 409 | Conflict | ISBN duplicado |
| 500 | Server Error | Erro interno do servidor |

## 🧪 Testando a API

### Com cURL

```bash
# Criar livro
curl -X POST http://localhost:3000/api/livros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Clean Code",
    "autor": "Robert C. Martin",
    "isbn": "978-0132350884",
    "anoPublicacao": 2008
  }'

# Obter todos os livros
curl http://localhost:3000/api/livros

# Obter livro por ID
curl http://localhost:3000/api/livros/1

# Atualizar livro
curl -X PUT http://localhost:3000/api/livros/1 \
  -H "Content-Type: application/json" \
  -d '{
    "disponivel": false
  }'

# Remover livro
curl -X DELETE http://localhost:3000/api/livros/1
```

### Com Postman/Insomnia
Importe os endpoints ou crie uma collection com as requisições listadas na seção [Endpoints da API](#endpoints-da-api).

## 🐛 Tratamento de Erros

A API retorna mensagens de erro estruturadas:

```json
{
  "erro": "Tipo do erro",
  "mensagem": "Descrição detalhada do erro"
}
```

**Exemplos:**

```json
// Dados inválidos
{
  "erro": "Erro na validação dos dados",
  "mensagem": "Campos obrigatórios: titulo, autor, isbn, anoPublicacao"
}

// Livro não encontrado
{
  "erro": "Livro não encontrado",
  "mensagem": "Nenhum livro com ID 999"
}

// ISBN duplicado
{
  "erro": "ISBN duplicado",
  "mensagem": "Um livro com este ISBN já está cadastrado"
}
```

## 📝 Princípios de Programação Aplicados

- ✅ **DRY (Don't Repeat Yourself)**: Código reutilizável e modular
- ✅ **SOLID**: Separação de responsabilidades entre camadas
- ✅ **OOP**: Uso de classes e orientação a objetos
- ✅ **Encapsulamento**: Dados protegidos com métodos públicos
- ✅ **Single Responsibility**: Cada classe tem uma responsabilidade
- ✅ **Open/Closed**: Código aberto para extensão, fechado para modificação

## 🔐 Melhorias Futuras

- [ ] Autenticação e autorização (JWT)
- [ ] Rate limiting
- [ ] Documentação com Swagger/OpenAPI
- [ ] Paginação e filtros avançados
- [ ] Testes unitários e de integração
- [ ] Logging estruturado
- [ ] Cache
- [ ] Validação com class-validator
- [ ] Tratamento de concorrência
- [ ] Migrations automáticas

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

- **Projeto**: Exercício Individual - API Web Biblioteca
- **Disciplina**: Eletiva 01 – Arquitetura e Desenvolvimento Back-end
- **Professor**: Danilo Farias
- **Data de Entrega**: 09/12/2025

---

**Desenvolvido com ❤️ em TypeScript**

