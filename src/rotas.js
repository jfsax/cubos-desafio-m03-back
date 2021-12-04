const express = require('express');

const usuario = require('./controladores/usuario');
const login = require('./controladores/login');
const produtos = require('./controladores/produtos');

const filtroLogin = require('./filtros/filtroLogin');

const rotas = express();

rotas.post('/usuario', usuario.cadastrar);
rotas.post('/login', login);

rotas.use(filtroLogin);

rotas.get('/usuario', usuario.detalhar);
rotas.put('/usuario', usuario.atualizar);

rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;