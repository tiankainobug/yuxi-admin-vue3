import { getStorage, setStorage } from "@/utils/storage.js";

export function getToken() {
  return getStorage('token')
}

export function setToken(token) {
  setStorage('token', token)
}

