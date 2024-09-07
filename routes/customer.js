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
router.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Obter um cliente por ID
router.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM customers WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if(row == undefined){
            return res.json(404, { error: 'Cliente não encontrado' })
        }
        res.json({ data: row });
    });
});

// Criar um novo cliente
router.post('/customers', validate([
    body('name').isLength({min: 3}).withMessage("O nome deve ter pelo menos 3 caracteres"),
    body('cpf').isLength({min: 11, max:11}).withMessage("O CPF deve ter 11 caracteres"),
    body('address').isLength({min:10}).withMessage("O endereço deve ter pelo menos 10 caracteres")
]) ,(req, res) => {
    const { name, cpf, address } = req.body;
    const sql = 'INSERT INTO customers (name, cpf, address) VALUES (?, ?, ?)';
    db.run(sql, [name, cpf, address], function (err) {
        if (err) {
            return res.status(400).json({ Erro: "Já existe um cliente cadastrado com este CPF" });
        }
        res.status(201).json({ 
            id: this.lastID,
            name: name,
            cpf: cpf,
            address: address
        });
    });
});

// Atualizar um cliente
router.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    let { name, cpf, address } = req.body;
    const sql = 'UPDATE customers SET name = ?, cpf = ?, address = ? WHERE id = ?';
    if(name == "" && cpf == "" && address == ""){
        return res.send({message: "Nenhum dado foi informado para atualização"})
    }
    db.run(sql, [name, cpf, address, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Cliente atualizado com sucesso'});
    });
});

// Deletar um cliente
router.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM customers WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: "O usuario não existe" });
        }
        res.json({ message: 'Customer deleted successfully' });
    });
});

module.exports = router;