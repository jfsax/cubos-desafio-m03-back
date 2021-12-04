const conexao = require('../conexao');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenHash = require('../tokenHash');

async function realizarLogin(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ mensagem: 'Os campos e-mail e senha devem ser informados.' });

    try {
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const { rowCount, rows } = await conexao.query(queryVerificaEmail, [email]);

        if (rowCount <= 0) return res.status(400).json({ mensagem: 'E-mail e/ou senha inválido(s).' });

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) return res.status(400).json({ mensagem: 'E-mail e/ou senha inválido(s).' });

        const token = jwt.sign({ id: usuario.id }, tokenHash, { expiresIn: '1d' });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

module.exports = realizarLogin;