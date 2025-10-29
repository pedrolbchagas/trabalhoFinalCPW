//variaveis globais do codigo
var alelosMae = [];
var alelosPai = [];
var alelosAvo1M = [];
var alelosAvo2M = [];
var alelosAvo1P = [];
var alelosAvo2P = [];
var valido = true;
/*Função de validação do formlulário (Comentar para testes caso necessário )
function validaForm(event) {
  valido = true;
  const selects = document.querySelectorAll("select");

  selects.forEach((select) => {
    const erroId = "erro-" + select.id;
    const erroSpan = document.getElementById(erroId);

    if (select.value === "" || select.value === null) {
      erroSpan.textContent = "Opção não pode estar vazia";
      valido = false;
    } else {
      erroSpan.textContent = "";
    }
  });

  console.log(valido);

  if (!valido) {
    event.preventDefault();
  }

  return valido;
}*/

// Função para guardar os alelos vindos dos pais
function guardaAlelosPais() {
  if (!valido) return;

  var selectOlhosMae = document.getElementById("cor-olhos-M");
  var olhosSelecionadosMae = selectOlhosMae.value;
  var selectCabelosMae = document.getElementById("cor-cabelos-M");
  var cabeloSelecionadoMae = selectCabelosMae.value;
  var selectTipoCabMae = document.getElementById("tipo-cabelo-M");
  var tipoCabSelecionadoMae = selectTipoCabMae.value;
  alelosMae.push(
    olhosSelecionadosMae,
    cabeloSelecionadoMae,
    tipoCabSelecionadoMae
  );

  var selectOlhosPai = document.getElementById("cor-olhos-P");
  var olhosSelecionadosPai = selectOlhosPai.value;
  var selectCabelosPai = document.getElementById("cor-cabelos-P");
  var cabeloSelecionadoPai = selectCabelosPai.value;
  var selectTipoCabPai = document.getElementById("tipo-cabelo-P");
  var tipoCabSelecionadoPai = selectTipoCabPai.value;
  alelosPai.push(
    olhosSelecionadosPai,
    cabeloSelecionadoPai,
    tipoCabSelecionadoPai
  );

  const quadro = criarPunnett(olhosSelecionadosMae, olhosSelecionadosPai);
  const probabilidades = analisarPunnett(quadro);
  console.log(quadro);
  console.log(probabilidades);
}

function criarPunnett(genotipo1, genotipo2) {
  // 1. Gerar gametas
  const gametas1 = genotipo1.split("");
  const gametas2 = genotipo2.split("");

  // 2. Montar a matriz do quadro de Punnett
  const quadro = [];
  for (let i = 0; i < gametas1.length; i++) {
    quadro.push([]);
    for (let j = 0; j < gametas2.length; j++) {
      const alelo1 = gametas1[i];
      const alelo2 = gametas2[j];

      // Combinar alelos e organizar
      const genotipo = [alelo1, alelo2].sort().join("");
      quadro[i].push(genotipo);
    }
  }
  return quadro;
}

function analisarPunnett(quadro) {
  const genotiposContagem = {};
  const totalCelulas = quadro.flat().length;

  quadro.flat().forEach((genotipo) => {
    genotiposContagem[genotipo] = (genotiposContagem[genotipo] || 0) + 1;
  });

  const probabilidades = {};
  for (const genotipo in genotiposContagem) {
    probabilidades[genotipo] = `${genotiposContagem[genotipo]}/${totalCelulas}`;
  }
  return probabilidades;
}
