import mongoose from 'mongoose'

// Function to delete all files in a specific GridFS bucket
export const deleteAllFilesInBucket = async (bucketName, dbConnection) => {
  console.log('// *** STARTING deleteAllFilesInBucket *** //')
  try {
    const conn = dbConnection

    conn.on('error', (err) => {
      throw new Error('Error connecting to the database:', err)
    })

    conn.once('open', async () => {
      const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName })

      // Get all files in the bucket
      const cursor = await gfs.find({}).toArray()

      // Delete each file individually
      for (const doc of cursor) {
        await gfs.delete(doc._id)
      }
      console.log('All files in the bucket deleted')
    })
  } catch (error) {
    console.error('Error deleting files from the bucket:', error)
  }
}
