const conexao = require('../conexao');

async function listarProdutos(req, res) {
    const { id } = req.usuario;

    try {
        const queryListarProdutos = 'select * from produtos where usuario_id = $1';
        const { rows: produtos } = await conexao.query(queryListarProdutos, [id]);

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

async function detalharProduto(req, res) {
    const { usuario } = req;
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ mensagem: 'O ID do produto deve ser um número.' });
    }

    try {
        const queryDetalharProduto = 'select * from produtos where produtos.id = $1';
        const { rows: produto, rowCount } = await conexao.query(queryDetalharProduto, [id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }

        if (produto[0].usuario_id !== usuario.id) {
            return res.status(403).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' });
        }

        return res.status(200).json(produto[0]);
    } catch (error) {
        return res.status(404).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

async function cadastrarProduto(req, res) {
    const { usuario } = req;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome do produto deve ser informado.' });
    }

    if (!quantidade) {
        return res.status(400).json({ mensagem: 'A quantidade do produto deve ser informada.' });
    }

    if (isNaN(Number(quantidade))) {
        return res.status(400).json({ mensagem: 'O campo quantidade deve ser do tipo número.' });
    }

    if (Number(quantidade) < 0) {
        return res.status(400).json({ mensagem: 'A quantidade de produtos não pode ser negativa.' });
    }

    if (!preco) {
        return res.status(400).json({ mensagem: 'O preço do produto deve ser informado.' });
    }

    if (isNaN(Number(preco))) {
        return res.status(400).json({ mensagem: 'O campo preço deve ser do tipo número.' });
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição do produto deve ser informada.' });
    }

    try {
        const queryCadastrarProduto = `insert into produtos 
        (usuario_id, nome, quantidade, categoria, preco, descricao, imagem)
        values
        ($1, $2, $3, $4, $5, $6, $7)`;

        const { rowCount } = await conexao.query(queryCadastrarProduto, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Não foi possível cadastrar o produto.' });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

async function atualizarProduto(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ mensagem: 'O ID do produto deve ser um número.' });
    }

    const { usuario } = req;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json({ mensagem: 'O nome do produto deve ser informado.' });
    }

    if (!quantidade) {
        return res.status(404).json({ mensagem: 'A quantidade do produto deve ser informada.' });
    }

    if (isNaN(Number(quantidade))) {
        return res.status(404).json({ mensagem: 'O campo quantidade deve ser do tipo número.' });
    }

    if (!categoria) {
        return res.status(404).json({ mensagem: 'A categoria do produto deve ser informada.' });
    }

    if (!preco) {
        return res.status(404).json({ mensagem: 'O preço do produto deve ser informado.' });
    }

    if (isNaN(Number(preco))) {
        return res.status(404).json({ mensagem: 'O campo preço deve ser do tipo número.' });
    }

    if (!descricao) {
        return res.status(404).json({ mensagem: 'A descrição do produto deve ser informada.' });
    }

    if (!imagem) {
        return res.status(404).json({ mensagem: 'A imagem do produto deve ser informada.' });
    }

    try {
        const querySelecionarProduto = 'select * from produtos where id = $1';
        const { rows: produtos, rowCount: quantidadeProdutos } = await conexao.query(querySelecionarProduto, [id]);

        if (quantidadeProdutos <= 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }

        if (produtos[0].usuario_id !== usuario.id) {
            return res.status(403).json({ mensagem: 'O usuário autenticado não tem permissão para alterar este produto.' });
        }

        const queryAtualizarProduto = `update produtos set 
        nome = $1,
        quantidade = $2,
        categoria = $3,
        preco = $4,
        descricao = $5,
        imagem = $6
        where id = $7 and usuario_id = $8`;

        const { rowCount } = await conexao.query(queryAtualizarProduto, [nome, quantidade, categoria, preco, descricao, imagem, id, usuario.id]);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Não foi possível atualizar o produto.' });
        }

        return res.status(201).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

async function excluirProduto(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ mensagem: 'O ID do produto deve ser um número.' });
    }

    const { usuario } = req;

    try {
        const querySelecionarProduto = 'select * from produtos where id = $1';
        const { rows: produtos, rowCount: quantidadeProdutos } = await conexao.query(querySelecionarProduto, [id]);

        if (quantidadeProdutos <= 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }

        if (produtos[0].usuario_id !== usuario.id) {
            return res.status(401).json({ mensagem: 'O usuário autenticado não tem permissão para excluir este produto.' });
        }

        const queryExcluirProduto = `delete from produtos
        where id = $1 and usuario_id = $2`;

        const { rowCount } = await conexao.query(queryExcluirProduto, [id, usuario.id]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Não foi possível excluir o produto.' });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Ocorreu um erro inesperado. - ' + error.message });
    }
}

module.exports = {
    listarProdutos,
    detalharProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}