# 🔮 MTG Explorer: Estudo de CI/CD & AWS CloudFront

Este projeto é uma aplicação React desenvolvida com **Vite** e **TypeScript** que consome a [API do Magic: The Gathering](https://docs.magicthegathering.io/) para listar e buscar cartas.

**O objetivo principal deste repositório é o estudo prático de pipelines de CI/CD e deployment automatizado na AWS utilizando S3 e CloudFront.**

---

## 🛠️ Tecnologias e Ferramentas

### Frontend

- **React 19 + Vite**: Para uma interface rápida e reativa.
- **TypeScript**: Garantia de tipos e melhor experiência de desenvolvimento.
- **Vitest**: Suite de testes moderna.

### DevOps & Cloud (Foco do Projeto)

- **GitHub Actions**: Responsável pela Integração Contínua (CI).
- **AWS CodeBuild**: Responsável pela Entrega/Implantação Contínua (CD).
- **Amazon S3**: Hospedagem dos arquivos estáticos da aplicação.
- **Amazon CloudFront**: CDN para distribuição global com baixa latência e HTTPS.

---

## ⚙️ Arquitetura da Pipeline

A pipeline foi desenhada para separar as responsabilidades de validação e implantação:

### 1. CI (Integração Contínua) - **GitHub Actions**

Toda vez que um código é enviado para a branch `main` ou um Pull Request é aberto, o GitHub Actions executa:

- 🧹 **Linting**: Validação de padrões de código com ESLint.
- 🧪 **Typecheck**: Verificação de tipos com TypeScript.
- 🃏 **Unit Tests**: Execução de testes automatizados com Vitest.

### 2. CD (Implantação Contínua) - **AWS CodeBuild**

Após a validação no GitHub Actions (ou disparado via webhook), o AWS CodeBuild entra em cena para:

- 📦 **Build**: Compilação e minificação do código para produção.
- 🚀 **Deploy**: Sincronização automática dos arquivos gerados com o bucket **S3**.
- 🧹 **Invalidation**: Invalidação do cache do **CloudFront** para garantir que a versão mais nova esteja disponível instantaneamente para os usuários.

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/mtg-explorer.git
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Execute os testes:**
   ```bash
   npm run test
   ```

---

## 🌐 Aplicação em Produção

A aplicação é distribuída globalmente via AWS CloudFront e pode ser acessada em:
👉 [https://d2luqe2mp1p7xn.cloudfront.net/](https://d2luqe2mp1p7xn.cloudfront.net/)
