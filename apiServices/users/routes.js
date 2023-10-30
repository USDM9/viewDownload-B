import express from 'express'
import dbConect from '../../config/dbMongo.js'
import AnimeCap from '../../models/animeSchema.js'

const routerUsers = express.Router()

routerUsers.get('/users', (req, res) => {
  res.send('Hollo Users')
})

routerUsers.get('/users:id', (req, res) => {

})

routerUsers.get('/One-Piece', (req, res) => {
  res.send('Capi')
})

routerUsers.get('/test', async (req, res) => {
  try {
    if (req.body) {
      dbConect()
      const allAnimeCap = await AnimeCap.find()
      const cap = new AnimeCap({ name: req.body.name, content: req.body.content })
      const listContent = allAnimeCap.map(item => item.content === cap.content)

      if (!listContent.length > 0) {
        await cap.save()
        const savedCap = await AnimeCap.find({ content: cap.content })
        res.send(savedCap)
      }
    }
  } catch (error) {
    console.error(`bad on path ** /test ** with error: ${error}`)
  }
  res.status(404).send()
})

export default routerUsers
