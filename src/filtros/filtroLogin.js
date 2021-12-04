const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const tokenHash = require('../tokenHash');

async function verificaLogin(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Token não informado.' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, tokenHash);

        const queryConsultaUsuario = 'select * from usuarios where id = $1';
        const { rowsCount: quantidadeUsuarios, rows } = await conexao.query(queryConsultaUsuario, [id]);

        if (quantidadeUsuarios <= 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }
}

module.exports = verificaLogin;