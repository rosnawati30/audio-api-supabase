const express = require('express')
const upload = require('../config/multerConfig')
const supabase = require('../config/supabaseConfig')
const {v4: uuidv4} = require('uuid')

const router = express.Router()

router.post('/upload-audio', upload.single('audio'), async (req, res, next) => {
    try{
        if(!req.file){
            return res.status(400).json({
                message: 'File not uploaded'
            })
        }

        const fileName = `${uuidv4()}-${req.file.originalname}`

        //upload file to supabase
        const {data, error} = await supabase.storage
            .from('audio')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            })
        
        if(error){
            throw error
        }

        //create expires time
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        //insert metadata audio to database
        const {error:dbError} = await supabase
            .from('audios')
            .insert([
                {
                    file_name: fileName,
                    file_path: data.path,
                    expires_at: expiresAt
                }
            ])

        if(dbError){
            throw dbError
        }

        //generate link (24 hours)
        const {data: signedUrlData, error:signError} = 
            await supabase.storage
                .from('audio')
                .createSignedUrl(data.path, 60 * 60 * 24)
        
        if(signError){
            throw signError
        }

        res.json({
            message: 'Upload success',
            url: signedUrlData.signedUrl
        })
    }
    catch(err){
        next(err)
    }
    
})

router.get('/audio/:id', async(req, res, next) => {
    try{
        const {id} = req.params

        const {data, error} = await supabase
            .from('audios')
            .select('*')
            .eq('id', id)
            .single()

        if(error){
            throw error
        }

        if(!data){
            return res.status(400).json({
                message: 'Audio not found'
            })
        }

        if(new Date(data.expires_at) < new Data()){
            return res.status(410).json({
                message: 'Audio link expired'
            })
        }

        const {data: signedUrlData, error: signError} = 
            await supabase.storage
                .from('audio')
                .createSignedUrl(data.file_path, 60 * 60 * 24)

        if(signError){
            throw signError
        }

        res.json({
            id: data.id,
            file_name: data.file_name,
            url: signedUrlData.signedUrl,
            expires_at: data.expires_at
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router