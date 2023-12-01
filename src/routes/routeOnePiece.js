import express from 'express'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import rangeParser from 'range-parser'

// Disable strict mode for queries
mongoose.set('strictQuery', false)

// Create an Express router
const routeOnePiece = express.Router()

// Function to set up routes for One Piece videos
export const setupRoutesOP = (conn) => {
  const bucketName = process.env.BUCKET_NAME || 'capOP'

  // Route to get a list of all One Piece videos
  routeOnePiece.get('/one-piece', async (req, res) => {
    try {
      console.log(bucketName)
      const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName })
      gfs.checkIndexes()
      console.log('GFS', gfs)
      // Find all videos in the GridFSBucket and send the list as JSON
      const findCursor = await gfs.find({}).toArray()
      console.log(findCursor)
      console.log('PATH ==> /one-piece')
      res.json(findCursor)
    } catch (error) {
      // Handle errors
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Route to stream a specific One Piece video based on video ID
  routeOnePiece.get('/one-piece/:videoID', async (req, res) => {
    // Extract video ID from request parameters
    const videoID = req.params.videoID

    // Validate that videoID is a valid ObjectId
    if (!ObjectId.isValid(videoID)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const videoObjectId = new ObjectId(videoID)

    try {
      const gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName })
      // Find the video by its ID in the GridFSBucket
      const video = await gfs.find({ _id: videoObjectId }).toArray()

      // Check if the video exists
      if (!video || video.length === 0) {
        return res.status(404).json({ error: 'Video not found' })
      }

      // Extract information about the video
      const contentType = video[0].filename.contentType
      const videoSize = video[0].length

      // Get the requested range from the request headers
      const range = req.headers.range || 'bytes=0-'

      // Parse the range using range-parser library
      const ranges = rangeParser(videoSize, range, { combine: true })

      // Check if the requested range is valid
      if (!ranges || ranges === -1) {
        return res.status(416).json({ error: 'Range Not Satisfiable' })
      }

      // Extract start and end positions from the range
      const start = ranges[0].start
      const end = ranges[0].end !== undefined ? ranges[0].end : videoSize - 1

      // Set response headers for streaming the video
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': contentType
      }

      // Send partial content response (status code 206) with the headers
      res.writeHead(206, headers)

      // Open a readable stream from the GridFSBucket for the specified range
      const readstream = gfs.openDownloadStream(videoObjectId, {
        start,
        end: end + 1 // Add 1 to the end to include the last byte
      })

      // Pipe the video stream to the response stream
      readstream.pipe(res)
    } catch (error) {
      // Handle errors and send a 500 Internal Server Error response
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Return the configured Express router
  return routeOnePiece
}
