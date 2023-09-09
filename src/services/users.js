import axios from "axios";
import Swal from "sweetalert2";

export const userRequest = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}/users`
})

// Add a response interceptor
userRequest.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const { status, data } = error.response;
  if (import.meta.env.MODE === "development") {
    console.log(data.message)
  }

  switch (status) {
    case 401:
    case 404:
      Swal.fire({
        icon: 'error',
        title: data.message,
        text: '',
        // showConfirmButton: false,
        timer: 2000
      })
      break;
    default:
      break;
  }
  return Promise.reject(error);
});

// 註冊
export const apiUserSignUp = (data) => userRequest.post('/sign_up', data);

// 登入
export const apiUserSignIn = (data) => userRequest.post('/sign_in', data);

// check token validation
export const apiUserCheckout = () => userRequest.get('/checkout');

// 登出
export const apiUserSignOut = (data) => userRequest.post('/sign_out', data);
