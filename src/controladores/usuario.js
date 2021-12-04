const conexao = require('../conexao');
const bcrypt = require('bcrypt');

async function cadastrar(req, res) {
    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
    }

    if (!nome_loja) {
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' });
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(404).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryInserirUsuario = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const cadastroDeUsuario = await conexao.query(queryInserirUsuario, [nome, nome_loja, email, senhaCriptografada]);

        if (cadastroDeUsuario.rowCount === 0) {
            return res.status(500).json({ mensagem: 'Não foi possível cadastrar o usuário.' });
        }

        return res.status(201).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
};

async function detalhar(req, res) {
    const { usuario } = req;

    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    };
};

async function atualizar(req, res) {
    const { id } = req.usuario;

    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
    }

    if (!nome_loja) {
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' });
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);
        const usuario = rows[0];

        if (quantidadeUsuarios > 0 && usuario.id !== id) {
            return res.status(400).json({ mensagem: 'O e-mail informado está indisponível.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizaUsuario = `update usuarios set
        nome = $1,
        nome_loja = $2,
        email = $3,
        senha = $4
        where id = $5`;

        const usuarioAtualizado = await conexao.query(queryAtualizaUsuario, [nome, nome_loja, email, senhaCriptografada, id]);

        if (usuarioAtualizado.rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Não foi possível atualizar o usuário.' });
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
};

module.exports = {
    cadastrar,
    detalhar,
    atualizar
}