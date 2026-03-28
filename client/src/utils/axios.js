
import axios from 'axios';

const axiosInstanc = axios.create({
    baseURL:"http://localhost:3000/api",
     withCredentials: true
    
})

export default axiosInstanc