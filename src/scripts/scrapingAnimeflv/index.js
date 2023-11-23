import { monitoringPage } from './monitoringPage.js'
import { getUrl } from './getUrlDownloadVideo.js'
import { downloadFile } from './downloadAndSave.js'
import { deleteAllFilesInBucket } from './deleteAllFilesInBucket.js'

export const scrapingAnimeflv = async (dbConnection) => {
  try {
    // Get monitoring data
    const dataMonitoring = await monitoringPage(dbConnection)

    if (dataMonitoring.isData) {
      // If data exists, delete files in the 'capOP' bucket
      if (dataMonitoring.dbContent.length > 0) await deleteAllFilesInBucket('capOP', dbConnection)

      // Extract title and content information
      const { title, content } = dataMonitoring

      // Define a function to format parts of the title and content
      const formatPart = (str, start, end) => str.slice(start, end).trim()

      // Generate a unique video name based on title and content
      const nameVideo = `${formatPart(title, 0, 3)}-${formatPart(title, 3, 9)}-${formatPart(content, 0, 8)}-${formatPart(content, 8, 13)}.mp4`

      // Get the URL of the video
      const videoData = await getUrl(dataMonitoring)

      // Download the file and save it to the database
      await downloadFile(videoData, `${nameVideo}`, dbConnection)
    } else {
      // No data changes, end the script execution
      console.log('The data has not changed, the script execution will end')
    }
  } catch (error) {
    throw new Error('Error in scrapingAnimeflv:', error)
  }
}
