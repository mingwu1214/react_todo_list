import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { apiUserCheckout, userRequest } from "../../services/users";
import { todoRequest } from "../../services/todos";


// ProtectedRoute that is used to protect certain routes in a React application. 
// It checks for authentication using a token stored in a cookie and then sets authorization headers for API requests based on the token. 

// Define the ProtectedRoute component:
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  // Verify token
  const checkAuth = async () => {
    // Attempt to retrieve the token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("todo_token="))
      ?.split("=")[1];

    if (!token) return navigate("/auth/login");

	// Set authorization headers for API requests
	// This allows the server to check the token and determine whether the user is authorized to access the requested resources or perform actions.
    userRequest.defaults.headers.common["Authorization"] = token;
    todoRequest.defaults.headers.common["Authorization"] = token;

    try {
		// Make an API request to check the user's authentication status
      const { data } = await apiUserCheckout();
      setIsAuth(true)
    } catch (error) {
		// If there's an error, navigate to the login page
      navigate("/auth/login");
    }
  };
  
  // Use the useEffect hook to run the checkAuth function
  useEffect(()=> {
    checkAuth();
  }, [])
  
  return (<>{isAuth ? <Outlet /> : ""}</>);
};

export default ProtectedRoute;
