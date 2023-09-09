// Import necessary modules and components
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import classNames from "classnames";
import {
  userRequest,
  apiUserCheckout,
  apiUserSignOut,
} from "../services/users";
import {
  todoRequest,
  apiAddTodo,
  apiGetTodo,
  apiDeleteTodo,
  apiToggleTodo,
} from "../services/todos";
import Swal from "sweetalert2";

const Todo = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    getNickname();
    getTodo();
  }, []);

  // Get user's nickname from the JWT token
  const getNickname = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("todo_token="))
      ?.split("=")[1];

      // Decode the JWT token to retrieve user information
      const decodedToken = jwt_decode(token);
      setNickname(decodedToken.nickname)
  }

  // Sign out the user
  const signOut = async () => {
    try {
      const { data } = await apiUserSignOut();
      // 清除 token > cookie
      document.cookie =
        "todo_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      userRequest.defaults.headers.common["Authorization"] = "";
      todoRequest.defaults.headers.common["Authorization"] = "";
      navigate("/auth/login");
    } catch (error) {
      // error
    }
  };

  // Manage the state of the todo list
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [tempTodos, setTempTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // Listen for changes in the filter option
  useEffect(() => {
    switch (filter) {
      case "all":
        setTempTodos(todos);
        break;
      case "uncompleted":
        setTempTodos(todos.filter((item) => !item.status));
        break;
      case "completed":
        setTempTodos(todos.filter((item) => item.status));
        break;
    }
  }, [filter, todos]);

  // Add a new todo item
  const addTodo = async () => {
    if(!todo.trim()) {
      setTodo("")
      return
    }

    try {
      const { data } = await apiAddTodo({
        content: todo.trim(),
      });
      getTodo();
      setTodo("");
    } catch (error) {
      // Handle error if adding a todo item fails
    }
  };

  // Get the list of todo items
  const getTodo = async () => {
    try {
      const { data } = await apiGetTodo();
      setTodos(data.data);
    } catch (error) {
      // Handle error if fetching todo items fails
    }
  };

  // Delete a todo item
  const deleteTodo = async (id) => {
    try {
      await apiDeleteTodo(id);
      setTodos(todos.filter((item) => item.id !== id));
    } catch (error) {
      // Handle error if deleting a todo item fails
    }
  };

  // Toggle the status of a todo item (completed/uncompleted)
  const toggleTodo = async (id) => {
    try {
	  // Update the status of the todo item
      setTodos(
        todos.map((item) =>
          item.id === id
            ? {
                ...item,
                status: !item.status,
              }
            : item
        )
      );
      const { data } = await apiToggleTodo(id);
    } catch (error) {
      // Handle error if toggling the status fails
    }
  };

  // Helper function to determine if a tab is active
  const tabActive = (status) => {
    return classNames({
      active: filter === status,
    });
  };

  // Clear completed todo items
  const clearCompleted = () => {
    const completedTodo = todos.filter((item) => item.status);
    if (!completedTodo.length) {
      return;
    }

    const promiseArray = [];
    for (let i = 0; i < completedTodo.length; i++) {
      promiseArray.push(apiDeleteTodo(completedTodo[i].id));
    }

    Promise.all(promiseArray)
      .then((res) => {
        setTodos(todos.filter((item) => !item.status));
        Swal.fire({
          icon: "success",
          title: "清除成功",
          text: "",
          // showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        // error
      });
  };

  // Render the todo list user interface
  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1>
            <a href="#">ONLINE TODO LIST</a>
          </h1>
          <ul className="nav_menu">
            <li>
              <span className="nav_text">{nickname}</span>
            </li>
            <li>
              <button
                type="button"
                className="nav_btn"
                onClick={() => {
                  signOut();
                }}
              >
                登出
              </button>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="請輸入待辦事項"
                value={todo}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addTodo();
                }}
              >
                <i className="fa fa-plus"></i>
              </a>
            </div>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li>
                  <a
                    href="#"
                    className={`${filter === "all" ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter("all");
                    }}
                  >
                    全部
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={classNames({ active: filter === "uncompleted" })}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter("uncompleted");
                    }}
                  >
                    待完成
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={tabActive("completed")}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter("completed");
                    }}
                  >
                    已完成
                  </a>
                </li>
              </ul>
              <div className="todoList_items">
                {todos.length ? (
                  <>
                    <ul className="todoList_item">
                      {tempTodos.map((item) => {
                        return (
                          <li key={item.id}>
                            <label className="todoList_label">
                              <input
                                className="todoList_input"
                                type="checkbox"
                                checked={item.status}
                                onChange={(e) => {
                                  // console.log(e.target.checked);
                                  toggleTodo(item.id);
                                }}
                              />
                              <span>{item.content}</span>
                            </label>
                            <a
                              href="#"
                              className="icon-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteTodo(item.id);
                              }}
                            >
                              <i className="fa-sharp fa-solid fa-trash"></i>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="todoList_statistics">
                      <p>
                        {todos.filter((item) => !item.status).length}{" "}
                        個待完成項目
                      </p>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          clearCompleted();
                        }}
                        className={`${
                          todos.filter((e) => e.status).length === 0
                            ? "disabled"
                            : ""
                        }`}
                      >
                        清除已完成項目
                      </a>
                    </div>
                  </>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                    }}
                  >
                    目前尚無待辦事項
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
