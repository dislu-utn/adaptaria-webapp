import { API_URL } from "../config";

const TIMEOUT = 300000;

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': true,
};

const doFetch = (path, body, method, useAuthentication, headers, isForm, token, useTimeout = true) => {
  let options = {
    method: method,
    headers,
    mode: 'cors',
  };

  if (token) {
    options.headers.Authorization = 'Bearer ' + token;
  } else {
    options.credentials = 'include';
  }

  if (!isForm && body) {
    options.body = JSON.stringify(body);
  } else if (body && isForm) {
    options.body = body;
  }

  if (useTimeout) {
    return Promise.race([sleep(TIMEOUT, onTimeout(path)), fetch(getUrl(path), options)]);
  }

  return fetch(getUrl(path), options);
};

export const getUrl = path => API_URL + path;

export const get = (path, useAuthentication = true, headers = DEFAULT_HEADERS, token = false) =>
  doFetch(path, null, HTTPMethods.GET, useAuthentication, headers, token);

export const post = (
  path,
  body,
  useAuthentication = true,
  headers = DEFAULT_HEADERS,
  isForm = false,
  token = false
) => doFetch(path, body, HTTPMethods.POST, useAuthentication, headers, isForm, token);

export const patch = (
  path,
  body,
  useAuthentication = true,
  headers = DEFAULT_HEADERS,
  isForm = false,
  token = false,
  useTimeout = true
) => doFetch(path, body, HTTPMethods.PATCH, useAuthentication, headers, isForm, token, useTimeout);

export const del = (
  path,
  body,
  useAuthentication = true,
  headers = DEFAULT_HEADERS,
  token = false
) => doFetch(path, body, HTTPMethods.DELETE, useAuthentication, headers, token);

export const put = (
  path,
  body,
  useAuthentication = true,
  headers = DEFAULT_HEADERS,
  token = false
) => doFetch(path, body, HTTPMethods.PUT, useAuthentication, headers, token);

export const HTTPMethods = {
  POST: 'POST',
  GET: 'GET',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

// /*
//     Usage:

//     generateFormData(
//         {
//             picture: {
//                 uri : image.uri,
//                 type: 'image/jpeg'
//             }
//         }
//     )
// */
// export function generateFormData(form) {
//   let formData = new FormData();

//   Object.keys(form).forEach(key => {
//     formData.append(key, form[key]);
//   });

//   return formData;
// }

function onTimeout(url) {
  return (_, reject) => reject('Request to ' + url + ' timeout.');
}

const sleep = (timeMS, onTimer) =>
  new Promise((resolve, reject) => setTimeout(() => onTimer(resolve, reject), timeMS));
