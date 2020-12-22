import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { getAccessToken, setAccessToken } from "./accessToken";

// Send cookies with all requests
axios.defaults.withCredentials = true;

// Executes on every request
axios.interceptors.request.use(
  async function (config) {
    // Don't attach access token to requests to aws
    if (config.url && config.url.includes("amazonaws.com")) {
      config.withCredentials = false;
      return config;
    }
    // Do something before request is sent
    let accessToken = getAccessToken();
    config.headers["authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Executes on every response
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url.includes("/api/v1/auth/refresh-token")
    ) {
      // The failed response is from the refresh token endpoint, do not retry
      return Promise.reject(error);
    }

    // Failed authentication and have not yet retried this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Attempt to refresh token
      return axios.post(`/api/v1/auth/refresh-token`).then((res) => {
        setAccessToken(res.data.accessToken);
        // Retry the original request
        return axios(originalRequest);
      });
    }

    // Return the error if we have already retried the original request
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
