import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
      <p className='mb-4'>Welcome to the AI API Generator dashboard.</p>
      <Link
        to='/create-project'
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Create New Project
      </Link>
    </div>
  )
}

export default Dashboard
