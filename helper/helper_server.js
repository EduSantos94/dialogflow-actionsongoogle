/*
 * @author Eduardo dos Santos <eduardo.santos@edu.unipar.br>
 * Helper destinado para realizar todas tarefas secundarias
 * das funções do server.js
 */

class Helper_Server {
  pesquisar_aluno_results(results) {
    if (typeof results[0] === "undefined") {
      return `Registro não encontrado, verifique por erros ortograficos`;
    } else {
      return results[0].nome;
    }
  }

  notas_alunos_results(results) {
    if (typeof results[0] === "undefined") {
      return `Registro não encontrado, verifique por erros ortograficos`;
    } else {
      return `sua nota em ${results[0].nome} foi ${results[0].nota}`;
    }
  }

  lista_materia_results(results) {
    if (typeof results[0] === "undefined") {
      return `registro não encontrado, verifique por erros ortograficos`;
    } else {
      return this.lista_materia_response(results);
    }
  }

  aulas_alunos_results(results) {
    if (typeof results[0] === "undefined") {
      return `registro não encontrado, verifique por erros ortograficos`;
    } else {
      return this.aulas_alunos_response(results);
    }
  }

  getDia(dia) {
    var d = new Date();
    var dia_string = new Array(
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sabado"
    );

    switch (dia) {
      case "hoje":
        dia = dia_string[d.getDay()];
        break;

      case "amanhã":
        dia = dia_string[d.getDay() + 1];
        break;

      case "ontem":
        dia = dia_string[d.getDay() - 1];
        break;

      case "depois de amanhã" || "depois da manhã":
        dia = dia_string[d.getDay() + 2];
        break;
    }

    return dia;
  }

  aulas_alunos_response(results) {
    if (results[0].nome && results[1].nome === "vaga")
      return `você não tem aula`;

    if (results[0].nome === "vaga" && results[1]) {
      return `primeira horario é vago, mas as ${results[1].horario} você tem ${results[1].nome}`;
    }

    if (results[1]) {
      var segundo_horario =
        " e logo em seguida você tem aula de " +
        results[1].nome +
        " as " +
        results[1].horario;
    } else {
      var segundo_horario = " e a segunda é vaga";
    }

    return `a primeira aula é ${results[0].nome} as ${results[0].horario} ${segundo_horario}`;
  }

  lista_materia_response(results) {
    var array_element = 0;
    var materias = [];

    do {
      materias.push(results[array_element].nome);
      array_element++;
    } while (results.length > array_element);

    return `suas matérias são: ${materias.join("\n")}`;
  }

  notas_restante_results(results) {
    const TOTAL_DE_BIMESTRES = 4;
    const RESTANTE_PARA_PASSAR = 24 - results[0].nota;

    if (24 - results[0].nota > 0) {
      var restante = `Faltando apenas ${RESTANTE_PARA_PASSAR} para passar`;
    } else {
      var restante = `Você já passou`;
    }

    var bimestre_restante = TOTAL_DE_BIMESTRES - results[0].bimestre;

    if (bimestre_restante > 0) {
      var minimo_por_bimestre = RESTANTE_PARA_PASSAR / bimestre_restante;
    }

    return `até o momento você tirou em ${results[0].nome} o total de ${results[0].nota}.\n 
            ${restante} ou ${minimo_por_bimestre} por bimestre`;
  }

  getBimestre(bimestre) {
    if (typeof bimestre === "string") {
      switch (bimestre.toLowerCase()) {
        case "primeiro":
          bimestre = 1;
          break;

        case "segundo":
          bimestre = 2;
          break;

        case "terceiro":
          bimestre = 3;
          break;

        case "quarto":
          bimestre = 4;
          break;
      }

      return bimestre;
    }
  }
}

module.exports = Helper_Server;
