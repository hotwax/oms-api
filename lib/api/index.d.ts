import axios from 'axios';
declare function updateToken(key: string): void;
declare function updateInstanceUrl(url: string): void;
declare function init(key: string, url: string, cacheAge: number): void;
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
declare const api: (customConfig: any) => Promise<import("axios").AxiosResponse<any> | undefined>;
/**
 * Client method to directly pass configuration to axios
 *
 * @param {any}  config - API configuration
 * @return {Promise} Response from API as returned by Axios
 */
declare const client: (config: any) => Promise<import("axios").AxiosResponse<any>>;
export { api as default, client, axios, init, updateToken, updateInstanceUrl };
