import { caracteristicasGeneticas, calculadora } from "./calculadora.js";

function iniciaUI() {
  // Gera inputs para pais
  geraCaracteristicasInput("caracteristicas-pai", "pai");
  geraCaracteristicasInput("caracteristicas-mae", "mae");
  
  // Gera inputs para avós com sistema de acordeão
  geraAvosComAcordeao("secaoAvos", "caracteristicas-avo-paterno", "caracteristicas-ava-paterna", "Avós Paternos");
  geraAvosComAcordeao("secaoAvos", "caracteristicas-avo-materno", "caracteristicas-ava-materna", "Avós Maternos");

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

    let html = `
      <label for="${prefixoPessoa}-${id}">${char.nome} *</label>
      <select id="${prefixoPessoa}-${id}" class="campo-obrigatorio">
        <option value="">Selecione...</option>
    `;

    // Adiciona todas as opções de fenótipos reais
    const fenotiposUnicos = [...new Set(Object.values(char.fenotipo))];
    fenotiposUnicos.forEach(fenotipo => {
      html += `<option value="${fenotipo}">${fenotipo}</option>`;
    });

    html += `</select>
    <div class="mensagem-validacao" id="mensagem-${prefixoPessoa}-${id}"></div>`;
    
    grupoCaracteristica.innerHTML = html;
    container.appendChild(grupoCaracteristica);

    // Adiciona evento para limpar validação quando selecionar algo
    const select = document.getElementById(`${prefixoPessoa}-${id}`);
    select.addEventListener('change', function() {
      if (this.value) {
        this.classList.remove('campo-obrigatorio-vazio');
        const mensagem = document.getElementById(`mensagem-${prefixoPessoa}-${id}`);
        mensagem.textContent = '';
        mensagem.classList.remove('mostrar');
      }
    });
  });
}

function geraAvosComAcordeao(secaoClass, containerAvoId, containerAvaId, titulo) {
  // Encontra todas as seções de avós
  const secoesAvos = document.querySelectorAll(`.${secaoClass}`);
  
  secoesAvos.forEach(secao => {
    const avosTitle = secao.querySelector('.avos-title');
    if (avosTitle && avosTitle.textContent.includes(titulo)) {
      // Cria a estrutura do acordeão
      const avosContainer = secao.querySelector('.avos-container');
      const avoCard1 = secao.querySelector('.avo-card:nth-child(1)');
      const avoCard2 = secao.querySelector('.avo-card:nth-child(2)');
      
      if (avosTitle && avosContainer) {
        // Transforma o título em header clicável
        avosTitle.classList.add('acordeao-avos-header');
        avosTitle.innerHTML = `
          <span class="acordeao-avos-titulo">${titulo} (Opcional)</span>
          <span class="acordeao-avos-icone">▼</span>
        `;
        
        // Adiciona a classe do acordeão ao container principal
        secao.classList.add('acordeao-avos');
        
        // Esconde inicialmente o conteúdo dos avós
        avosContainer.style.display = 'none';
        avosContainer.classList.add('acordeao-avos-body');
        
        // Adiciona evento de clique no header
        avosTitle.addEventListener('click', () => {
          const isExpanded = avosContainer.style.display === 'grid';
          avosContainer.style.display = isExpanded ? 'none' : 'grid';
          const icone = avosTitle.querySelector('.acordeao-avos-icone');
          icone.textContent = isExpanded ? '▼' : '▲';
          secao.classList.toggle('expanded', !isExpanded);
        });
      }
    }
  });

  // Gera os inputs para os avós (sem required)
  geraCaracteristicasAvosInput(containerAvoId, containerAvoId.replace('caracteristicas-', ''));
  geraCaracteristicasAvosInput(containerAvaId, containerAvaId.replace('caracteristicas-', ''));
}

