import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  return (
    <div className='w-64 bg-gray-800 text-white p-4'>
      <h1 className='text-2xl font-bold mb-4'>AI API Generator</h1>
      <nav>
        <ul>
          <li className='mb-2'>
            <Link to='/' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              Dashboard
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/chat' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              Chat
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/editor' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              Code Editor
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/files' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              File Manager
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/api-generator' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              API Generator
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/manage-components' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              Manage Components
            </Link>
          </li>
          <li className='mb-2'>
            <Link to='/create-model' className='block py-2 px-4 hover:bg-gray-700 rounded'>
              Create Model
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
