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
    const sql = 'SELECT * FROM appliances';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM appliances WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if(row == undefined){
            return res.json(404, { error: 'Eletrodoméstico não encontrado' })
        }
        res.json({ data: row });
    });
});

router.post('/', validate([
    body('brand').isLength({min: 5}).withMessage("A categoria deve ter pelo menos 5 caracteres")
]) ,(req, res) => {
    const {category, brand } = req.body;
    const sql = 'INSERT INTO appliances (category, brand ) VALUES (?, ?)';
    db.run(sql, [category, brand], function (err) {
        res.status(201).json({ 
            id: this.lastID,
            category: category,
            brand: brand
    });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    let { category, brand } = req.body;
    const sql = 'UPDATE appliances SET category = ?, brand = ? WHERE id = ?';
    if(category == "", brand == ""){
        return res.send({message: "Nenhum dado foi informado para atualização"})
    }
    db.run(sql, [category, brand, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Eletrodoméstico atualizado com sucesso'});
    });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM appliances WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: "O eletrodomestico não existe" });
        }
        res.json({ message: 'Eletrodomestico deletado com sucesso' });
    });
});

module.exports = router;