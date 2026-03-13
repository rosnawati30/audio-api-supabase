const {uploadAudioService, getAudioService} = require('../services/audioService')

exports.uploadAudioController = async (req, res, next) => {
    try{
        if(!req.file){
            return res.status(400).json({
                message: 'File not uploaded'
            })
        }

        const url = await uploadAudioService(req.file)

        res.status(200).json({
            message: 'Upload success',
            url: url
        })
    }
    catch(err){
        next(err)
    }   
}

exports.getAudioController = async (req, res, next) => {
    try{
        const {id} = req.params
        const audio = await getAudioService(id)

        if(!audio){
            return res.status(400).json({
                message: 'Audio not found'
            })
        }

        res.redirect(302, audio.url)
    }
    catch(err){
        next(err)
    }
}