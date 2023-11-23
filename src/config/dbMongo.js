import mongoose from 'mongoose'
import defaultConfig from '../config/defaultConfig.js'

// Conect MongoDB
const { mongoCapURI } = defaultConfig

export const dbConnect = () => {
  try {
    mongoose.connect(mongoCapURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('*** Connected to DB ***')
    return mongoose.connection
  } catch (error) {
    console.error(`*** Error: ${error}`)
  }
}

export const dbCloseConection = () => {
  const db = mongoose.connection
  db.close(() => {
    console.log('Connection to DB Closed')
  })
}
