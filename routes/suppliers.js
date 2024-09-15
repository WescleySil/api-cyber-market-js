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



router.get('/', (req, res) => {
    const sql = 'SELECT * FROM suppliers';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM suppliers WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if(row == undefined){
            return res.json(404, { error: 'Fornecedor não encontrado' })
        }
        res.json({ data: row });
    });
});


router.post('/', validate([
    body('name').isLength({min: 3}).withMessage("O nome deve ter pelo menos 3 caracteres"),
    body('email').isEmail().withMessage("O email deve ser válido"),
    body('phone').isLength({min:9}).withMessage("O telefone deve ter pelo menos 9 digitos")
]) ,(req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'INSERT INTO suppliers (name, email, phone) VALUES (?, ?, ?)';
    db.run(sql, [name, email, phone], function (err) {
        res.status(201).json({ 
            id: this.lastID,
            name: name,
            email: email,
            phone: phone
        });
    });
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    let { name, email, phone } = req.body;
    const sql = 'UPDATE suppliers SET name = ?, email = ?, phone =  ? WHERE id = ?';
    if(name == "" && email == "", phone == ""){
        return res.send({message: "Nenhum dado foi informado para atualização"})
    }
    db.run(sql, [name, email, phone, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Fornecedor atualizado com sucesso'});
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM suppliers WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: "O Fornecedor não existe" });
        }
        res.json({ message: 'Fornecedor deletado com sucesso' });
    });
});

module.exports = router;