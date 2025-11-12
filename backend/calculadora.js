//Caracteristicas database
export const caracteristicasGeneticas = {
  corOlhos: {
    nome: "Cor dos olhos",
    genotipos: ["AA", "Aa", "aa"],
    fenotipo: {
      AA: "Olhos marrons",
      Aa: "Olhos marrons",
      aa: "Olhos azuis",
    },
    dominante: "A",
    fenotipoDominante: "Olhos marrons",
    fenotipoRecessivo: "Olhos azuis",
  },
};
//Criação da calculadora genetica
class CalculadoraGenetica {
  constructor() {
    this.caracteristicas = {};
  }
  defineCaracteristicas(name, data) {
    this.caracteristicas[name] = data;
  }

 analisaGenotipo(caracteristica, valor) {
  // Verifica se o valor é vazio ou desconhecido
  if (!valor || valor === "" || valor === "desconhecido" || valor === "Desconhecido") {
    return null;
  }

  const charInfo = this.caracteristicas[caracteristica];
  if (!charInfo) {
    console.warn(`Característica ${caracteristica} não encontrada`);
    return null;
  }

  // Se o valor já é um genótipo válido, retorna diretamente
  if (charInfo.genotipos.includes(valor)) {
    return valor;
  }

  // Se é um fenótipo, converte para genótipo
  try {
    const genotiposPossiveis = this.fenotipoParaGenotipos(caracteristica, valor);
    if (genotiposPossiveis.length > 0) {
      return genotiposPossiveis[0]; // Retorna o primeiro genótipo possível
    }
  } catch (error) {
    console.warn(`Erro ao converter fenótipo para genótipo: ${error.message}`);
  }

  return null;
}

  //Essa parte serve pra "traduzir" o fenotipo(caracteristica visivel) para um genotipo(genes)
fenotipoParaGenotipos(idChar, fenotipoInput) {
  const char = this.caracteristicas[idChar];
  if (!char) throw new Error(`Característica ${idChar} não encontrada`);
  if (!fenotipoInput) return [];

  const normalizar = (s) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const alvo = normalizar(fenotipoInput);
  const correspondentes = [];

  for (const [genotipo, fenotipo] of Object.entries(char.fenotipo)) {
    if (normalizar(fenotipo) === alvo) {
      correspondentes.push(genotipo);
    }
  }

  return correspondentes;
}
  // fucao pra achar os genotipos dos pais de forma definitiva
calculaGenotipoPais(caracteristica, fenotipo, avo1, avo2) {
  const charInfo = this.caracteristicas[caracteristica];
  if (!charInfo) throw new Error(`Característica ${caracteristica} não encontrada`);

  const dominante = charInfo.dominante;
  const recessivo = dominante.toLowerCase();

  const temAvos = !!(avo1 && avo2);

  // ✅ Caso tenha avós, tenta deduzir genótipo com base neles
  if (temAvos) {
    const av1Genotipo = this.analisaGenotipo(caracteristica, avo1);
    const av2Genotipo = this.analisaGenotipo(caracteristica, avo2);

    if (av1Genotipo && av2Genotipo) {
      return this.deduzirGenotipoPaisDosAvos(av1Genotipo, av2Genotipo);
    }
  }

  // ✅ Caso NÃO tenha avós, decide o genótipo com base no fenótipo
  const normalizar = (s) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  
  const alvo = normalizar(fenotipo);
  const fenotipoDominanteNormalizado = normalizar(charInfo.fenotipoDominante);
  const fenotipoRecessivoNormalizado = normalizar(charInfo.fenotipoRecessivo);

  if (alvo === fenotipoRecessivoNormalizado) {
    return recessivo + recessivo; // aa
  }
  if (alvo === fenotipoDominanteNormalizado) {
    return dominante + recessivo; // Aa (assume heterozigoto)
  }

  // ✅ fallback — se não reconhecer o fenótipo
  console.warn(`Fenótipo "${fenotipo}" não reconhecido para ${caracteristica}`);
  return null;
}

