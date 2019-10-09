/*
 * @author Eduardo dos Santos <eduardo.santos@edu.unipar.br>
 * API que conecta com o assistente virtual Dialoflow
 * usando o módulo actions on google e Mysql
 */

const {
  dialogflow,
  SignIn,
  SimpleResponse,
  BasicCard,
  Button,
  Image
} = require("actions-on-google");
const express = require("express");
const bodyParser = require("body-parser");
const model = require("./model");
const Helper = require("./helper/helper_server");
const app = dialogflow({ clientId: process.env.CLIENT_ID });

/*
 * Intenção de autenticação (no momento não está sendo usada)
 * Pois agora a autenticação já é disparada na intenção Default
 */
app.intent("ask_for_sign_in_confirmation", (conv, params, signin) => {
  if (signin.status !== "OK") return conv.ask(new SignIn());
  var email = conv.user.email;

  return conv.ask(`Obrigado por logar, seu email é '${email}`);
});

/*
 * Intenção usada para testar a conexão com o banco
 *
 * @class Helper
 * @param string email
 */
app.intent("pesquisar.alunos", (conv, params) => {
  let helper = new Helper();
  const email = conv.user.email;

  let resposta = model
    .pesquisar_aluno(email)
    .then(function(results) {
      return helper.pesquisar_aluno_results(results);
    })
    .catch(err =>
      setImmediate(() => {
        throw err;
      })
    );

  return resposta.then(function(result) {
    conv.ask(result);
  });
});

/*
 * Pesquisa a nota do aluno
 *
 * @class Helper
 * @param string materia
 * @param string email
 */
app.intent("notas.alunos", (conv, params) => {
  let helper = new Helper();
  const materia = params.materia;
  var bimestre = params.bimestre;
  const email = conv.user.email;
  bimestre = helper.getBimestre(bimestre);

  let resposta = model
    .notas_alunos(email, materia, bimestre)
    .then(function(results) {
      return helper.notas_alunos_results(results);
    })
    .catch(err =>
      setImmediate(() => {
        throw err;
      })
    );

  return resposta.then(function(result) {
    conv.ask(`${conv.user.profile.payload.name}, ${result}`);
  });
});

/*
 * Pesquisa as matérias que o aluno tem
 *
 * @class Helper
 * @param string email
 */
app.intent("lista.materia", (conv, params) => {
  let helper = new Helper();
  const email = conv.user.email;

  let resposta = model
    .lista_materia(email)
    .then(function(results) {
      return helper.lista_materia_results(results);
    })
    .catch(err =>
      setImmediate(() => {
        throw err;
      })
    );

  return resposta.then(function(result) {
    conv.ask(`${conv.user.profile.payload.name}, ${result}`);
  });
});

/*
 * Pesquisa qual matéria o aluno tem em um determinado dia
 *
 * @class Helper
 * @param string dia
 * @param string email
 */
app.intent("aulas.alunos", (conv, params) => {
  let helper = new Helper();
  const dia = helper.getDia(params.dia);
  const email = conv.user.email;

  let resposta = model
    .aulas_alunos(dia, email)
    .then(function(results) {
      return helper.aulas_alunos_results(results);
    })
    .catch(err =>
      setImmediate(() => {
        throw err;
      })
    );

  return resposta.then(function(result) {
    conv.ask(`${conv.user.profile.payload.name}, ${result}`);
  });
});

/*
 * Pesquisa quanto falta para o aluno passar
 *
 * @class Helper
 * @param string email
 * @param string materia
 */
app.intent("notas.restante", (conv, params) => {
  let helper = new Helper();
  const email = conv.user.email;
  const materia = params.materia;

  let resposta = model
    .notas_restante(materia, email)
    .then(function(results) {
      return helper.notas_restante_results(results);
    })
    .catch(err =>
      setImmediate(() => {
        throw err;
      })
    );

  return resposta.then(function(result) {
    conv.ask(`${conv.user.profile.payload.name}, ${result}`);
  });
});

/*
 * Informações do vestibular
 */
app.intent("vestibular", conv => {
  conv.ask("Achei algumas informações sobre o vestibular:");
  conv.ask(
    new BasicCard({
      text: `Vestibular Unipar 2k20 será realizado dia 29/09/2019. 
    Inscrições até o dia 13/09/2019`,

      subtitle: "Vestibular 2k20",
      title: "Unipar",
      buttons: new Button({
        title: "Inscreva-se já",
        url: "https://vestibular.unipar.br/"
      }),
      image: new Image({
        url: "https://www.unipar.br/assets/img/logo-unipar.png",
        alt: "Vestibular Unipar"
      }),
      display: "CROPPED"
    })
  );
});

const expressApp = express().use(bodyParser.json());
expressApp.post(process.env.POST, app);
expressApp.listen(process.env.PORT);
