const express = require('express')
const upload = require('../config/multerConfig')
const { uploadAudioController, getAudioController } = require('../controllers/audioController')

const router = express.Router()

router.post('/upload-audio', upload.single('audio'), uploadAudioController)

router.get('/audio/:id', getAudioController)

module.exports = router