  // funcao pra deduzir os genotipos dos pais pelos avos caso tenha uma caracteristica dos avos selecionadas
  deduzirGenotipoPaisDosAvos(av1, av2) {
    const dom1 = av1[0];
    const dom2 = av2[0];
    const rec1 = av1[1];
    const rec2 = av2[1];

    const avo1Dominante = av1 === av1.toUpperCase();
    const avo2Dominante = av2 === av2.toUpperCase();

    const todosAlelos = [av1[0], av1[1], av2[0], av2[1]];

    if (
      av1[0] === av1[1] &&
      av2[0] === av2[1] &&
      av1[0] === av2[0].toUpperCase()
    ) {
      return av1[0] + av1[1];
    }
    if (av1 === av1.toLowerCase() && av2 === av2.toLowerCase()) {
      return av1;
    }

    const aleloSuperior = todosAlelos.find((a) => a === a.toUpperCase());
    const aleloInferior = todosAlelos.find((a) => a === a.toLowerCase());
    if (aleloSuperior && aleloInferior) {
      return aleloSuperior + aleloInferior;
    }
    return todosAlelos[0].toUpperCase() + todosAlelos[0].toLowerCase;
  }

  calculaQuadradoPunnet(pai1Genotipo, pai2Genotipo) {
    const alelos1 = pai1Genotipo.split("");
    const alelos2 = pai2Genotipo.split("");

    const resultados = [];

    for (let alelo1 of alelos1) {
      for (let alelo2 of alelos2) {
        const filhosGenotipo = [alelo1, alelo2].sort().join("");
        resultados.push(filhosGenotipo);
      }
    }
    return resultados;
  }

  calculaProbabilidadeFilhos(pai1Genotipo, pai2Genotipo) {
    const filhosGenotipo = this.calculaQuadradoPunnet(
      pai1Genotipo,
      pai2Genotipo
    );
    const total = filhosGenotipo.length;

    const counts = {};

    filhosGenotipo.forEach((genotipo) => {
      counts[genotipo] = (counts[genotipo] || 0) + 1;
    });

    const probabilidades = {};
    for (const [genotipo, count] of Object.entries(counts)) {
      probabilidades[genotipo] = (count / total) * 100;
    }
    return probabilidades;
  }
  genotipoParaFenotipo(caracteristica, genotipo) {
    const infoPessoa = this.caracteristicas[caracteristica];
    return infoPessoa.fenotipo[genotipo] || "desconhecido";
  }
  calculaProbabilidadeCaracteristica(caracteristica, dadosFamilia) {
    const {
      paiFenotipo,
      maeFenotipo,
      avo1Paterno,
      avo2Paterno,
      avo1Materno,
      avo2Materno,
    } = dadosFamilia; //avo1 == avô avo2 == avó (acento é complicado)

    const paiGenotipo = this.calculaGenotipoPais(
      caracteristica,
      paiFenotipo,
      avo1Paterno,
      avo2Materno
    );
    const maeGenotipo = this.calculaGenotipoPais(
      caracteristica,
      maeFenotipo,
      avo1Materno,
      avo2Materno
    );
    if (!paiGenotipo || !maeGenotipo) {
      throw new Error(
        `Não foi possivel determinar genotipos para ${caracteristica}`
      );
    }
    const genotipoProbabilidades = this.calculaProbabilidadeFilhos(
      paiGenotipo,
      maeGenotipo
    );

    const probabilidadesFenotipo = {};
    for (const [genotipo, probabilidade] of Object.entries(
      genotipoProbabilidades
    )) {
      const fenotipo = this.genotipoParaFenotipo(caracteristica, genotipo);
      probabilidadesFenotipo[fenotipo] =
        (probabilidadesFenotipo[fenotipo] || 0) + probabilidade;
    }
    return {
      paisGenotipos: {
        pai: paiGenotipo,
        mae: maeGenotipo,
      },
      genotipoProbabilidades,
      probabilidadesFenotipo,
    };
  }
}

export const calculadora = new CalculadoraGenetica();
Object.entries(caracteristicasGeneticas).forEach(([id, data]) => {
  calculadora.defineCaracteristicas(id, data);
});