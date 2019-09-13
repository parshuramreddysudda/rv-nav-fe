import axios from "axios";

export const LOADING = "LOADING";
export const ERROR_MESSAGE = "ERROR_MESSAGE";
export const REGISTER = "REGISTER";
export const LOGIN = "LOGIN";
export const ADD_VEHICLE = "ADD_VEHICLE";
export const GET_VEHICLE = "GET_VEHICLE";
export const GET_WALMARTS = "GET_WALMARTS";
export const DUPLICATE_USER = "DUPLICATE_USER";
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL";
export const AUTH_ERROR = "AUTH_ERROR";
export const INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
export const CLEAR_ERROR = "CLEAR_ERROR"

export function authError(error) {
  return { type: "AUTH_ERROR", payload: error };
}

export function clearError() {
  return {type: CLEAR_ERROR}
}

export const register = creds => {
  return dispatch => {
    dispatch({ type: LOADING });
    return axios
      .post(
        "https://labs-rv-life-staging-1.herokuapp.com/users/register",
        creds
      )
      .then(response => {
        dispatch({ type: REGISTER, payload: response.data });
        console.log("response", response.data);
        return true;
      })
      .catch(err => {
        if (
          authError(err).payload.response.data.constraint ===
          "users_username_unique"
        ) {
          dispatch({ type: DUPLICATE_USER });
        } 
          if (
          authError(err).payload.response.data.constraint ===
          "users_email_unique"
        ) {
          dispatch({ type: DUPLICATE_EMAIL });
        }
        //   dispatch({
        //     type: ERROR_MESSAGE,
        //     errorMessage: "User was unable to be created."
        //   });
      });
  };
};

export const login = values => {
  return dispatch => {
    dispatch({ type: LOADING });
    return axios
      .post("https://labs-rv-life-staging-1.herokuapp.com/users/login", values)
      .then(res => {
        console.log(res); // data was created successfully and logs to console
        localStorage.setItem("token", res.data.token);
        dispatch({ type: LOGIN, payload: res.data });
        return true;
      })
      .catch(err => {
        if (authError(err).payload.response.status === 401) {
          dispatch({ type: INVALID_CREDENTIALS });
        }
        // dispatch({ type: ERROR_MESSAGE, errorMessage: "request failed" });
      });
  };
};

export const addVehicle = value => {
  return dispatch => {
    dispatch({ type: LOADING });
    return axios
      .post("https://labs-rv-life-staging-1.herokuapp.com/vehicle", value, {
        headers: { Authorization: localStorage.getItem("token") },
        "Content-Type": "application/json"
      })
      .then(res => {
        console.log(res); // data was created successfully and logs to console

        dispatch({ type: ADD_VEHICLE, payload: res.data });
        return true;
      })
      .catch(err => {
        console.log(err); // there was an error creating the data and logs to console
        dispatch({ type: ERROR_MESSAGE, errorMessage: "request failed" });
      });
  };
};

export const getVehicles = () => {
  return dispatch => {
    dispatch({ type: LOADING });
    return axios
      .get("https://labs-rv-life-staging-1.herokuapp.com/vehicle", {
        headers: { Authorization: localStorage.getItem("token") },
        "Content-Type": "application/json"
      })
      .then(res => {
        console.log("get res", res); // data was created successfully and logs to console

        dispatch({ type: GET_VEHICLE, payload: res.data });
        return true;
      })
      .catch(err => {
        console.log(err); // there was an error creating the data and logs to console
        dispatch({ type: ERROR_MESSAGE, errorMessage: "request failed" });
      });
  };
};

export const getWalmarts = () => {
  return dispatch => {
    dispatch({ type: LOADING });
    return axios
      .get(
        "http://eb-flask-rv-dev.us-east-1.elasticbeanstalk.com/fetch_walmart"
      )
      .then(res => {
        console.log("get res", res); // data was created successfully and logs to console

        dispatch({ type: GET_WALMARTS, payload: res.data });
        return true;
      })
      .catch(err => {
        console.log(err); // there was an error creating the data and logs to console
        dispatch({ type: ERROR_MESSAGE, errorMessage: "request failed" });
      });
  };
};
