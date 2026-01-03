const amount = document.getElementById("amount");

// Esse evento observa toda vez que entrar um conteúdo no input, e quando entrar, ele acontece esse evento:
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // Esta subistituindo o valor do input que for letras por nada "".
  amount.value = value; // Atualiza o valor do input para aceitar apenas números.
};
