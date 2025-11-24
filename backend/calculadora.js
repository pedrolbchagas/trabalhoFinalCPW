//Caracteristicas database - Versão Expandida
export const caracteristicasGeneticas = {
  corOlhos: {
    nome: "Cor dos olhos",
    genotipos: ["BB", "Bb", "bb", "GG", "Gg", "gg", "AA", "Aa", "aa"],
    fenotipo: {
      "BB": "Olhos castanhos escuros",
      "Bb": "Olhos castanhos",
      "GG": "Olhos verdes",
      "Gg": "Olhos verdes claros",
      "AA": "Olhos azuis escuros",
      "Aa": "Olhos azuis",
      "bb": "Olhos castanhos claros",
      "gg": "Olhos verdes azulados", 
      "aa": "Olhos azuis claros"
    },
    dominante: "B", // Castanho é mais dominante, depois verde, depois azul
    fenotipoDominante: "Olhos castanhos escuros",
    fenotipoRecessivo: "Olhos azuis claros",
    hierarquia: ["B", "G", "A"] // Ordem de dominância: Castanho > Verde > Azul
  },
  
  corCabelo: {
    nome: "Cor do cabelo",
    genotipos: ["PP", "Pp", "pp", "CC", "Cc", "cc", "LL", "Ll", "ll", "RR", "Rr", "rr"],
    fenotipo: {
      "PP": "Cabelo preto",
      "Pp": "Cabelo castanho escuro",
      "CC": "Cabelo castanho",
      "Cc": "Cabelo castanho claro",
      "LL": "Cabelo loiro escuro",
      "Ll": "Cabelo loiro",
      "RR": "Cabelo ruivo escuro",
      "Rr": "Cabelo ruivo",
      "pp": "Cabelo castanho muito escuro",
      "cc": "Cabelo castanho médio",
      "ll": "Cabelo loiro claro",
      "rr": "Cabelo ruivo claro"
    },
    dominante: "P", // Preto é mais dominante
    fenotipoDominante: "Cabelo preto",
    fenotipoRecessivo: "Cabelo ruivo claro",
    hierarquia: ["P", "C", "L", "R"] // Preto > Castanho > Loiro > Ruivo
  },
  
  tomPele: {
    nome: "Tom de pele",
    genotipos: ["EE", "Ee", "ee", "MM", "Mm", "mm", "CC", "Cc", "cc"],
    fenotipo: {
      "EE": "Pele muito escura",
      "Ee": "Pele escura",
      "MM": "Pele morena escura",
      "Mm": "Pele morena",
      "CC": "Pele clara",
      "Cc": "Pele muito clara",
      "ee": "Pele morena média",
      "mm": "Pele morena clara",
      "cc": "Pele extremamente clara"
    },
    dominante: "E",
    fenotipoDominante: "Pele muito escura",
    fenotipoRecessivo: "Pele extremamente clara",
    hierarquia: ["E", "M", "C"]
  },
  
  tipoCabelo: {
    nome: "Tipo de cabelo",
    genotipos: ["CC", "Cc", "cc", "OO", "Oo", "oo", "LL", "Ll", "ll"],
    fenotipo: {
      "CC": "Cabelo crespo",
      "Cc": "Cabelo cacheado",
      "OO": "Cabelo ondulado",
      "Oo": "Cabelo levemente ondulado",
      "LL": "Cabelo liso",
      "Ll": "Cabelo liso fino",
      "cc": "Cabelo muito crespo",
      "oo": "Cabelo ondulado solto",
      "ll": "Cabelo liso liso"
    },
    dominante: "C",
    fenotipoDominante: "Cabelo muito crespo",
    fenotipoRecessivo: "Cabelo liso liso",
    hierarquia: ["C", "O", "L"]
  }
};

