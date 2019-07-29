const {
  dialogflow,
  SignIn,
  SimpleResponse
} = require('actions-on-google')
const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = dialogflow({ clientId : process.env.CLIENT_ID })

/*
* Intent using Google Assistant Sign In
*/
app.intent('ask_for_sign_in_confirmation',(conv, params, signin) => {
  
  if (signin.status !== 'OK') return conv.ask(new SignIn());
  var email = conv.user.email;
  
  return conv.ask(`Obrigado por logar, seu email é '${email}`);
});

/*
* Integration with mysql to return user's name
* by using accont linking email
*/
app.intent('pesquisar.alunos', (conv, params) => {
  
  const email = conv.user.email
  
  let resposta = pesquisar_aluno(email).then(function(results) {
    
    if (typeof results[0] === 'undefined') {
      return `Registro não encontrado, verifique por erros ortograficos`
    } else {
      return results[0].nome
    }
  }).catch((err) => setImmediate(() => { throw err; }))
  
  return resposta.then(function(result){
    conv.ask(result)
  })
})

const expressApp = express().use(bodyParser.json())
expressApp.post('process.env.URL', app)
expressApp.listen(process.env.PORT)

async function pesquisar_aluno(email)
{
  return new Promise(function (resolve,reject)
  {
    var connection = mysql_connection()
    connection.connect()
    
    var query = `SELECT * FROM aluno WHERE email = "${email}"`
    
    connection.query(query, function (error, results, fields) 
    {
      if (error) return reject(error)
      resolve(results)
    })
  })
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
