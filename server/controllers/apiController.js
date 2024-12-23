const fs = require('fs-extra')
const archiver = require('archiver')
const path = require('path')
const { generateCode } = require('../services/codeGenerator')
// const { parseSchema, printDtos } = require('prisma-class-dto-generator')

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

exports.generateAPIFromSchema = async (req, res) => {
  try {
    let schema
    try {
      // Проверяем, если schema передана как строка, преобразуем её в объект
      schema = typeof req.body.schema === 'string' ? JSON.parse(req.body.schema) : req.body.schema
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON schema provided. Unable to parse.' })
    }

    const prismaModels = req.body.prismaModels

    // Проверка наличия данных
    if (!schema || typeof schema !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON schema provided.' })
    }

    // Создаём временную директорию для проекта
    const projectDir = path.join(__dirname, '../generated/project')
    await fs.ensureDir(projectDir)

    // 1. Создание project.json
    const projectJsonPath = path.join(projectDir, 'project.json')
    await fs.writeJson(projectJsonPath, schema.info, { spaces: 2 })

    // 2. Создание структуры endpoints
    const endpointsDir = path.join(projectDir, 'endpoints')
    await fs.ensureDir(endpointsDir)

    const paths = schema.paths || {}
    for (const [endpoint, methods] of Object.entries(paths)) {
      if (typeof endpoint !== 'string') continue // Пропуск некорректных данных

      for (const [method, details] of Object.entries(methods)) {
        if (typeof method !== 'string' || !details) continue // Пропуск некорректных данных

        const fileName = `${endpoint.replace(/\//g, '-')}.${method}.json`
        const filePath = path.join(endpointsDir, fileName)

        await fs.writeJson(
          filePath,
          {
            summary: details.summary || '',
            parameters: details.parameters || [],
            responses: details.responses || {},
          },
          { spaces: 2 }
        )
      }
    }

    // 3. Создание структуры components
    const componentsDir = path.join(projectDir, 'components')
    await fs.ensureDir(componentsDir)

    const schemas = schema.components?.schemas || {}
    for (const [name, definition] of Object.entries(schemas)) {
      const filePath = path.join(componentsDir, `${name.toLowerCase()}.output.json`)
      await fs.writeJson(filePath, definition, { spaces: 2 })
    }

    // 4. Создание структуры models
    const modelsDir = path.join(projectDir, 'models')
    await fs.ensureDir(modelsDir)

    // Генерация моделей DTO из Prisma моделей
    // if (Array.isArray(prismaModels) && prismaModels.length > 0) {
    //   const prismaSchemaString = prismaModels.join('\n\n')
    //   const parsedSchema = parseSchema(prismaSchemaString) // Исправленный вызов функции
    //   const dtos = printDtos(parsedSchema)

    //   for (const dto of dtos) {
    //     const dtoFilePath = path.join(modelsDir, `${dto.name}.dto.ts`)
    //     await fs.writeFile(dtoFilePath, dto.body, 'utf8')
    //   }
    // }

    // 5. Создание файла schema.prisma
    const prismaSchemaPath = path.join(projectDir, 'schema.prisma')
    const prismaSchemaContent = prismaModels.join('\n\n')
    await fs.writeFile(prismaSchemaPath, prismaSchemaContent, 'utf8')

    // 6. Создание ZIP-архива
    const zipPath = path.join(__dirname, '../generated/project.zip')
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      res.download(zipPath)
    })

    archive.pipe(output)
    archive.directory(projectDir, false)
    await archive.finalize()
  } catch (err) {
    console.error('Error generating API from schema:', err)
    res.status(500).json({ error: 'Failed to generate API.', details: err.message })
  }
}
