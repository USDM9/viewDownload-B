import mongoose from 'mongoose'
import defaultConfig from '../config/defaultConfig.js'

// conect MongoDB
const { mongoCapURI } = defaultConfig

const dbConectAndClose = async (close) => {
  if (close === 'close') {
    console.log('*** Close Conection DB ***')
    mongoose.connection.close()
  } else {
    try {
      mongoose.connect(mongoCapURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      const conect = mongoose.connection

      if (conect) console.log('*** Conect to db ***')
      return conect
    } catch (error) {
      console.error(`*** failed to connect to db  with an error ***: ${error}`)
    }
  }
}

// conection on MongoDB end
export default dbConectAndClose
