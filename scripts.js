// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");

// Esse evento observa toda vez que entrar um conteúdo no input, e quando entrar, ele acontece esse evento:
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // Esta subistituindo o valor do input que for letras por nada "".

  // Transformar o valor em centavos (numero)
  value = Number(value) / 100;

  amount.value = formatCurrencyUSD(value); // Atualiza o valor do input para aceitar apenas números.
};

function formatCurrencyUSD(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault(); // Não recarrega automáticamente a página

  // Cria um objeto com os detalhes da despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Chama a funcao que vai adicionar o item na lista
  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item(li) na lista(ul)
    const expenseItem = document.createElement("li");
    expenseItem.className = "expense";

    // Cria o ícone
    const expenseIcon = document.createElement("img");

    // Ta pegando as imagens de acordo com a propriedade category_id, conforme muda a categoria, a imagem muda
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense; // textContent adiciona um conteúdo ao texto

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona o name e category dentro da div de info
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despensa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o ícone de remover da depensa
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona os itens na lista
    // Append adiciona ao final da lista
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adicona os itens na lista(ul)
    expenseList.append(expenseItem);

    // Atualiza o numero total de itens de despensa na tela
    updateTotals();

    // Limpa o campo de input apos usado
    formClear();
  } catch (error) {
    alert("Não foi possível adicionar o item na lista de despesas.");
    console.log(error);
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children;

    // Atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variável para incrementar o total
    let total = 0;

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remove caracteres não numéricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // // Converte o valor para float
      value = parseFloat(value);

      // Verifica se é um número válido
      if (isNaN(value)) {
        return alert(
          "It was not possible to calculate the total. The value does not appear to be a number."
        );
      }

      // Incrementa o valor total
      total += Number(value);
    }

    // Cria a span pra adicionar o R$ formatado
    const symbolUSD = document.createElement("small");
    symbolUSD.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyUSD(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo do elemento
    expensesTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor total formatado
    expensesTotal.append(symbolUSD, total);
  } catch (error) {
    alert("It was not possible to update the totals.");
    console.log(error);
  }
}

expenseList.addEventListener("click", function (event) {
  // Verifica se o item clicado é o ícone de remover
  if (event.target.classList.contains("remove-icon")) {
    // Obtém a li pai mais próxima do elemento clicado
    const item = event.target.closest(".expense");
    item.remove();
  }

  updateTotals();
});

// Limpa o input apos usar
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
