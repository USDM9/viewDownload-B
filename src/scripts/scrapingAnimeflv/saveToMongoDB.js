import mongoose from 'mongoose'

// Function to save the file in MongoDB
export const saveToMongoDB = async (stream, fileName, data, dbConnection) => {
  console.log('*** Init Function To Save File ***')
  // Connect to MongoDB when this function is called
  const conn = dbConnection

  conn.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err)
  })

  const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'capOP' })
  const metadata = {
    // Define metadata properties
    etiquetas: ['video', 'one piece', 'anime'],
    data: { content: data.content, title: data.title }
  }

  const uploadStream = gfs.openUploadStream(
    {
      contentType: data.contentType,
      contentLength: data.contentLength,
      filename: fileName,
      metadata
    }
  )
  console.log('** Init Pipe **')
  stream.pipe(uploadStream)

  // Event handler for when the upload stream is closed
  uploadStream.on('close', () => {
    console.log('File uploaded successfully to MongoDB')
  })

  // Event handler for any errors during the upload process
  uploadStream.on('error', (err) => {
    console.log('error uploadStream.on', err)
    throw new Error('error uploadStream.on', err)
  })
}
