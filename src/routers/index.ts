import express from 'express';

const router = express.Router()
const hotel = require('./hotel')

router.use('/', hotel)

module.exports = router