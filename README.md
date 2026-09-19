# tools.eubyt.dev

> Plataforma de ferramentas e utilitários para desenvolvedores.

Baseado na identidade e design system do projeto **eubyt**: Next.js 16 (App Router), Tailwind CSS v4, tipografia JetBrains Mono, linhas guias pontilhadas (`grid-line-h`, `grid-line-v`), transições circulares de tema (Light / Dark / System) e internacionalização nativa (`en` e `pt`).

---

## 🛠️ Ferramentas Disponíveis

### 1. Hash & Criptografia

- **Gerador de Hash**: Cálculo simultâneo e em tempo real de **MD5**, **SHA-1**, **SHA-256**, **SHA-384** e **SHA-512**.
- **HMAC**: Assinatura HMAC com MD5, SHA-1, SHA-256, SHA-384 e SHA-512 utilizando chave secreta.
- **JWT Decoder**: Decodificação de tokens JWT com inspeção de Header, Payload e Assinatura, além de validação de expiração (`exp`) e emissão (`iat`).
- **JWT Generator**: Geração e assinatura de tokens JWT nos algoritmos HS256, HS384 e HS512.
- **AES Encrypt / Decrypt**: Criptografia e descriptografia AES-256 com senha e IV opcional.
- **Bcrypt Hash & Verify**: Gerador de hashes bcrypt com fator de custo configurável (4 a 14 rounds) e verificador contra senhas em texto puro.
- **Hash / Token Aleatório**: Geração de tokens criptográficos de alta entropia (Hex, Base64, Alfanumérico e API Keys com prefixo customizado).

### 2. Geradores

- **Gerador de UUID**: Suporte completo à RFC 9562 para **UUID v4** (aleatório), **UUID v7** (ordenado por tempo Unix Epoch) e **UUID v1** (timestamp), com geração em lote, alternância de hífens e maiúsculas.

### 3. Codificação & Conversão

- **Base64**: Codificação e decodificação de strings UTF-8 com suporte ao modo URL-safe (RFC 4648).
- **URL Encode**: Codificação e decodificação _percent-encoding_ para URLs, querystrings e URIs completas.
- **Hex ↔ Texto**: Conversão bidirecional entre texto plano e representação hexadecimal com delimitadores personalizáveis (espaço, 0x, dois pontos, contínuo).

### 4. JSON & Estruturas de Dados

- **Formatador JSON**: Embelezamento com indentação configurável (2 espaços, 4 espaços ou tabulação).
- **Minificador JSON**: Compressão compacta com indicador de bytes e porcentagem economizados.
- **Validador JSON**: Detecção de erros de sintaxe com indicação precisa de linha e coluna.
- **JSON Diff**: Comparador estrutural entre dois JSONs com identificação visual de adições, remoções e alterações.
- **JSON ↔ YAML**: Conversão bidirecional entre JSON e YAML.
- **JSON ↔ XML**: Conversão bidirecional entre JSON e XML com tag raiz personalizável.
- **JSON ↔ CSV**: Conversão bidirecional entre arrays de objetos JSON e CSV (delimitadores vírgula, ponto e vírgula ou tab).
- **JSON ↔ TOML**: Conversão bidirecional entre JSON e TOML.

---

## ⚡ Recursos

- **Atalho Rápido**: Pressione `/` na página inicial para focar diretamente na busca de ferramentas.
- **i18n**: Alternância de idioma entre Português (`/pt`) e Inglês (`/en`).
- **Tema**: Suporte a Claro, Escuro e Sistema com animação circular via View Transitions API.

---

## 🚀 Como Rodar Localmente

```bash
# Entrar no diretório
cd tools.eubyt.dev

# Instalar as dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Checagem de tipos TypeScript
npm run typecheck

# Compilar para produção
npm run build

# Iniciar servidor de produção
npm run start
```
