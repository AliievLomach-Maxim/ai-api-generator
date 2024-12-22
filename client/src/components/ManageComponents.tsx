import React, { useState } from 'react'
import Editor from '@monaco-editor/react'

interface Component {
  name: string
  schema: string
}

const ManageComponents: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([])
  const [currentComponent, setCurrentComponent] = useState<Component>({ name: '', schema: '{}' })

  const handleAddComponent = () => {
    if (currentComponent.name && currentComponent.schema) {
      setComponents([...components, currentComponent])
      setCurrentComponent({ name: '', schema: '{}' })
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Manage API Components</h1>

      <div className='mb-4'>
        <input
          type='text'
          value={currentComponent.name}
          onChange={(e) => setCurrentComponent({ ...currentComponent, name: e.target.value })}
          placeholder='Component Name'
          className='w-full p-2 border rounded mb-2'
        />
        <div className='h-64 mb-2'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={currentComponent.schema}
            onChange={(value) =>
              setCurrentComponent({ ...currentComponent, schema: value || '{}' })
            }
            theme='vs-dark'
          />
        </div>
        <button
          onClick={handleAddComponent}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Add Component
        </button>
      </div>

      <div className='mb-4'>
        <h2 className='text-xl font-bold mb-2'>Current Components:</h2>
        {components.map((component, index) => (
          <div key={index} className='mb-2 p-2 border rounded'>
            <strong>{component.name}</strong>
            <pre className='mt-2 bg-gray-100 p-2 rounded'>
              <code>{component.schema}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageComponents
