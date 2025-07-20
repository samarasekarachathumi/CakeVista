const express = require('express');
const router = express.Router();
const itemController = require('../Controllers/itemController');

router.post('/items', itemController.createItem);
router.get('/items', itemController.getItems);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;
