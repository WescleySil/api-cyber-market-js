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
    const sql = 'SELECT * FROM non_organic_compounds';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM non_organic_compounds WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if(row == undefined){
            return res.json(404, { error: 'Não Organico não encontrado' })
        }
        res.json({ data: row });
    });
});


router.post('/', validate([
    body('name').isLength({min: 3}).withMessage("O nome deve ter pelo menos 3 caracteres"),
    body('barcode').isLength({min:10}).withMessage("O codigo de barras deve ter pelo menos 10 caracteres"),
    body('expiration_date').isDate({format: "string"}).withMessage("A data de validade deve ser no formato dd/mm/yyyy")
]) ,(req, res) => {
    const { name, barcode, expiration_date } = req.body;
    const sql = 'INSERT INTO non_organic_compounds (name, barcode, expiration_date) VALUES (?, ?, ?)';
    db.run(sql, [name, barcode, expiration_date], function (err) {
        res.status(201).json({ 
            id: this.lastID,
            name: name,
            barcode: barcode,
            expiration_date: expiration_date
        });
    });
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    let { name, barcode, expiration_date } = req.body;
    const sql = 'UPDATE non_organic_compounds SET name = ?, barcode = ?, expiration_date =  ? WHERE id = ?';
    if(name == "" && barcode == "", expiration_date == ""){
        return res.send({message: "Nenhum dado foi informado para atualização"})
    }
    db.run(sql, [name, barcode, expiration_date, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Não Organico atualizado com sucesso'});
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM non_organic_compounds WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: "O Não Organico não existe" });
        }
        res.json({ message: 'Não Organico deletado com sucesso' });
    });
});

module.exports = router;