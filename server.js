// server.js
const express = require('express')
const app = express()

// Middlewares...
// Routes...

module.exports = app

app.get('/test', async (req, res) => {
    res.json({message: 'pass!'})
})

