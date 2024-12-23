import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/api'

export const generateStream = async () => {
  return axios('/generate-stream')
}

export const generateAPIFromSchema = async (body: { schema: string; prismaModels: string[] }) => {
  return axios.post('/generate-api-from-schema', body, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
