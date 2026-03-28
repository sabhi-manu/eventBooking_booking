
import axios from 'axios';

const axiosInstanc = axios.create({
    baseURL:"http://localhost:3000/api",
    
})

export default axiosInstanc