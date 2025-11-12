import { caracteristicasGeneticas, calculadora } from "./calculadora.js";

function iniciaUI() {
  // Gera inputs para pais
  geraCaracteristicasInput("caracteristicas-pai", "pai");
  geraCaracteristicasInput("caracteristicas-mae", "mae");
  
  // Gera inputs para avós com IDs específicos
  geraCaracteristicasInput("caracteristicas-avo-paterno", "avoPaterno");
  geraCaracteristicasInput("caracteristicas-ava-paterna", "avaPaterna");
  geraCaracteristicasInput("caracteristicas-avo-materno", "avoMaterno");
  geraCaracteristicasInput("caracteristicas-ava-materna", "avaMaterna");

  const containerResultados = document.getElementById("resultados-container");
  if (containerResultados) {
    mostraTodosResultadosAcordeao();
  }
}

function geraCaracteristicasInput(containerId, prefixoPessoa) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} não encontrado`);
    return;
  }
  container.innerHTML = "";

  Object.entries(caracteristicasGeneticas).forEach(([id, char]) => {
    const grupoCaracteristica = document.createElement("div");
    grupoCaracteristica.className = "grupo-caracteristica";

    grupoCaracteristica.innerHTML = `
      <label for="${prefixoPessoa}-${id}">${char.nome}</label>
      <select id="${prefixoPessoa}-${id}">
        <option value="">Desconhecido</option>
        <option value="${char.fenotipoDominante}">${char.fenotipoDominante}</option>
        <option value="${char.fenotipoRecessivo}">${char.fenotipoRecessivo}</option>
      </select>
    `;
    container.appendChild(grupoCaracteristica);
  });
}
function geraAvosInputs(containerId, prefixoAvos) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  // avo1 === avô avo2 === avó malditos acentos
  const avos = ["avo1", "avo2"];

  avos.forEach((avo) => {
    const grupoAvos = document.createElement("div");
    grupoAvos.className = "grupoCaracteristica";
    let html = `<label class="grupoCaracteristica"> ${
      avo.charAt(0).toUpperCase() + avo.slice(1)
    }</label>`;

    Object.entries(caracteristicasGeneticas).forEach(([id, char]) => {
      html += `
            <select id="${prefixoAvos}-${avo}-${id}" style="margin-bottom: 8px;">
            <option value="">${char.nome} - Unknown</option>
            ${char.genotipos
              .map(
                (genotipo) =>
                  `<option value="${genotipo}">${char.fenotipo[genotipo]}</option>`
              )
              .join("")}
            </select>
            `;
    });
    grupoAvos.innerHTML = html;
    container.appendChild(grupoAvos);
  });
}

function calculaTodasAsProbabilidades() {
  try {
    const resultados = {};

    Object.keys(caracteristicasGeneticas).forEach((idChar) => {
      const familyData = getFamilyData(idChar);
      console.log(
        "🔬 Calculando:",
        idChar,
        "->",
        familyData,
        caracteristicasGeneticas[idChar]
      );
      const resultado = calculadora.calculaProbabilidadeCaracteristica(
        idChar,
        getFamilyData(idChar)
      );
      resultados[idChar] = resultado;
    });

    localStorage.setItem("resultadosGenetica", JSON.stringify(resultados));
    window.location.href = "resultados.html";
  } catch (error) {
    alert("Erro ao calcular probabilidades: " + error.message);
    console.error(error);
  }
}

window.calculaTodasAsProbabilidades = calculaTodasAsProbabilidades;

function getFamilyData(caracteristica) {
  return {
    paiFenotipo: document.getElementById(`pai-${caracteristica}`)?.value || '',
    maeFenotipo: document.getElementById(`mae-${caracteristica}`)?.value || '',
    avo1Paterno: document.getElementById(`avoPaterno-${caracteristica}`)?.value || null,
    avo2Paterno: document.getElementById(`avaPaterna-${caracteristica}`)?.value || null,
    avo1Materno: document.getElementById(`avoMaterno-${caracteristica}`)?.value || null,
    avo2Materno: document.getElementById(`avaMaterna-${caracteristica}`)?.value || null,
  };
}

function mostraTodosResultadosAcordeao() {
  const container = document.getElementById("resultados-container");
    if (!container) {
    console.error("Container 'resultados-container' não encontrado no DOM");
    return;
  }
  const resultados = window.resultadosCalculos;

  if (!resultados) {
    container.innerHTML =
      '<div class="loading">Sem resultados disponiveis. Por favor calcule antes</div>';
    return;
  }
  container.innerHTML = "";

  Object.entries(resultados).forEach(([idCaracteristica, resultado]) => {
    const infoPessoa = caracteristicasGeneticas[idCaracteristica];

    const card = document.createElement("div");
    card.className = "card-resultado-minimizado";

    const header = document.createElement("div");
    header.className = "header-resultado-colapsado";
    header.innerHTML = `
        <span class="titulo-resultado"> ${infoPessoa.nome}</span>
        <span class="botao-reduz-aumenta-icone">▼</span>
        `;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "body-resultado";
    body.style.display = "none";

    let html = `
        <div class="genotipo-pais">
            <div class="item-genotipo">
                <strong>Genotipo pai</strong><br>
                ${
                  resultado.paisGenotipos.pai
                } (${calculadora.genotipoParaFenotipo(
      idCaracteristica,
      resultado.paisGenotipos.pai
    )})
            </div>
            <div class="item-genotipo">
                <strong>Genotipo mae</strong><br>
                    ${
                      resultado.paisGenotipos.mae
                    } (${calculadora.genotipoParaFenotipo(
      idCaracteristica,
      resultado.paisGenotipos.mae
    )})
              </div>
            </div>
            <div class ="barras-probabilidade">
                <h3 style="margim: 20px 0 15px 0; color: #2c3e50;">Probabilidade filhos</h3>
        `;
    Object.entries(resultado.genotipoProbabilidades).forEach(
      ([fenotipo, probabilidade]) => {
        html += `
                <div class="item-probabilidade">
                <div class="label-probabilidade">
                <span>${fenotipo}</span>
                <span>${probabilidade.toFixed(1)}%</span>
                </div>
                <div class="container-barra-probabilidade">
                    <div class="barra-probabilidade" style="width: ${probabilidade}%">
                        ${
                          probabilidade >= 10
                            ? probabilidade.toFixed(1) + "%"
                            : ""
                        }
                        </div>
                        </div>
                        </div>
            `;
      }
    );

    html += `
            </div>
            <div class="detalhes-genotipo">
            <strong>Quebra do genotipo:</strong><br>
            ${Object.entries(resultado.genotipoProbabilidades)
              .map(([genotipo, prob]) => `${genotipo}: ${prob.toFixed(1)}%`)
              .join(", ")}
            </div>
        `;

    body.innerHTML = html;
    card.appendChild(body);

    header.addEventListener("click", () => {
      const aberto = body.style.display === "block";
      body.style.display = aberto ? "none" : "block";
      header.querySelector(".botao-reduz-aumenta-icone").textContent = aberto
        ? "▼"
        : "▲";
    });
    container.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  // Se estiver na página de resultados, tenta mostrar os resultados
  if (window.location.pathname.includes('resultados.html') || 
      document.getElementById('resultados-container')) {
    const savedResults = localStorage.getItem('resultadosGenetica');
    if (savedResults) {
      window.resultadosCalculos = JSON.parse(savedResults);
      mostraTodosResultadosAcordeao();
    }
  }
});

document.addEventListener("DOMContentLoaded", iniciaUI);
window.calculaTodasAsProbabilidades = calculaTodasAsProbabilidades;
window.mostraTodosResultadosAcordeao = mostraTodosResultadosAcordeao;