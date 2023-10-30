import express from 'express'
import routerUsers from './apiServices/users/routes.js'
import { scrapingAnimeflv } from './scripts/scrapingAnimeflv/index.js'
import cron from 'node-cron'

import defaultConfig from './config/defaultConfig.js'

const { port } = defaultConfig

export const app = express()
app.use(express.json())

// script second plane
// run all sunday at 8am

cron.schedule('05 01 * 1-12 1', async () => {
  scrapingAnimeflv()
}, {
  scheduled: true,
  timezone: 'Atlantic/Canary'
})

// second plane end

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(routerUsers)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
