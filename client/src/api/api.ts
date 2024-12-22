import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/api'

export const generateStream = async () => {
  return axios('/generate-stream')
}
