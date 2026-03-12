# Audio API with Supabase

Simple REST API for uploading audio files and generating temporary access links.
Uploaded audio files are stored in Supabase Storage and can be accessed through a signed URL that expires after **24 hours**.

## Tech Stack

* Node.js
* Express.js
* Multer
* Supabase Storage
* Supabase Database

## Features

* Upload audio files
* Store audio files in Supabase Storage
* Save audio metadata in database
* Generate signed URL with 24 hour expiration
* Simple REST API

## Installation

Clone this repository

Install dependencies:

npm install

Create a `.env` file in the root directory:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

Run the server:

node app.js

Server will run at:

http://localhost:3000

## API Endpoints

### Upload Audio

POST /api/upload-audio

Request type: `multipart/form-data`

Field name:

audio

Example response:

{
"message": "Upload success",
"url": "signed_audio_url"
}

### Get Audio

GET /api/audio/:id

Example response:

{
"id": "uuid",
"file_name": "audio.webm",
"url": "signed_url",
"expires_at": "timestamp"
}

## Note

Make sure Row Level Security (RLS) is enabled in Supabase and allow INSERT and SELECT operations for the audios table.
