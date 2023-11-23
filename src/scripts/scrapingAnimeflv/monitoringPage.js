import { chromium } from 'playwright'

import AnimeCap from '../../models/animeSchema.js'

export const monitoringPage = async () => {
  console.log('// *** STARTING monitoringPage *** //')
  const mainUrl = 'https://www3.animeflv.net/anime/one-piece-tv'
  let tempObj = {}
  let urlCap = ''
  const browser = await chromium.launch({ headless: true })

  const page = await browser.newPage(mainUrl)

  // Navigate to the target website
  await page.goto(mainUrl)

  // Extract information from the page
  const listItem = await page.locator('.fa-play-circle').allTextContents()
  const title = listItem[1].slice(0, 9)
  const content = listItem[1].slice(9, 22)

  // Find the URL for a specific content
  urlCap = await page.locator('.fa-play-circle')
    .getByRole('link', { name: `${title} ${content}` })
    .getAttribute('href')

  // Close the Chromium browser and connect to the database
  await browser.close()

  // Get information from the database
  const dbContent = await dbGetInfo(content)
  tempObj = {
    title,
    content,
    urlCap,
    isData: true,
    dbContent
  }

  // Check if the URL is valid and content exists in the database
  if (urlCap !== '' && dbContent !== content) {
    return tempObj
  }
  return {
    ...tempObj,
    isData: false
  }
}

// Function to get information from the database
const dbGetInfo = async (content) => {
  console.log('// *** STARTING dbGetInfo *** //')
  try {
    // Query the database for all documents
    const cursor = await AnimeCap.find({})

    if (cursor.length > 0) {
      // Extract content data from documents
      const contents = cursor.map(doc => { return { content: doc.filename.metadata.data.content } })
      const res = contents.map(doc => doc.content === content ? doc.content : ' ')
      return res.toString()
    } else {
      // No documents found in the collection
      console.log('No files found in the collection')
      return false
    }
  } catch (error) {
    console.error('Error retrieving file information:', error)
  }
}
