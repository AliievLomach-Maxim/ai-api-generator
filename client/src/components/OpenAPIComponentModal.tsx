import React, { useState } from 'react'
import Editor from '@monaco-editor/react'

interface OpenAPIComponentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (component: any) => void
}

const defaultSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'integer',
      format: 'int32',
    },
    message: {
      type: 'string',
    },
  },
}

const OpenAPIComponentModal: React.FC<OpenAPIComponentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [componentName, setComponentName] = useState('')
  const [schema, setSchema] = useState(JSON.stringify(defaultSchema, null, 2))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parsedSchema = JSON.parse(schema)
      onSave({
        [componentName]: parsedSchema,
      })
      onClose()
      setComponentName('')
      setSchema(JSON.stringify(defaultSchema, null, 2))
    } catch (error) {
      alert('Invalid JSON schema')
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-3/4 max-w-4xl'>
        <h2 className='text-2xl font-bold mb-4'>Create OpenAPI Component</h2>
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
      </div>
    </div>
  )
}

export default OpenAPIComponentModal
