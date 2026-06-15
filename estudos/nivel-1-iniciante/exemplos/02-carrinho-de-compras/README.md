Aula 2 — Migrando do JavaScript "puro" para o Vue.js 3
1. A grande diferença de mentalidade
No seu index.html original você faz manipulação imperativa do DOM: você busca os elementos, escuta cliques e atualiza o texto "na mão".


total.innerText = dados.quantidade;          // você manda atualizar
precoTotal.innerText = dados.preco * dados.quantidade;


No Vue a abordagem é declarativa e reativa: você descreve como a tela deve ser a partir dos dados, e o Vue atualiza o DOM sozinho sempre que os dados mudam. Você nunca mais escreve querySelector nem innerText.

Regra de ouro do Vue: você muda o dado, não a tela. A tela é só um reflexo do dado.

2. As 3 peças que substituem seu código antigo
No seu código vanilla	No Vue	Para que serve
const dados = {...}	data()	Estado reativo. Mudou → tela atualiza
addEventListener('click', ...)	@click	Liga o clique direto no botão do HTML
dados.preco * dados.quantidade (recalculado à mão em atualizar())	computed	Valor derivado, recalculado automaticamente
innerText / querySelector	{{ }}	Imprime o dado na tela (interpolação)
3. Lendo a versão Vue por partes
a) O data() — o coração reativo

data() {
    return { produto: 'Roupa', preco: 49, quantidade: 0 };
}
É o equivalente ao seu const dados, mas reativo. Quando quantidade muda, tudo que usa quantidade na tela é redesenhado.

b) O template — HTML que "fala" com os dados

<h5>{{ produto }}</h5>                      <!-- imprime "Roupa" -->
<button @click="adicionar">+</button>       <!-- clique chama o método -->
<p>Total: R$ {{ precoTotal }}</p>           <!-- valor calculado -->
{{ }} → imprime um valor (substitui o innerText).
@click="adicionar" → atalho para addEventListener (substitui suas 2 últimas linhas).
c) computed — o pulo do gato 🐱
No vanilla você tinha que lembrar de chamar atualizar() em todo lugar. Se esquecesse, a tela ficava errada. No Vue:


computed: {
    precoTotal() {
        return this.preco * this.quantidade;
    }
}
O precoTotal se recalcula sozinho sempre que preco ou quantidade mudam. Sua função atualizar() simplesmente deixou de existir — o Vue faz isso por você.

d) methods — só a lógica de negócio

methods: {
    adicionar() { this.quantidade++; },
    remover()   { if (this.quantidade > 0) this.quantidade--; }
}
Repare: os métodos só mudam o dado. Não tocam na tela. Compare com seu incrementar() original, que precisava chamar atualizar(). Aqui não precisa. (Note também o this. — dentro do componente, o estado é acessado via this.)

4. Como rodar
É só abrir o arquivo no navegador (duplo clique ou Live Server do VS Code). Como usamos a CDN (vue.global.js), não precisa instalar nada — igual você já fez na aula-1.

5. Resumo: o que sumiu do código
Ao migrar, estas coisas desapareceram (e isso é bom!):

❌ document.querySelector(...) (5 linhas)
❌ addEventListener(...) (2 linhas)
❌ A função atualizar() inteira
❌ As linhas que setavam .innerText manualmente
Tudo isso vira reatividade automática.

🎯 Desafio pra fixar
Quer praticar? Tenta estes incrementos no arquivo Vue (do mais fácil ao mais difícil):

Fácil: desabilitar o botão - quando a quantidade for 0, usando :disabled="quantidade === 0".
Médio: adicionar um segundo produto e mostrar o total geral somando os dois (vai precisar de uma lista/array no data).
Avançado: formatar o preço como moeda brasileira (R$ 49,00) usando outra computed com Intl.NumberFormat.
Quer que eu resolva algum desses desafios junto com você, ou prefere que eu mostre a mesma tela usando a Composition API (o estilo mais moderno do Vue 3, com <script setup> e ref)?