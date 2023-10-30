import mongoose from 'mongoose'
const Schema = mongoose.Schema

const animeCapSchema = new Schema(
  {
    length: Number,
    chunkSize: Number,
    filename: {
      filename: String,
      metadata: {
        contentType: String,
        etiquetas: Array,
        data: {
          content: String,
          title: String
        }
      }
    }

  }
)

const AnimeCap = mongoose.model('AnimeCap', animeCapSchema, 'capOP.files')

export default AnimeCap
