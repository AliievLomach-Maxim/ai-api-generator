const fs = require('fs-extra')
const archiver = require('archiver')
const path = require('path')
const { generateCode } = require('../services/codeGenerator')

exports.generateAPI = async (req, res) => {
  try {
    const { description } = req.body
    const apiCodePath = await generateCode(description)

    const zipPath = path.join(__dirname, '../generated/api.zip')
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => res.download(zipPath))
    archive.pipe(output)

    archive.directory(apiCodePath, false)
    archive.finalize()
  } catch (err) {
    console.error('Error generating API:', err)
    res.status(500).json({ error: 'API generation failed', details: err.message })
  }
}

exports.downloadAPI = (req, res) => {
  const { id } = req.params
  const filePath = `./generated/${id}.zip`

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ error: 'File not found' })
  }

  res.download(filePath)
}
exports.generateAPIStream = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const sendMessage = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    // Example description (could be replaced with actual request body in POST)
    const description = 'Create a sample API with /example route'

    // Step 1: Initialization
    sendMessage({ step: 1, message: 'Initializing generation...' })

    // Simulate delays for each step
    setTimeout(async () => {
      const apiPath = path.join(__dirname, '../generated/api')
      await fs.ensureDir(apiPath)
      sendMessage({ step: 2, message: 'Directory created.' })

      setTimeout(async () => {
        // Step 2: Generate code
        const code = `
    const express = require('express');
    const app = express();
    app.get('/example', (req, res) => res.send('${description}'));
    app.listen(3000, () => console.log('API is running on port 3000.'));
    `
        // await fs.writeFile(path.join(apiPath, 'app.js'), code)
        sendMessage({ step: 3, message: 'Code generated', code })

        setTimeout(() => {
          // Step 3: Completion
          sendMessage({ step: 4, message: 'Generation complete!' })
          res.end()
        }, 1000)
      }, 1000)
    }, 1000)
  } catch (err) {
    sendMessage({ step: 'error', message: `Error: ${err.message}` })
    res.end()
  }
}
