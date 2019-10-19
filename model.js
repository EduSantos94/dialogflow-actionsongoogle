/*
 * @author Eduardo dos Santos <eduardo.santos@edu.unipar.br>
 * Model destinado para todas as interações com o banco
 */

const mysql = require("mysql");
const Helper = require("./helper/helper_model");
let helper = new Helper();

module.exports = {
  pesquisar_aluno: async function(email) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();

      connection.query(helper.pesquisar_aluno_query(), email, function(
        error,
        results,
        fields
      ) {
        if (error) return reject(error);
        connection.end();
        resolve(results);
      });
    });
  },

  notas_alunos: async function(email, materia, bimestre) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();

      connection.query(
        helper.notas_aluno_query(),
        [email, materia, bimestre],
        function(error, results, fields) {
          if (error) return reject(error);
          connection.end();
          resolve(results);
        }
      );
    });
  },

  lista_materia: async function(email) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();

      connection.query(helper.lista_materia_query(), email, function(
        error,
        results,
        fields
      ) {
        if (error) return reject(error);
        connection.end();
        resolve(results);
      });
    });
  },

  aulas_alunos: async function(dia, email) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();

      connection.query(helper.aulas_alunos_query(), [dia, email], function(
        error,
        results,
        fields
      ) {
        if (error) return reject(error);
        connection.end();
        resolve(results);
      });
    });
  },

  notas_restante: async function(materia, email) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();
      connection.query(
        helper.notas_restante_query(),
        [email, materia],
        function(error, results, fields) {
          if (error) return reject(error);
          connection.end();
          resolve(results);
        }
      );
    });
  },

  cadastrar_alunos: async function(email, id, cpf) {
    return new Promise(function(resolve, reject) {
      var connection = mysql_connection();
      connection.connect();
      connection.query(
        helper.cadastrar_alunos_query(),
        [email, id, cpf],
        function(error, results, fields) {
          if (error) return reject(error);
          connection.end();
          resolve(results);
        }
      );
    });
  }
};

function mysql_connection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
  });
}