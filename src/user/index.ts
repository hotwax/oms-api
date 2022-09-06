import api from "@/api";
import { userProfileTransformRule } from "@/mappings/user";
import { Response, User } from "@/types";
import { hasError } from "@/util";
import { DataTransform } from 'node-json-transform';

async function getProfile(): Promise<User | Response> {
  let response = {} as User | Response;
  try {
    const resp = api({
      url: "user-profile", 
      method: "get",
    }) as any;

    if (resp.status === 200 && !hasError(resp)) {
      const userTransformResp: any =  new (DataTransform as any)(resp.data, userProfileTransformRule)
      const user: User = userTransformResp.transform()

      response = user;
    } else {
      response = {
        code: 'error',
        message: 'Something went wrong',
        serverResponse: 'Failed to fetch user profile information'
      }
    }
  } catch(err) {
    response = {
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    }
  }

  return response;
}

export { getProfile }
