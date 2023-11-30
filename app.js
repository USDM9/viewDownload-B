import express from 'express'
import cors from 'cors'
import http from 'http'
import { scrapingAnimeflv } from './src/scripts/scrapingAnimeflv/index.js'
import cron from 'node-cron'
import { setupRoutesOP } from './src/routes/routeOnePiece.js'
import { dbConnect } from './src/config/dbMongo.js'

import defaultConfig from './src/config/defaultConfig.js'

// Destructure the 'port' property from defaultConfig
const { port } = defaultConfig

// Create an Express app
export const app = express()

// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(express.json())

// Create an HTTP server instead of HTTPS
const server = http.createServer(app)

// Establish a connection to the MongoDB database
const dbConnection = dbConnect()

// Schedule a cron job to run the scraping script every Sunday at 8am
cron.schedule('00 15 * 1-12 7', async () => {
  // Run the scrapingAnimeflv function with the database connection
  scrapingAnimeflv(dbConnection)
}, {
  scheduled: true,
  timezone: 'Atlantic/Canary'
})

// Define a route to handle requests to the root endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Set up additional routes for One Piece videos using the setupRoutesOP function
app.use(setupRoutesOP(dbConnection))

// Error handling middleware to handle server errors
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start the HTTP server and listen on the specified port

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
