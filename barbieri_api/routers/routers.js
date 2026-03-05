const express = require('express'); 
const router = express.Router(); 
const {body} = require('express-validator');

//referência a controllers que serão utilizados nas rotas
const UsuariosController = require('../controllers/usuarios');
const NotasController = require('../controllers/notas');
const EscolasController = require('../controllers/escolas');
const AlunosController = require('../controllers/alunos');

//router usuarios
router.get('/usuarios', UsuariosController.listarUsuario);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.patch('/usuarios/:usuario_id', UsuariosController.editarUsuarios);
router.delete('/usuarios/:usuario_id', UsuariosController.apagarUsuarios);
router.post('/usuarios/login', UsuariosController.login);


//router notas
router.get('/notas/:aluno_id', NotasController.listarNotas);
router.post('/notas', NotasController.cadastrarNotas);
router.patch('/notas/:aluno_id', NotasController.editarNotas);
router.delete('/notas/:aluno_id', NotasController.apagarNotas);

//router escolas
router.get('/escolas', EscolasController.listarEscolas);
router.post('/escolas', EscolasController.cadastrarEscolas);
router.patch('/escolas/:id', EscolasController.editarEscolas);
router.delete('/escolas/:id', EscolasController.apagarEscolas);

//router alunos
router.get('/alunos', AlunosController.listarAlunos);
router.post('/alunos', AlunosController.cadastrarAlunos);
router.patch('/alunos/:id', AlunosController.editarAlunos);
router.delete('/alunos/:id', AlunosController.apagarAlunos);
router.get("/buscar", AlunosController.buscarAlunos);

//router funcionarios
const FuncionariosController = require('../controllers/funcionarios');
router.get('/funcionarios', FuncionariosController.listarFuncionarios);
router.post('/funcionarios', FuncionariosController.cadastrarFuncionario);
router.patch('/funcionarios/:id', FuncionariosController.editarFuncionario);
router.delete('/funcionarios/:id', FuncionariosController.apagarFuncionario);
router.post("/funcionarios/ponto", FuncionariosController.registrarPonto);



module.exports = router;