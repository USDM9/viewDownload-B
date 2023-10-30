import { ObjectId } from 'mongodb'
import fetch from 'node-fetch'
import { saveToMongoDB } from './saveToMongoDB.js'

// Function to download the file
export const downloadFile = async (videoData, filename) => {
  console.log('// *** STARTING downloadFile *** //')
  const url = videoData.link

  try {
    // Fetch the file from the provided URL
    const response = await fetch(`http:${url}`)
    if (!response.ok) {
      throw new Error(`Error in fetch with status code: ${response.status}`)
    }

    const stream = response.body

    // Extract content type and content length from the response headers
    const data = {
      ...videoData,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    }

    // Save the downloaded file to MongoDB
    saveToMongoDB(stream, filename, data)
  } catch (error) {
    throw new Error(`Error downloading the file: ${error.message}`)
  }
}
