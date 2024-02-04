import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";

export interface ApiResponse<T> {
    data?: T;
    isOk: boolean;
}

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export const fetchWithIntercep = async <T>(endpoint:string, method:string, 
    navigate:NavigateFunction,  data?: Record<string, any> | null):Promise<ApiResponse<T>> => {
    
    const token = localStorage.getItem('token');
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `${localStorage.getItem('token')}` : ''
      }
    };
    if (data) options.body = JSON.stringify(data);

    try {
      const response:Response = await fetch(new Request(`${baseUrl}/${endpoint}`, options));
      if (response.status === 401) {
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 300);
        return { isOk: false, data: null as T};
      }

      return {
        isOk: response.ok,
        data: await response.json() as T
      };
    } catch (error) {
      console.error(`Error while calling ${baseUrl}/${endpoint} endpoint:`, error);
      throw error;
    }
};
