// React applications are often single-page applications (SPAs) 
// that dynamically change content based on the URL or route. 
// "react-router-dom" is used to manage these routes and navigation 
// within your React application.

// Outlet: the Outlet component in React Router is used to define 
// the location 
// within a parent route's component where child route components
// should be rendered.

// NavLink: The NavLink component in React Router is specifically 
// designed for creating navigation links in a React application. 
import { Outlet, NavLink } from "react-router-dom";
import workImg from "../../assets/image/workImg.png";
import logo from "../../assets/image/logo_lg.png";

const Auth = () => {
  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
          <div className="side">
            <NavLink to="/">
              <img className="logoImg" src={logo} alt="" />
            </NavLink>
            <img className="d-m-n" src={workImg} alt="workImg" />
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
