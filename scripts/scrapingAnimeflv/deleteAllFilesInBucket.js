import { ObjectId } from 'mongodb'
import dbConectAndClose from '../../config/dbMongo.js'
import mongoose from 'mongoose'

// Function to delete all files in a specific GridFS bucket
export const deleteAllFilesInBucket = async (bucketName) => {
  console.log('// *** STARTING deleteAllFilesInBucket *** //')
  try {
    const conn = await dbConectAndClose()

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

      // Close the connection after deleting the files
      dbConectAndClose('close')
    })
  } catch (error) {
    dbConectAndClose('close')
    console.error('Error deleting files from the bucket:', error)
  }
}
