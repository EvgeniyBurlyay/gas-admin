const express = require('express');
const { pool } = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

// list all gases
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gases');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching gases' });
  }
});

// get by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gases WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.sendStatus(404);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching gas' });
  }
});

// create gas
router.post('/', authorizeRoles('admin', 'manager'), async (req, res) => {
  const { name, price, quantity, volume } = req.body;
  if (!name || price == null || quantity == null || volume == null) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO gases (name, price, quantity, volume) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, quantity, volume]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating gas' });
  }
});

// update gas
router.put('/:id', authorizeRoles('admin', 'manager', 'warehouse'), async (req, res) => {
  const { name, price, quantity, volume } = req.body;
  try {
    const result = await pool.query(
      'UPDATE gases SET name=$1, price=$2, quantity=$3, volume=$4 WHERE id=$5 RETURNING *',
      [name, price, quantity, volume, req.params.id]
    );
    if (result.rows.length === 0) return res.sendStatus(404);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating gas' });
  }
});

// delete gas
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gases WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.sendStatus(404);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting gas' });
  }
});

module.exports = router;
