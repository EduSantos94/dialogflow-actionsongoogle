class Helper_Model {
  pesquisar_aluno_query() {
    return `SELECT * FROM aluno WHERE email = ?`;
  }

  notas_aluno_query() {
    return `SELECT n.nota as nota, m.nome as nome, n.bimestre as bimestre 
      FROM notas AS n 
      INNER JOIN materia AS m ON m.id_materia = n.id_materia
      INNER JOIN aluno AS a ON a.id_aluno = n.id_aluno
      WHERE a.email = ?
      AND m.nome = ?
      AND n.bimestre = ?
      ORDER BY bimestre DESC`;
  }

  lista_materia_query() {
    return `SELECT m.nome 
      FROM materia as m 
      INNER JOIN curso_materia as cm ON cm.id_materia = m.id_materia 
      WHERE cm.id_curso = (SELECT a.id_curso FROM aluno as a WHERE a.email = ?)`;
  }

  aulas_alunos_query() {
    return `SELECT  m.nome as nome, a.horario as horario
      FROM aluno_aula as aa INNER JOIN aula as a ON a.id_aula = aa.id_aula
      INNER JOIN aluno AS al ON al.id_aluno = aa.id_aluno
      INNER JOIN materia AS m ON a.id_materia = m.id_materia
      WHERE a.dia = ?
      AND al.email = ?`;
  }

  notas_restante_query() {
    return `SELECT SUM(nota) as nota, m.nome as nome, count(bimestre) as bimestre
      FROM notas as n
      INNER JOIN materia as m ON n.id_materia = m.id_materia
      INNER JOIN aluno as a ON a.id_aluno = n.id_aluno
      WHERE a.email = ? 
      AND m.nome = ?`;
  }

  cadastrar_alunos_query() {
    return `UPDATE aluno as a
      SET a.email = ?
      WHERE a.id_aluno = ?
      AND a.cpf = ?`;
  }
}
module.exports = Helper_Model;