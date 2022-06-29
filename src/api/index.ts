import axios from 'axios';
import mitt from 'mitt'
import {
  StatusCodes
} from 'http-status-codes';
import { setupCache } from 'axios-cache-adapter'
import { events } from '../types';

const emitter = mitt();

let token = ''
let instanceUrl = ''
let cacheMaxAge = 0


function updateToken(key: string) {
  token = key
}

function updateInstanceUrl(url: string) {
  instanceUrl = url
}

function init(key: string, url: string, cacheAge: number) {
  token = key
  instanceUrl = url
  cacheMaxAge = cacheAge
}

axios.interceptors.request.use(async (config: any) => {
    if (token) {
        config.headers.Authorization =  'Bearer ' + token;
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // TODO Handle it in a better way
    // Currently when the app gets offline, the time between adding a loader and removing it is fractional due to which loader dismiss is called before loader present
    // which cause loader to run indefinitely
    // Following gives dismiss loader a delay of 100 microseconds to get both the actions in sync
    setTimeout(() => emitter.emit(events.DISMISS_LOADER), 100);
    if (error.response) {
        // TODO Handle case for failed queue request
        const { status } = error.response;
        if (status == StatusCodes.UNAUTHORIZED) {
          emitter.emit(events.UNAUTHORIZED)
        }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

const axiosCache = setupCache({
  maxAge: cacheMaxAge * 1000
})

/**
 * Generic method to call APIs
 *
 * @param {string}  url - API Url
 * @param {string=} method - 'GET', 'PUT', 'POST', 'DELETE , and 'PATCH'
 * @param {any} [data] - Optional: `data` is the data to be sent as the request body. Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
 * When no `transformRequest` is set, must be of one of the following types:
 * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 * - Browser only: FormData, File, Blob
 * - Node only: Stream, Buffer
 * @param {any} [params] - Optional: `params` are the URL parameters to be sent with the request. Must be a plain object or a URLSearchParams object
 * @param {boolean} [cache] - Optional: Apply caching to it
 *  @param {boolean} [queue] - Optional: Apply offline queueing to it
 * @return {Promise} Response from API as returned by Axios
 */
const api = async (customConfig: any) => {
    // Prepare configuration
    const config: any = {
        url: customConfig.url,
        method: customConfig.method,
        data: customConfig.data,
        params: customConfig.params
    }
    const baseURL = instanceUrl;
    if (baseURL) config.baseURL = `https://${baseURL}.hotwax.io/api/`;

    if(customConfig.cache) config.adapter = axiosCache.adapter;

    if (customConfig.queue) {
        if (!config.headers) config.headers = { ...axios.defaults.headers.common, ...config.headers };

        emitter.emit(events.QUEUE_TASK, {
            callbackEvent: customConfig.callbackEvent,
            payload: config
        });
    } else {
        return axios(config);
    }
}

/**
 * Client method to directly pass configuration to axios
 *
 * @param {any}  config - API configuration
 * @return {Promise} Response from API as returned by Axios
 */
const client = (config: any) => {
    return axios.request(config);
}

export { api as default, client, axios, init, updateToken, updateInstanceUrl };