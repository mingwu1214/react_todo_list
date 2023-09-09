// NavLink: The NavLink component in React Router is specifically 
// designed for creating navigation links in a React application. 
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiUserSignUp  } from "../services/users";
import Swal from "sweetalert2";

const SignUp = () => {
  // Initialize navigation function
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false)

  // Function to handle the SignUp API call
  const signUp = async () => {

    if(!isValidate()){
      return
    }

    try{
	  // Start loading (API request in progress)
      setLoading(true)
	  // Make a SignUp API request
      const { data } = await apiUserSignUp(form)
	  // End loading (API request completed)
      setLoading(false)
	  // Navigate to the login page after successful SignUp
      navigate('/auth/login')
    } catch(error) {
      setLoading(false)
      // Display an error message to the user using the SweetAlert2 library
      const { status, data } = error.response;
      Swal.fire({
        icon: 'error',
        title: data.message,
        text: '',
        timer: 2000
      })
    }
  };

  // Function to validate the fields of the SignUp form 
  const isValidate = () => {

    if(!form.email) {
      console.log('請輸入 Email')
      return false
    }

    if(!form.nickname) {
      console.log('請輸入暱稱')
      return false
    }

    if(!form.password) {
      console.log('請輸入密碼')
      return false
    }

    if(form.password !== form.password_confirm) {
      console.log('輸入密碼不相同')
      return false
    }

    return true
  }

  // Function to handle input changes and update the form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  };

  // Render the SignUp form and user interface
  return (
    <>
      <form className="formControls" action="index.html">
        <h2 className="formControls_txt">註冊帳號</h2>
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
          defaultValue={form.email}
          onChange={handleChange}
        />
        <label className="formControls_label" htmlFor="nickname">
          您的暱稱
        </label>
        <input
          className="formControls_input"
          type="text"
          name="nickname"
          id="nickname"
          placeholder="請輸入您的暱稱"
          defaultValue={form.nickname}
          onChange={handleChange}
        />
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
          defaultValue={form.password}
          onChange={handleChange}
        />
        <label className="formControls_label" htmlFor="password_confirm">
          再次輸入密碼
        </label>
        <input
          className="formControls_input"
          type="password"
          name="password_confirm"
          id="password_confirm"
          placeholder="請再次輸入密碼"
          required
          defaultValue={form.password_confirm}
          onChange={handleChange}
        />
        <input
          className="formControls_btnSubmit"
          type="button"
          value="註冊帳號"
          onClick={(e) => {
            signUp();
          }}
          disabled={loading}
        />
        <NavLink className="formControls_btnLink" to="/auth/login">
          登入
        </NavLink>
      </form>
    </>
  );
};

export default SignUp;
