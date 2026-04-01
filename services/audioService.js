const {v4: uuidv4} = require('uuid')
const supabase = require('../config/supabaseConfig')

exports.uploadAudioService = async (file) => {
    const fileName = `${uuidv4()}-${file.originalname}`

    //save audio file to bucket storage supabase 
    const {data, error} = await supabase.storage
        .from('audio')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        })
    
    if(error){
        throw error
    }

    //create expires time 
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    //insert metadata file audio to 'audios' table in supabase 
    const {data: insertedData, error: dbError} = await supabase
        .from('audios')
        .insert([
            {
                file_name: fileName,
                file_path: data.path,
                expires_at: expiresAt
            }
        ])
        .select()
        .single()

    if(dbError){
        throw dbError
    }

    //generate link (24 hours)
    const {data: signedUrlData, error: signError} = 
        await supabase.storage
            .from('audio')
            .createSignedUrl(data.path, 60 * 60 * 24)

    if(signError){
        throw signError
    }

    return {
        id: insertedData.id,
        url: signedUrlData.signedUrl
    }

}

exports.getAudioService = async (id) => {
    //select metadata file audio from 'audios' table 
    const {data, error} = await supabase
        .from('audios')
        .select('*')
        .eq('id', id)
        .single()
    
    if(error){
        throw error
    }

    if(new Date(data.expires_at) < new Date()){
        throw new Error('Audio link expired')
    }

    const {data: signedUrlData, error: signError} = 
        await supabase.storage
            .from('audio')
            .createSignedUrl(data.file_path, 60 * 60* 24)

    if(signError){
        throw signError
    }

    return {
        id: data.id,
        file_name: data.file_name,
        expires_at: data.expires_at,
        url: signedUrlData.signedUrl
    }
}