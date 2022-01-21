import axios from "axios";

export const onSubmit = (e, dispatch, action, url, userInput, method, token) => {
  e.preventDefault();
  dispatch(action(url, userInput, method, token));
};

export const getSomething = (method, url, data, token, setState) => {
  axios({
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data,
    url: `http://localhost:5000/api${url}`,
  }).then((response) => {
    setState(response.data);
  });
};

export const postSomething = (method, url, data, token, setState) => {
  axios({
    method,
    data,
    headers: { Authorization: `Bearer ${token}` },
    url: `http://localhost:5000${url}`,
  }).then((response) => {
    setState(response.data.data);
  });
};

export const parser = (jsonData, setState) => {
  let parsed = [];
  jsonData.map((e) => parsed.push(JSON.parse(e)));
  setState(parsed);
};

export const methods = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  put: "PUT",
  remove: "DELETE",
};

export const blockInvalidChar = (e) => parseInt(e.key) * 0 !== 0 && e.key !== "Backspace" && e.preventDefault(); //for number input field, will allow only positive numbers