function geraCaracteristicasAvosInput(containerId, prefixoPessoa) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} não encontrado`);
    return;
  }
  container.innerHTML = "";

  Object.entries(caracteristicasGeneticas).forEach(([id, char]) => {
    const grupoCaracteristica = document.createElement("div");
    grupoCaracteristica.className = "grupo-caracteristica";

    let html = `
      <label for="${prefixoPessoa}-${id}">${char.nome}</label>
      <select id="${prefixoPessoa}-${id}">
        <option value="">Desconhecido</option>
    `;

    // Adiciona todas as opções de fenótipos reais
    const fenotiposUnicos = [...new Set(Object.values(char.fenotipo))];
    fenotiposUnicos.forEach(fenotipo => {
      html += `<option value="${fenotipo}">${fenotipo}</option>`;
    });

    html += `</select>`;
    grupoCaracteristica.innerHTML = html;
    container.appendChild(grupoCaracteristica);
  });
}

function validaCamposPais() {
  const caracteristicas = Object.keys(caracteristicasGeneticas);
  let camposInvalidos = [];
  let isValid = true;
  
  // Limpa todas as mensagens anteriores
  document.querySelectorAll('.mensagem-validacao').forEach(msg => {
    msg.textContent = '';
    msg.classList.remove('mostrar');
  });
  
  // Valida campos do pai
  caracteristicas.forEach(id => {
    const selectPai = document.getElementById(`pai-${id}`);
    const mensagemPai = document.getElementById(`mensagem-pai-${id}`);
    
    if (!selectPai || !selectPai.value) {
      camposInvalidos.push(`Pai - ${caracteristicasGeneticas[id].nome}`);
      // Adiciona classe de erro e mostra mensagem
      selectPai.classList.add('campo-obrigatorio-vazio');
      mensagemPai.textContent = 'Característica obrigatória';
      mensagemPai.classList.add('mostrar');
      isValid = false;
    } else {
      selectPai.classList.remove('campo-obrigatorio-vazio');
      mensagemPai.textContent = '';
      mensagemPai.classList.remove('mostrar');
    }
  });
  
  // Valida campos da mãe
  caracteristicas.forEach(id => {
    const selectMae = document.getElementById(`mae-${id}`);
    const mensagemMae = document.getElementById(`mensagem-mae-${id}`);
    
    if (!selectMae || !selectMae.value) {
      camposInvalidos.push(`Mãe - ${caracteristicasGeneticas[id].nome}`);
      // Adiciona classe de erro e mostra mensagem
      selectMae.classList.add('campo-obrigatorio-vazio');
      mensagemMae.textContent = 'Característica obrigatória';
      mensagemMae.classList.add('mostrar');
      isValid = false;
    } else {
      selectMae.classList.remove('campo-obrigatorio-vazio');
      mensagemMae.textContent = '';
      mensagemMae.classList.remove('mostrar');
    }
  });
  
  return { isValid, camposInvalidos };
}

function calculaTodasAsProbabilidades() {
  try {
    // Valida campos obrigatórios dos pais
    const { isValid, camposInvalidos } = validaCamposPais();
    
    if (!isValid) {
      const mensagem = `Por favor, preencha todos os campos obrigatórios dos pais:\n\n${camposInvalidos.join('\n')}`;
      
      // Rola a página para o primeiro campo inválido
      const primeiroCampoInvalido = document.querySelector('.campo-obrigatorio-vazio');
      if (primeiroCampoInvalido) {
        primeiroCampoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primeiroCampoInvalido.focus();
      }
      
      return;
    }
    
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
        familyData
      );
      resultados[idChar] = resultado;
    });

    localStorage.setItem("resultadosGenetica", JSON.stringify(resultados));
    window.location.href = "resultados.html";
  } catch (error) {
    console.error(error);
  }
}

window.calculaTodasAsProbabilidades = calculaTodasAsProbabilidades;

function getFamilyData(caracteristica) {
  return {
    paiFenotipo: document.getElementById(`pai-${caracteristica}`)?.value || '',
    maeFenotipo: document.getElementById(`mae-${caracteristica}`)?.value || '',
    avo1Paterno: document.getElementById(`avo-paterno-${caracteristica}`)?.value || null,
    avo2Paterno: document.getElementById(`ava-paterna-${caracteristica}`)?.value || null,
    avo1Materno: document.getElementById(`avo-materno-${caracteristica}`)?.value || null,
    avo2Materno: document.getElementById(`ava-materna-${caracteristica}`)?.value || null,
  };
}

function mostraTodosResultadosAcordeao() {
  const container = document.getElementById("resultados-container");
  if (!container) {
    console.error("Container 'resultados-container' não encontrado no DOM");
    return;
  }
  
  const resultadosSalvos = localStorage.getItem("resultadosGenetica");
  const resultados = resultadosSalvos ? JSON.parse(resultadosSalvos) : null;

  if (!resultados || Object.keys(resultados).length === 0) {
    container.innerHTML =
      '<div class="loading">Sem resultados disponíveis. Por favor calcule primeiro.</div>';
    return;
  }
  
  container.innerHTML = "";

  Object.entries(resultados).forEach(([idCaracteristica, resultado]) => {
    const infoPessoa = caracteristicasGeneticas[idCaracteristica];
    if (!infoPessoa) {
      console.warn(`Característica ${idCaracteristica} não encontrada`);
      return;
    }

    const card = document.createElement("div");
    card.className = "card-resultado-minimizado";

    const header = document.createElement("div");
    header.className = "header-resultado-colapsado";
    header.innerHTML = `
        <span class="titulo-resultado">${infoPessoa.nome}</span>
        <span class="botao-reduz-aumenta-icone">▼</span>
        `;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "body-resultado";
    body.style.display = "none";

    let html = `
        <div class="genotipo-pais">
            <div class="item-genotipo">
                <strong>Genótipo pai</strong><br>
                ${resultado.paisGenotipos.pai} (${calculadora.genotipoParaFenotipo(
      idCaracteristica,
      resultado.paisGenotipos.pai
    )})
            </div>
            <div class="item-genotipo">
                <strong>Genótipo mãe</strong><br>
                ${resultado.paisGenotipos.mae} (${calculadora.genotipoParaFenotipo(
      idCaracteristica,
      resultado.paisGenotipos.mae
    )})
            </div>
        </div>
        <div class="barras-probabilidade">
            <h3 style="margin: 20px 0 15px 0; color: #2c3e50;">Probabilidade filhos</h3>
    `;
    
    // Agrupa probabilidades por fenótipo
    const probabilidadesAgrupadas = {};
    Object.entries(resultado.probabilidadesFenotipo || {}).forEach(([fenotipo, probabilidade]) => {
      probabilidadesAgrupadas[fenotipo] = (probabilidadesAgrupadas[fenotipo] || 0) + probabilidade;
    });

    Object.entries(probabilidadesAgrupadas).forEach(([fenotipo, probabilidade]) => {
      html += `
            <div class="item-probabilidade">
                <div class="label-probabilidade">
                    <span>${fenotipo}</span>
                    <span>${probabilidade.toFixed(1)}%</span>
                </div>
                <div class="container-barra-probabilidade">
                    <div class="barra-probabilidade" style="width: ${probabilidade}%">
                        ${probabilidade >= 10 ? probabilidade.toFixed(1) + "%" : ""}
                    </div>
                </div>
            </div>
      `;
    });

    html += `
        </div>
        <div class="detalhes-genotipo">
            <strong>Quebra do genótipo:</strong><br>
            ${Object.entries(resultado.genotipoProbabilidades || {})
              .map(([genotipo, prob]) => `${genotipo}: ${prob.toFixed(1)}%`)
              .join(", ")}
        </div>
    `;

    body.innerHTML = html;
    card.appendChild(body);

    header.addEventListener("click", () => {
      const aberto = body.style.display === "block";
      body.style.display = aberto ? "none" : "block";
      header.querySelector(".botao-reduz-aumenta-icone").textContent = aberto ? "▼" : "▲";
      card.className = aberto ? "card-resultado-expandido" : "card-resultado-minimizado";
    });
    
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Se estiver na página de resultados, tenta mostrar os resultados
  if (window.location.pathname.includes('resultados.html') || 
      document.getElementById('resultados-container')) {
    mostraTodosResultadosAcordeao();
  } else {
    // Se estiver na página principal, inicializa a UI
    iniciaUI();
  }
});

window.calculaTodasAsProbabilidades = calculaTodasAsProbabilidades;
window.mostraTodosResultadosAcordeao = mostraTodosResultadosAcordeao;