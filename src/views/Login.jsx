import { useState } from "react";
// NavLink: The NavLink component in React Router is specifically 
// designed for creating navigation links in a React application. 
import { NavLink, useNavigate } from "react-router-dom";
import { apiUserSignIn } from "../services/users";

const Login = () => {
  // Initialize navigation function
  const navigate = useNavigate()
  // Initialize state for form inputs
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // Initialize state for form validation errors
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  // Initialize loading state for API requests
  const [loading, setLoading] = useState(false);

  // Validate the fields of login form 
  const isValidate = () => {
    let flag = true;
    const tempError = {
      email: "",
      password: "",
    };

    if (!form.email) {
      tempError.email = "email 必填";
      flag = false;
    }

    if (!form.password) {
      tempError.password = "密碼必填";
      flag = false;
    }

    setError(tempError);
    return flag;
  };

  // Function to handle input changes and update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  
  // Function to handle user login
  const signIn = async () => {
	// Check if form inputs are valid
    if (!isValidate()) {
      return;
    }

    try {
	  // Start loading (API request in progress)
      setLoading(true);
	  // Make a login API request
      const { data } = await apiUserSignIn(form);
      const {token, exp, nickname} = data
	  // Store the authentication token in a cookie with an expiration time
      document.cookie = `todo_token=${token};expires=${new Date(exp*1000).toUTCString()}`
	  // End loading (API request completed)
      setLoading(false);
	  // Navigate to the root route after successful login
      navigate('/')
    } catch (error) {
	  // End loading if there's an error during the API request
      setLoading(false);
    }
  };

  // Render the login form and user interface
  return (
    <>
      <form className="formControls" action="index.html">
        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
        <label className="formControls_label" htmlFor="email">
          Email
        </label>
        <input
          className="formControls_input"
          type="text"
          id="email"
          name="email"
          placeholder="請輸入 email"
          required
          onChange={handleChange}
        />
        <span>{error.email}</span>
        <label className="formControls_label" htmlFor="password">
          密碼
        </label>
        <input
          className="formControls_input"
          type="password"
          name="password"
          id="password"
          placeholder="請輸入密碼"
          required
          onChange={handleChange}
        />
        <span>{error.password}</span>
        <input
          className="formControls_btnSubmit"
          type="button"
          value="登入"
          onClick={(e) => {
            signIn();
          }}
          disabled={loading}
        />
        <NavLink className="formControls_btnLink" to="/auth/sign_up">
          註冊帳號
        </NavLink>
      </form>
    </>
  );
};

export default Login;
