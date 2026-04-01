require('dotenv').config()

const express = require('express')
const multer = require('multer')
const cors = require('cors')
const audioRoute = require('./routers/audioRoute')

const app = express()
const port = process.env.PORT || 3000

//cors
app.use(cors())

//upload audio router
app.use('/api', audioRoute)

app.get('/', (req, res) => {
    res.send('Welcome to voice message')
})

//error handling for multer and global
app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError){
        return res.status(400).json({
            error: err.message
        })
    } else if(err instanceof Error){
        return res.status(400).json({
            error: err.message
        })
    }

    res.status(500).json({
        error: 'Internal server error'
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})