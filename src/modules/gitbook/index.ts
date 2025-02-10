import api, {client} from "../../api";
import { hasError } from "../../util";

async function askQuery(payload: any): Promise<any> {
  try {
    const resp = await client({
      url: `spaces/${payload.spaceId}/search/ask`,
      method: "post",
      baseURL: payload.baseURL,
      data: {
        "query": payload.queryString,
      },
      params: {
        "format": "markdown"
      },
      headers: {
        Authorization:  'Bearer ' + payload.token,
        "Content-Type": "application/json"
      }
    }) as any;

    if (!hasError(resp)) {
      return Promise.resolve(resp)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function getGitBookPage(payload: any): Promise<any> {
  try {
    const resp = await client({
      url: `spaces/${payload.spaceId}/content/page/${payload.pageId}`,
      method: "get",
      baseURL: payload.baseURL,
      headers: {
        Authorization:  'Bearer ' + payload.token,
        "Content-Type": "application/json"
      }
    }) as any;

    if (!hasError(resp)) {
      return Promise.resolve(resp)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function searchQuery(payload: any): Promise<any> {
  try {
    const resp = await client({
      url: `spaces/${payload.spaceId}/search`,
      method: "get",
      baseURL: payload.baseURL,
      params: {
        "query": payload.queryString
      },
      headers: {
        Authorization:  'Bearer ' + payload.token,
        "Content-Type": "application/json"
      }
    }) as any;

    if (!hasError(resp)) {
      return Promise.resolve(resp)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

export {
  askQuery,
  getGitBookPage,
  searchQuery
}
