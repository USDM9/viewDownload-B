import { chromium } from 'playwright'

// Get URL For Download
export const getUrl = async (obj) => {
  console.log('// *** STARTING getUrl *** //')
  const links = []

  // Launch a Chromium browser
  const browser = await chromium.launch()

  // Create a new page for interacting with the website
  const page = await browser.newPage()

  // Navigate to the URL provided in the 'obj' parameter
  await page.goto(`https://www3.animeflv.net${obj.urlCap}`)

  // Click on the download button to reveal the download link
  await page.locator('span.fa-download').click()

  // Get the download link for 'Stape MP4 SUB'
  const res = await page
    .getByRole('row', { name: 'Stape MP4 SUB  DESCARGAR' })
    .getByRole('link')
    .getAttribute('href')

  if (res.length !== 0) {
    links.push(res)
  }

  if (links[0].length !== 0) {
    // Navigate to the first download link
    await page.goto(`${links[0]}`)

    // Get the second video link with the 'mainvideo' ID
    const link = await page.locator('#mainvideo').getAttribute('src')
    await page.locator('#mainvideo').getAttribute('src')
    links.push(link)
  }

  console.log('Closing the browser')
  await browser.close()

  // Return an object with the original data ('obj') and the second link
  return {
    ...obj,
    link: links[1]
  }
}
