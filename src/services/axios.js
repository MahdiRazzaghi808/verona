import axios from 'axios';
const BASE_URL ='https://veronaapi.iran.liara.run';

const apiRequests = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',

    }
});



export const fetchFrom = async (configObj) => {
    const { method, url, requestConfig = {} } = configObj;
    const inAxiosData = { data: [], error: '', loading: true };
    let res = null;

    try {
        res = await apiRequests[method.toLowerCase()](url, {
            ...requestConfig,
        });


        if (res.status < 400) {
            inAxiosData.data = res.data;
        } else {
            inAxiosData.error = res.status;
        }
    } catch (err) {
        inAxiosData.error = 999;
    } finally {
        inAxiosData.loading = false;
    }


    return inAxiosData;
};


apiRequests.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        if (err.response && err.response.status) {
            const status = err.response.status;
            if (status === 400) {
                return { status: 400, message: 'Already registered with this number' }
            } else if (status === 403) {
                // Coding
            } else if (status === 404) {
                return { status: 404, message: 'دسترسی تموم شده' }
            }
        }
        return Promise.reject(err);
    }
)


export default apiRequests