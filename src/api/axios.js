import axios from 'axios'

const baseUrl = 'http://101.200.50.231:3000/'

axios.defaults.withCredentials = true

axios.defaults.baseURL = baseUrl

export default axios
