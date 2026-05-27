# Nível 0 — Desafios

> Cada desafio deve virar um arquivo `.html` único (HTML + CSS + JS no mesmo arquivo é OK aqui).

## Desafio 0.1 — Cartão de perfil
Crie uma página com um cartão centralizado contendo: foto (placeholder), nome, cargo e botão "Seguir". Use Flexbox.

**Critérios:**
- Layout responsivo (mobile + desktop).
- Botão muda cor no `:hover`.
- Sem frameworks.

## Desafio 0.2 — Calculadora de IMC
Formulário com peso e altura. Ao submeter, calcula o IMC e mostra a classificação (abaixo do peso, normal, sobrepeso, obesidade).

**Critérios:**
- Validar campos (sem números negativos, sem vazio).
- Mostrar resultado sem recarregar a página (`event.preventDefault()`).
- Cor do resultado muda conforme a classificação.

## Desafio 0.3 — Lista de tarefas (JS puro)
Página com input + botão "Adicionar". Mostra lista de tarefas com botão "Remover" em cada item.

**Critérios:**
- Adicionar com Enter ou clique.
- Marcar tarefa como concluída ao clicar nela (line-through via CSS).
- Persistir no `localStorage` (recarregar a página mantém a lista).

## Desafio 0.4 — Consumindo API
Crie uma página que consome a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) e exibe a lista de usuários em cards.

**Critérios:**
- Usar `fetch` com `async/await`.
- Mostrar mensagem de "Carregando..." enquanto espera.
- Tratar erro com `try/catch` e mostrar mensagem amigável.
- Campo de busca filtra usuários pelo nome em tempo real.

## Desafio 0.5 — Git workflow
Crie um repositório local, faça 3 commits, crie uma branch `feature/extra`, faça mais 2 commits nela, e mescle de volta na `main`.

**Critérios:**
- `git log --oneline --graph` mostra a divergência e o merge.
- `.gitignore` exclui `node_modules/` mesmo sem haver `node_modules`.
- README explica o que o repositório faz.

## Desafio 0.6 — Setup Node
Inicialize um projeto Node, instale **axios** como dependência e **prettier** como devDependency. Crie um script `start` que roda um arquivo `index.js` que faz uma requisição com axios.

**Critérios:**
- `npm start` funciona.
- `package.json` tem o script correto.
- `node_modules` está no `.gitignore`.
