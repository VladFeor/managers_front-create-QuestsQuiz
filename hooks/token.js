import { useAuthStore } from '/store/auth';
import axiosService from '~/service/axiosService';

let isRefreshingToken = false;
const failedRequestsQueue = [];

async function retryFailedRequests() {
  while (failedRequestsQueue.length) {
    const request = failedRequestsQueue.shift();
    // Check if request retry count exceeded limit
    if (request.retryCount > 1) {
      continue;
    }

    switch (request.method) {
      case 'get':
        await axiosService.get(request.url, request.params, request.headers);
        break;
      case 'post':
        await axiosService.post(request.url, request.data, false, request.headers);
        break;
      case 'put':
        await axiosService.put(request.url, request.data, false, request.headers);
        break;
      case 'patch':
        await axiosService.patch(request.url, request.data, false, request.headers);
        break;
      case 'delete':
        await axiosService.delete(request.url, request.data, request.headers);
        break;
      default:
        console.error('Unsupported HTTP method: ' + request.method);
    }
  }
}

let timeOut;
export function useTokenLifetime() {
  const authStore = useAuthStore();

  axiosService.axios.interceptors.response.use(null, async (err) => {
    const { config, response } = err;

    if (response && response.status === 401 && !isRefreshingToken) {
      isRefreshingToken = true;
      try {
        const resp = await authStore.refreshToken();
        if (resp.status === 200 || (resp.status === 204 && authStore.getToken)) {
          isRefreshingToken = false;
          clearTimeout(timeOut);
          timeOut = setTimeout(async () => {
            await retryFailedRequests();
          }, 1500);
        } else {
          isRefreshingToken = false;
        }
      } catch (error) {
        isRefreshingToken = false;
      }
    } else if (response && response.status === 401) {
      // Increase the retry count or set to 1 if not set yet
      config.retryCount = (config.retryCount || 0) + 1;
      if (config.retryCount <= 2) {
        timeOut = setTimeout(async () => {
          failedRequestsQueue.push(config);
          await retryFailedRequests();
        }, 1500);
      }
    }

    if (!authStore.getToken() && response.status === 500) {
      window.location.href = '/login';
    }

    return Promise.reject(err);
  });
}
