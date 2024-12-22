import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import OpenAPIComponentModal from './OpenAPIComponentModal'
import type { editor } from 'monaco-editor'

interface Endpoint {
  path: string
  method: 'get' | 'post' | 'put' | 'delete'
  parameters: string
  responseSchema: string
  errorResponseSchema: string
}

interface ProjectData {
  title: string
  summary: string
  description: string
  termsOfService: string
  contact: {
    name: string
    url: string
    email: string
  }
  license: {
    name: string
    url: string
  }
  version: string
}

interface Component {
  name: string
  schema: string
}

const CreateEndpoints: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const projectData = location.state as ProjectData
  const editorRef = useRef<any>(null)

  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint>({
    path: '',
    method: 'get',
    parameters: '[]',
    responseSchema: '{}',
    errorResponseSchema: '{}',
  })
  const [components, setComponents] = useState<Component[]>([])
  const [selectedParametersComponent, setSelectedParametersComponent] = useState<string>('')
  const [selectedResponseComponent, setSelectedResponseComponent] = useState<string>('')
  const [selectedErrorComponent, setSelectedErrorComponent] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Здесь должна быть логика загрузки компонентов с сервера
  // Для примера, мы просто добавим несколько тестовых компонентов
  React.useEffect(() => {
    setComponents([
      {
        name: 'User',
        schema:
          '{ "type": "object", "properties": { "id": { "type": "integer" }, "name": { "type": "string" } } }',
      },
      {
        name: 'Error',
        schema:
          '{ "type": "object", "properties": { "code": { "type": "integer" }, "message": { "type": "string" } } }',
      },
      {
        name: 'Pagination',
        schema:
          '{ "type": "object", "properties": { "page": { "type": "integer" }, "pageSize": { "type": "integer" } } }',
      },
    ])
  }, [])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const handleAddEndpoint = () => {
    setEndpoints([...endpoints, currentEndpoint])
    setCurrentEndpoint({
      path: '',
      method: 'get',
      parameters: '[]',
      responseSchema: '{}',
      errorResponseSchema: '{}',
    })
    setSelectedParametersComponent('')
    setSelectedResponseComponent('')
    setSelectedErrorComponent('')
  }

  const handleComponentSelect = (
    componentName: string,
    type: 'parameters' | 'response' | 'error'
  ) => {
    const component = components.find((c) => c.name === componentName)
    if (component) {
      const refString = JSON.stringify({ $ref: `#/components/schemas/${componentName}` }, null, 2)
      switch (type) {
        case 'parameters':
          setSelectedParametersComponent(componentName)
          setCurrentEndpoint((prev) => ({ ...prev, parameters: refString }))
          break
        case 'response':
          setSelectedResponseComponent(componentName)
          setCurrentEndpoint((prev) => ({ ...prev, responseSchema: refString }))
          break
        case 'error':
          setSelectedErrorComponent(componentName)
          setCurrentEndpoint((prev) => ({ ...prev, errorResponseSchema: refString }))
          break
      }
    }
  }

  const handleSaveComponent = (newComponent: Record<string, any>) => {
    const componentName = Object.keys(newComponent)[0]
    const newComponentObject = {
      name: componentName,
      schema: JSON.stringify(newComponent[componentName]),
    }
    setComponents([...components, newComponentObject])
    setIsModalOpen(false)
  }

  const handleSubmit = () => {
    const openApiSchema = {
      openapi: '3.0.0',
      info: {
        title: projectData.title,
        version: projectData.version,
        description: projectData.description,
        termsOfService: projectData.termsOfService,
        contact: projectData.contact,
        license: projectData.license,
      },
      components: {
        schemas: components.reduce((acc, component) => {
          acc[component.name] = JSON.parse(component.schema)
          return acc
        }, {} as Record<string, any>),
      },
      paths: endpoints.reduce((acc, endpoint) => {
        acc[endpoint.path] = {
          [endpoint.method]: {
            parameters: JSON.parse(endpoint.parameters),
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: JSON.parse(endpoint.responseSchema),
                  },
                },
              },
              '400': {
                description: 'Error response',
                content: {
                  'application/json': {
                    schema: JSON.parse(endpoint.errorResponseSchema),
                  },
                },
              },
            },
          },
        }
        return acc
      }, {} as Record<string, any>),
    }

    console.log(JSON.stringify(openApiSchema, null, 2))
    navigate('/')
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create Endpoints for {projectData.title}</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className='mb-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600'
      >
        Create Component
      </button>

      <div className='mb-4'>
        <input
          type='text'
          value={currentEndpoint.path}
          onChange={(e) => setCurrentEndpoint({ ...currentEndpoint, path: e.target.value })}
          placeholder='Endpoint Path'
          className='w-full p-2 border rounded mb-2'
        />
        <select
          value={currentEndpoint.method}
          onChange={(e) =>
            setCurrentEndpoint({ ...currentEndpoint, method: e.target.value as Endpoint['method'] })
          }
          className='w-full p-2 border rounded mb-2'
        >
          <option value='get'>GET</option>
          <option value='post'>POST</option>
          <option value='put'>PUT</option>
          <option value='delete'>DELETE</option>
        </select>
      </div>

      <div className='mb-4'>
        <label className='block mb-2 font-bold'>Parameters:</label>
        <select
          value={selectedParametersComponent}
          onChange={(e) => handleComponentSelect(e.target.value, 'parameters')}
          className='w-full p-2 border rounded mb-2'
        >
          <option value=''>Select a component for parameters</option>
          {components.map((component) => (
            <option key={component.name} value={component.name}>
              {component.name}
            </option>
          ))}
        </select>
        <div className='h-64 mb-2'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={currentEndpoint.parameters}
            onChange={(value) =>
              setCurrentEndpoint({ ...currentEndpoint, parameters: value || '[]' })
            }
            onMount={handleEditorDidMount}
            theme='vs-dark'
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block mb-2 font-bold'>Response Schema:</label>
        <select
          value={selectedResponseComponent}
          onChange={(e) => handleComponentSelect(e.target.value, 'response')}
          className='w-full p-2 border rounded mb-2'
        >
          <option value=''>Select a component for response</option>
          {components.map((component) => (
            <option key={component.name} value={component.name}>
              {component.name}
            </option>
          ))}
        </select>
        <div className='h-64 mb-2'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={currentEndpoint.responseSchema}
            onChange={(value) =>
              setCurrentEndpoint({ ...currentEndpoint, responseSchema: value || '{}' })
            }
            onMount={handleEditorDidMount}
            theme='vs-dark'
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block mb-2 font-bold'>Error Response Schema:</label>
        <select
          value={selectedErrorComponent}
          onChange={(e) => handleComponentSelect(e.target.value, 'error')}
          className='w-full p-2 border rounded mb-2'
        >
          <option value=''>Select a component for error response</option>
          {components.map((component) => (
            <option key={component.name} value={component.name}>
              {component.name}
            </option>
          ))}
        </select>
        <div className='h-64 mb-2'>
          <Editor
            height='100%'
            defaultLanguage='json'
            value={currentEndpoint.errorResponseSchema}
            onChange={(value) =>
              setCurrentEndpoint({ ...currentEndpoint, errorResponseSchema: value || '{}' })
            }
            onMount={handleEditorDidMount}
            theme='vs-dark'
          />
        </div>
      </div>

      <div className='mb-4'>
        <button
          onClick={handleAddEndpoint}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Add Endpoint
        </button>
      </div>

      <div className='mb-4'>
        <h2 className='text-xl font-bold mb-2'>Current Endpoints:</h2>
        {endpoints.map((endpoint, index) => (
          <div key={index} className='mb-2 p-2 border rounded'>
            <strong>{endpoint.method.toUpperCase()}</strong> {endpoint.path}
            <pre className='mt-2 bg-gray-100 p-2 rounded'>
              <code>{JSON.stringify(endpoint, null, 2)}</code>
            </pre>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
      >
        Generate OpenAPI Schema
      </button>

      <OpenAPIComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComponent}
      />
    </div>
  )
}

export default CreateEndpoints
