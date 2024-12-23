import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import PrismaModelForm from './PrismaModelForm'

interface OpenAPIComponentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (component: Record<string, any>, prismaModel: string) => void
}

interface Field {
  name: string
  type: string
  options: string
}

const defaultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int32',
    },
    name: {
      type: 'string',
    },
  },
}

const defaultPrismaModel = `model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`

const OpenAPIComponentModal: React.FC<OpenAPIComponentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [componentName, setComponentName] = useState('')
  const [schema, setSchema] = useState(JSON.stringify(defaultSchema, null, 2))
  const [showPrismaForm, setShowPrismaForm] = useState(true)
  const [prismaModel, setPrismaModel] = useState(defaultPrismaModel)
  const [modelCreationMethod, setModelCreationMethod] = useState<'form' | 'editor'>('form')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let parsedSchema
      let name
      if (modelCreationMethod === 'editor') {
        const { name: modelName, fields } = parsePrismaModel(prismaModel)
        name = modelName
        parsedSchema = convertPrismaToOpenAPI(modelName, fields)
      } else {
        name = componentName
        parsedSchema = JSON.parse(schema)
      }
      onSave(
        {
          [name]: parsedSchema,
        },
        prismaModel
      )
      onClose()
      setComponentName('')
      setSchema(JSON.stringify(defaultSchema, null, 2))
      setPrismaModel(defaultPrismaModel)
      setShowPrismaForm(true)
      setModelCreationMethod('form')
    } catch (error) {
      alert('Invalid schema or Prisma model')
    }
  }

  const handlePrismaModelSubmit = (modelName: string, fields: Field[]) => {
    setComponentName(modelName)
    const openApiSchema = convertPrismaToOpenAPI(modelName, fields)
    setSchema(JSON.stringify(openApiSchema, null, 2))
    setShowPrismaForm(false)
  }

  const convertPrismaToOpenAPI = (modelName: string, fields: Field[]) => {
    const properties: Record<string, any> = {}
    fields.forEach((field) => {
      let type: string
      let format: string | undefined

      switch (field.type.toLowerCase()) {
        case 'int':
        case 'integer':
          type = 'integer'
          format = 'int32'
          break
        case 'float':
        case 'double':
          type = 'number'
          format = 'double'
          break
        case 'boolean':
          type = 'boolean'
          break
        case 'datetime':
          type = 'string'
          format = 'date-time'
          break
        default:
          type = 'string'
      }

      properties[field.name] = { type }
      if (format) {
        properties[field.name].format = format
      }

      if (field.options.includes('required')) {
        properties[field.name].required = true
      }
    })

    return {
      type: 'object',
      properties,
    }
  }

  const parsePrismaModel = (model: string): { name: string; fields: Field[] } => {
    const lines = model.split('\n')
    const fields: Field[] = []
    let modelName = ''

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('model')) {
        modelName = trimmedLine.split(' ')[1]
      } else if (trimmedLine && !trimmedLine.startsWith('}')) {
        const [name, rest] = trimmedLine.split(/\s+/)
        const [type, ...options] = rest.split(/\s+/)
        fields.push({
          name,
          type: type.replace(/\?$/, ''),
          options: options.join(' '),
        })
      }
    }

    return { name: modelName, fields }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-3/4 max-w-4xl'>
        <h2 className='text-2xl font-bold mb-4'>Create OpenAPI Component</h2>
        <div className='mb-4'>
          <label className='mr-4'>
            <input
              type='radio'
              value='form'
              checked={modelCreationMethod === 'form'}
              onChange={() => setModelCreationMethod('form')}
            />
            Use Form
          </label>
          <label>
            <input
              type='radio'
              value='editor'
              checked={modelCreationMethod === 'editor'}
              onChange={() => setModelCreationMethod('editor')}
            />
            Use Code Editor
          </label>
        </div>
        {modelCreationMethod === 'form' ? (
          showPrismaForm ? (
            <PrismaModelForm onSubmit={handlePrismaModelSubmit} />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block mb-2'>Component Name</label>
                <input
                  type='text'
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className='w-full p-2 border rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2'>Schema Definition</label>
                <div className='h-96'>
                  <Editor
                    height='100%'
                    defaultLanguage='json'
                    value={schema}
                    onChange={(value) => setSchema(value || '')}
                    theme='vs-dark'
                  />
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Save Component
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block mb-2'>Prisma Model</label>
              <div className='h-96'>
                <Editor
                  height='100%'
                  defaultLanguage='prisma'
                  value={prismaModel}
                  onChange={(value) => setPrismaModel(value || '')}
                  theme='vs-dark'
                />
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Save Component
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default OpenAPIComponentModal
