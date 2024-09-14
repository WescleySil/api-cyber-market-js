const express = require('express');
const router = express.Router();
const db = require('../database');
const { body } = require('express-validator');
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }

    next();
  };
};


// Obter todos os clientes
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employees';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Obter um cliente por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM employees WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if(row == undefined){
            return res.json(404, { error: 'Funcionário não encontrado' })
        }
        res.json({ data: row });
    });
});

// Criar um novo cliente
router.post('/', validate([
    body('name').isLength({min: 3}).withMessage("O nome deve ter pelo menos 3 caracteres"),
    body('cpf').isLength({min: 11, max:11}).withMessage("O CPF deve ter 11 caracteres"),
    body('address').isLength({min:10}).withMessage("O endereço deve ter pelo menos 10 caracteres"),
    body('phone').isLength({min:9}).withMessage("O telefone deve ter pelo menos 9 digitos")
]) ,(req, res) => {
    const { name, cpf, address, phone } = req.body;
    const sql = 'INSERT INTO employees (name, cpf, address, phone) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, cpf, address, phone], function (err) {
        if (err) {
            return res.status(400).json({ Erro: "Já existe um funcionário cadastrado com este CPF" });
        }
        res.status(201).json({ 
            id: this.lastID,
            name: name,
            cpf: cpf,
            address: address,
            phone: phone
        });
    });
});

// Atualizar um cliente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    let { name, cpf, address, phone } = req.body;
    const sql = 'UPDATE employees SET name = ?, cpf = ?, address = ?, phone =  ? WHERE id = ?';
    if(name == "" && cpf == "" && address == "", phone == ""){
        return res.send({message: "Nenhum dado foi informado para atualização"})
    }
    db.run(sql, [name, cpf, address, phone, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Funcionário atualizado com sucesso'});
    });
});

// Deletar um cliente
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: "O funcionário não existe" });
        }
        res.json({ message: 'Funcionário deletado com sucesso' });
    });
});

module.exports = router;