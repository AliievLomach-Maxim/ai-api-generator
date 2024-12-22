import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const CreateProject: React.FC = () => {
  const navigate = useNavigate()
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    summary: '',
    description: '',
    termsOfService: '',
    contact: {
      name: '',
      url: '',
      email: '',
    },
    license: {
      name: '',
      url: '',
    },
    version: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjectData((prevData) => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.')
        return {
          ...prevData,
          [parent]: {
            ...(prevData[parent as keyof ProjectData] as any),
            [child]: value,
          },
        }
      }
      return { ...prevData, [name]: value }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedData = {
      title: projectData.title || '',
      summary: projectData.summary || '',
      description: projectData.description || '',
      termsOfService: projectData.termsOfService || '',
      contact: {
        name: projectData.contact.name || '',
        url: projectData.contact.url || '',
        email: projectData.contact.email || '',
      },
      license: {
        name: projectData.license.name || '',
        url: projectData.license.url || '',
      },
      version: projectData.version || '',
    }

    console.log(JSON.stringify(formattedData, null, 2))
    // Navigate to the create endpoints page with the project data
    navigate('/create-endpoints', { state: formattedData })
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create New Project</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block mb-1'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={projectData.title}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div>
          <label htmlFor='summary' className='block mb-1'>
            Summary (optional)
          </label>
          <input
            type='text'
            id='summary'
            name='summary'
            value={projectData.summary}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label htmlFor='description' className='block mb-1'>
            Description (optional)
          </label>
          <textarea
            id='description'
            name='description'
            value={projectData.description}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            rows={3}
          />
        </div>
        <div>
          <label htmlFor='termsOfService' className='block mb-1'>
            Terms of Service URL (optional)
          </label>
          <input
            type='url'
            id='termsOfService'
            name='termsOfService'
            value={projectData.termsOfService}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='space-y-2'>
          <h2 className='font-semibold'>Contact</h2>
          <div>
            <label htmlFor='contact.name' className='block mb-1'>
              Name (optional)
            </label>
            <input
              type='text'
              id='contact.name'
              name='contact.name'
              value={projectData.contact.name}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='contact.url' className='block mb-1'>
              URL (optional)
            </label>
            <input
              type='url'
              id='contact.url'
              name='contact.url'
              value={projectData.contact.url}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='contact.email' className='block mb-1'>
              Email (optional)
            </label>
            <input
              type='email'
              id='contact.email'
              name='contact.email'
              value={projectData.contact.email}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
        </div>
        <div className='space-y-2'>
          <h2 className='font-semibold'>License</h2>
          <div>
            <label htmlFor='license.name' className='block mb-1'>
              Name (optional)
            </label>
            <input
              type='text'
              id='license.name'
              name='license.name'
              value={projectData.license.name}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='license.url' className='block mb-1'>
              URL (optional)
            </label>
            <input
              type='url'
              id='license.url'
              name='license.url'
              value={projectData.license.url}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
        </div>
        <div>
          <label htmlFor='version' className='block mb-1'>
            Version (optional)
          </label>
          <input
            type='text'
            id='version'
            name='version'
            value={projectData.version}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Create Project
        </button>
      </form>
    </div>
  )
}

export default CreateProject
