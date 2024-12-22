import { Editor } from '@monaco-editor/react'
import React, { useEffect, useRef, useState } from 'react'

interface Message {
  text: string
  sender: 'user' | 'ai'
  isCode?: boolean
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Автопрокрутка вниз
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      // Добавляем сообщение пользователя
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }])
      setInput('')

      const eventSource = new EventSource('http://localhost:3000/api/generate-stream')

      // Принимаем сообщения от сервера
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        // Определяем, является ли сообщение кодом
        if (data.code) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.code, sender: 'ai', isCode: true },
          ])
        } else {
          setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: 'ai' }])
        }
      }

      // Обработка ошибок
      eventSource.onerror = () => {
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   { text: 'An error occurred while generating the response.', sender: 'ai' },
        // ])
        eventSource.close()
      }
    }
  }

  return (
    <div className='p-4 h-full flex flex-col'>
      <h2 className='text-2xl font-bold mb-4'>Chat</h2>
      <div className='flex-1 overflow-auto mb-4 border rounded p-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            {message.isCode ? (
              <div className='rounded border border-gray-300'>
                <Editor
                  height='200px'
                  defaultLanguage='javascript'
                  value={message.text}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    tabSize: 2,
                  }}
                  theme='vs-dark'
                />
              </div>
            ) : (
              <span
                className={`inline-block p-2 rounded ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                }`}
              >
                {message.text}
              </span>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className='flex'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='flex-1 border rounded p-2 mr-2'
          placeholder='Type your message...'
        />
        <button onClick={handleSend} className='bg-blue-500 text-white px-4 py-2 rounded'>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat

// import React, { useEffect, useRef, useState } from 'react'

// interface Message {
//   text: string
//   sender: 'user' | 'ai'
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState<string>('')

//   const chatEndRef = useRef<HTMLDivElement>(null)

//   // Автопрокрутка вниз
//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const handleSend = () => {
//     if (input.trim()) {
//       // Добавляем сообщение пользователя
//       setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }])
//       setInput('')

//       const eventSource = new EventSource('http://localhost:3000/api/generate-stream')

//       // Принимаем сообщения от сервера
//       eventSource.onmessage = (event) => {
//         const data = JSON.parse(event.data)
//         setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: 'ai' }])

//         // Если получен финальный код, добавляем его как сообщение
//         if (data.code) {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: `Generated Code:\n${data.code}`, sender: 'ai' },
//           ])
//         }
//       }

//       // Обработка ошибок
//       eventSource.onerror = () => {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: 'An error occurred while generating the response.', sender: 'ai' },
//         ])
//         eventSource.close()
//       }
//     }
//   }

//   return (
//     <div className='p-4 h-full flex flex-col'>
//       <h2 className='text-2xl font-bold mb-4'>Chat</h2>
//       <div className='flex-1 overflow-auto mb-4 border rounded p-2'>
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
//           >
//             <span
//               className={`inline-block p-2 rounded ${
//                 message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
//               }`}
//             >
//               {message.text}
//             </span>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <div className='flex'>
//         <input
//           type='text'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className='flex-1 border rounded p-2 mr-2'
//           placeholder='Type your message...'
//         />
//         <button onClick={handleSend} className='bg-blue-500 text-white px-4 py-2 rounded'>
//           Send
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Chat
