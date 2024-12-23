import React, { useState } from 'react'

interface Field {
  name: string
  type: string
  options: string
}

interface PrismaModelFormProps {
  onSubmit: (modelName: string, fields: Field[]) => void
}

const PrismaModelForm: React.FC<PrismaModelFormProps> = ({ onSubmit }) => {
  const [modelName, setModelName] = useState('')
  const [fields, setFields] = useState<Field[]>([{ name: '', type: '', options: '' }])

  const handleFieldChange = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields]
    newFields[index][key] = value
    setFields(newFields)
  }

  const addField = () => {
    setFields([...fields, { name: '', type: '', options: '' }])
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nonEmptyFields = fields.filter((field) => field.name && field.type)
    if (modelName && nonEmptyFields.length > 0) {
      onSubmit(modelName, nonEmptyFields)
    } else {
      alert('Please provide a model name and at least one field')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block mb-1'>Model Name</label>
        <input
          type='text'
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
      </div>
      <div>
        <label className='block mb-1'>Fields</label>
        {fields.map((field, index) => (
          <div key={index} className='flex space-x-2 mb-2'>
            <input
              type='text'
              value={field.name}
              onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
              placeholder='Field name'
              className='flex-1 p-2 border rounded'
            />
            <input
              type='text'
              value={field.type}
              onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              placeholder='Type'
              className='flex-1 p-2 border rounded'
            />
            <input
              type='text'
              value={field.options}
              onChange={(e) => handleFieldChange(index, 'options', e.target.value)}
              placeholder='Options (optional)'
              className='flex-1 p-2 border rounded'
            />
            <button
              type='button'
              onClick={() => removeField(index)}
              className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={addField}
          className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          Add Field
        </button>
      </div>
      <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
        Create Prisma Model
      </button>
    </form>
  )
}

export default PrismaModelForm
