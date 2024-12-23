const express = require('express')
const apiController = require('../controllers/apiController')
const { validateDescription } = require('../utils/validators')
const router = express.Router()

router.post('/generate', validateDescription, apiController.generateAPI)
router.get('/download/:id', apiController.downloadAPI)
router.get('/generate-stream', apiController.generateAPIStream)
router.post('/generate-api-from-schema', apiController.generateAPIFromSchema)

module.exports = router
