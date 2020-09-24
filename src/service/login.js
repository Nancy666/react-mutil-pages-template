import httpService from "./httpService";

export const login = (data) => {
    return httpService("/rzrq/rzrq/validateUser","post",data)
}