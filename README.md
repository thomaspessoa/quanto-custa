# Quanto Custa?

Front-end de uma plataforma que ajuda a estimar quanto custam decisões do dia a dia
(morar sozinho, ter um carro, viajar, etc.) e quanto sobra no fim do mês.

Feito com React + Vite. Todos os dados são fictícios/mockados — não há backend, login
nem banco de dados nesta versão.

Desenvolvido por Thomás.

## Rodar localmente

Precisa ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`).

## Subir pro GitHub

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeira versão do Quanto Custa?"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

(Crie o repositório vazio no GitHub antes, pelo site, e troque a URL acima pela dele.)

## Publicar na Vercel

1. Acesse [vercel.com](https://vercel.com) e entre com sua conta do GitHub.
2. Clique em **Add New → Project**.
3. Selecione o repositório que você acabou de subir.
4. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar nada nas
   configurações de build (`npm run build`, pasta de saída `dist`).
5. Clique em **Deploy** e aguarde. Em cerca de 1 minuto o site já estará no ar, com um
   link do tipo `nome-do-projeto.vercel.app`.

A partir daí, todo `git push` na branch `main` gera um novo deploy automaticamente.

## Estrutura

```
index.html        entrada da página, título, ícone e configuração de viewport
src/main.jsx       ponto de entrada do React
src/App.jsx        aplicação inteira (todas as páginas e componentes)
```