// Função auxiliar para determinar fenótipo com base na hierarquia
function determinarFenotipoHierarquico(genotipo, caracteristica) {
  const charInfo = caracteristicasGeneticas[caracteristica];
  if (!charInfo || !charInfo.hierarquia) {
    return charInfo.fenotipo[genotipo] || "Desconhecido";
  }
  
  // Se o genótipo existe diretamente no mapeamento, usa ele
  if (charInfo.fenotipo[genotipo]) {
    return charInfo.fenotipo[genotipo];
  }
  
  // Para genótipos mistos, determina baseado na hierarquia
  const alelos = genotipo.split('');
  const aleloDominante = charInfo.hierarquia.find(dominante => 
    alelos.includes(dominante) || alelos.includes(dominante.toLowerCase())
  );
  
  if (aleloDominante) {
    // Procura um fenótipo que corresponda ao alelo dominante
    for (const [gt, fenotipo] of Object.entries(charInfo.fenotipo)) {
      if (gt.includes(aleloDominante)) {
        return fenotipo;
      }
    }
  }
  
  return "Desconhecido";
}

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
  
  // função pra achar os genotipos dos pais de forma definitiva
  calculaGenotipoPais(caracteristica, fenotipo, avo1, avo2) {
    const charInfo = this.caracteristicas[caracteristica];
    if (!charInfo) throw new Error(`Característica ${caracteristica} não encontrada`);

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
    
    // Tenta encontrar um fenótipo correspondente
    for (const [genotipo, fenotipoChar] of Object.entries(charInfo.fenotipo)) {
      if (normalizar(fenotipoChar) === alvo) {
        return genotipo;
      }
    }

    // ✅ fallback — se não reconhecer o fenótipo, usa lógica simplificada
    console.warn(`Fenótipo "${fenotipo}" não reconhecido para ${caracteristica}, usando fallback`);
    
    const fenotipoDominanteNormalizado = normalizar(charInfo.fenotipoDominante);
    const fenotipoRecessivoNormalizado = normalizar(charInfo.fenotipoRecessivo);

    if (alvo === fenotipoRecessivoNormalizado) {
      // Para recessivo, usa genótipo homozigoto recessivo
      const recessivo = charInfo.dominante.toLowerCase();
      return recessivo + recessivo;
    }
    
    // Para dominante, assume heterozigoto
    const dominante = charInfo.dominante;
    const recessivo = dominante.toLowerCase();
    return dominante + recessivo;
  }

  // funcao pra deduzir os genotipos dos pais pelos avos caso tenha uma caracteristica dos avos selecionadas
  deduzirGenotipoPaisDosAvos(av1, av2) {
    if (av1 === av2 && av1.length === 2) {
      return av1; // Ambos avós com mesmo genótipo
    }

    // Extrai alelos únicos
    const alelos = [...new Set([...av1.split(''), ...av2.split('')])];
    
    if (alelos.length === 1) {
      return alelos[0] + alelos[0]; // Homozigoto
    }
    
    // Para alelos diferentes, cria combinação heterozigota
    const aleloDominante = alelos.find(a => a === a.toUpperCase());
    const aleloRecessivo = alelos.find(a => a === a.toLowerCase());
    
    if (aleloDominante && aleloRecessivo) {
      return aleloDominante + aleloRecessivo;
    }
    
    // Fallback: usa o primeiro alelo em maiúsculo e minúsculo
    return alelos[0].toUpperCase() + alelos[0].toLowerCase();
  }

  calculaQuadradoPunnet(pai1Genotipo, pai2Genotipo) {
    const alelos1 = pai1Genotipo.split("");
    const alelos2 = pai2Genotipo.split("");

    const resultados = [];

    for (let alelo1 of alelos1) {
      for (let alelo2 of alelos2) {
        // Ordena os alelos para manter consistência (maiúscula primeiro)
        const combinacao = [alelo1, alelo2];
        combinacao.sort((a, b) => {
          if (a === a.toUpperCase() && b === b.toLowerCase()) return -1;
          if (a === a.toLowerCase() && b === b.toUpperCase()) return 1;
          return a.localeCompare(b);
        });
        const filhosGenotipo = combinacao.join("");
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
    return infoPessoa.fenotipo[genotipo] || determinarFenotipoHierarquico(genotipo, caracteristica);
  }
  
  calculaProbabilidadeCaracteristica(caracteristica, dadosFamilia) {
    const {
      paiFenotipo,
      maeFenotipo,
      avo1Paterno,
      avo2Paterno,
      avo1Materno,
      avo2Materno,
    } = dadosFamilia;

    const paiGenotipo = this.calculaGenotipoPais(
      caracteristica,
      paiFenotipo,
      avo1Paterno,
      avo2Paterno
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