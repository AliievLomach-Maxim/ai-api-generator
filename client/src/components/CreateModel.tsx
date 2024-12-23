import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'

const CreateModel: React.FC = () => {
  const navigate = useNavigate()
  const [prismaModel, setPrismaModel] = useState(`model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the Prisma model to your backend
    console.log('Prisma Model:', prismaModel)

    // Navigate to the component creation page
    navigate('/manage-components', { state: { prismaModel } })
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create Prisma Model</h1>
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
        <button
          type='submit'
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Create Model and Component
        </button>
      </form>
    </div>
  )
}

export default CreateModel
