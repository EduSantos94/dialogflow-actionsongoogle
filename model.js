/*
 * @author Eduardo dos Santos <eduardo.santos@edu.unipar.br>
 * Model destinado para todas as interações com o banco
 */
const mysql = require('mysql')

module.exports = 
{
  pesquisar_aluno: async function(email)
  {
    return new Promise(function (resolve,reject)
    {
      var connection = mysql_connection()
      connection.connect()
    
      connection.query(pesquisar_aluno_query(email), function (error, results, fields) 
      {
        if (error) return reject(error)
        connection.end()
        resolve(results)
      })
    })
  },
  
  notas_alunos: async function(materia,email)
  {
    return new Promise(function (resolve, reject)
    {                  
      var connection = mysql_connection()
      connection.connect()
    
      connection.query(notas_aluno_query(materia,email), function (error, results, fields) 
      {
        if (error) return reject(error)
        connection.end()
        resolve(results)
      })
    })
  },
  
  lista_materia: async function(email)
  {
    return new Promise(function (resolve, reject)
    {
      var connection = mysql_connection()
      connection.connect()
      
      connection.query(lista_materia_query(email), function (error, results, fields) 
      {
        if (error) return reject(error)
        connection.end()
        resolve(results)
      })
    })
  },
  
  aulas_alunos: async function(dia, email)
  {
    return new Promise(function (resolve, reject)
    {
      var connection = mysql_connection()
      connection.connect()

      connection.query(aulas_alunos_query(dia, email), function (error, results, fields)
      {
        if (error) return reject(error)
        connection.end()
        resolve(results)
      })
    })
  }
}

function mysql_connection()
{
  return mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASS,
    database : process.env.MYSQL_DB
  })
}

function pesquisar_aluno_query(email)
{
  return `SELECT * FROM aluno WHERE email = "${email}"`
}

function notas_aluno_query(materia,email)
{
  return `SELECT n.nota as nota, m.nome as nome 
      FROM notas AS n 
      INNER JOIN materia AS m ON m.id_materia = n.id_materia
      INNER JOIN aluno AS a ON a.id_aluno = n.id_aluno
      WHERE a.email = "${email}"
      AND m.nome = "${materia}" ORDER BY bimestre DESC`
}

function lista_materia_query(email)
{
  return `SELECT m.nome 
      FROM materia as m 
      INNER JOIN curso_materia as cm ON cm.id_materia = m.id_materia 
      WHERE cm.id_curso = (SELECT a.id_curso FROM aluno as a WHERE a.email = "${email}")`
}

function aulas_alunos_query(dia, email)
{
  return `SELECT  m.nome as nome, a.horario as horario
      FROM aluno_aula as aa INNER JOIN aula as a ON a.id_aula = aa.id_aula
      INNER JOIN aluno AS al ON al.id_aluno = aa.id_aluno
      INNER JOIN materia AS m ON a.id_materia = m.id_materia
      WHERE a.dia = "${dia}"
      AND al.email = "${email}"`
}
