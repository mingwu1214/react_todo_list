// React applications are often single-page applications (SPAs) 
// that dynamically change content based on the URL or route. 
// "react-router-dom" is used to manage these routes and navigation 
// within your React application.
import { Routes, Route, NavLink } from "react-router-dom";
import Todo from "./views/Todo";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Auth from "./views/layout/Auth";
import ProtectedRoute from "./views/layout/ProtectedRoute";

const App = () => {
  const getNavStyle = ({isActive})=>{
    return {
      'color': isActive && 'red'
    }
  }

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={ <Todo /> } />
        </Route>
        <Route path="/auth" element={ <Auth /> } >
          <Route path="login" element={ <Login />} />
          <Route path="sign_up" element={ <SignUp />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
