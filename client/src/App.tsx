import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import CodeEditor from './components/CodeEditor'
import FileManager from './components/FileManager'
import ApiGenerator from './components/ApiGenerator'
import Sidebar from './components/Sidebar'
import CreateProject from './components/CreateProject'
import CreateEndpoints from './components/CreateEndpoints'
import ManageComponents from './components/ManageComponents'
import CreateModel from './components/CreateModel'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex h-screen bg-gray-100'>
          <Sidebar />
          <div className='flex-1 overflow-auto'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/chat' element={<Chat />} />
              <Route path='/editor' element={<CodeEditor />} />
              <Route path='/files' element={<FileManager />} />
              <Route path='/api-generator' element={<ApiGenerator />} />
              <Route path='/create-project' element={<CreateProject />} />
              <Route path='/create-endpoints' element={<CreateEndpoints />} />
              <Route path='/manage-components' element={<ManageComponents />} />
              <Route path='/create-model' element={<CreateModel />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
