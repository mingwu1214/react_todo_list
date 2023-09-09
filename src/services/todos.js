import axios from "axios";

export const todoRequest = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}/todos`
})

// Add a response interceptor
todoRequest.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const { status, data } = error.response;
  if (import.meta.env.MODE === "development") {
    console.log(data.message)
  }

  return Promise.reject(error);
});

// 取得待辦
export const apiGetTodo = () => todoRequest.get('/');

// 新增待辦
export const apiAddTodo = (data) => todoRequest.post('/', data);

// 修改待辦"內容"
export const apiEditTodo = (id, data) => todoRequest.post(`/${id}`, data);

// 修改待辦"狀待"
export const apiToggleTodo = (id) => todoRequest.patch(`/${id}/toggle`);

// 刪除待辦
export const apiDeleteTodo = (id) => todoRequest.delete(`/${id}`);


