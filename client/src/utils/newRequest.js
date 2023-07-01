import axios from 'axios';

const newRequest = axios.create({
    // baseURL: 'http://localhost:8800/api/',
    baseURL: 'http://localhost:8800',
    withCredentials: true,
})

export default newRequest;