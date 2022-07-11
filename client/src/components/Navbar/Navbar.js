import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logo } from "../../images/index"
import { GiFullMotorcycleHelmet } from "react-icons/gi"
import { GoGear } from "react-icons/go"
import { MdExitToApp } from "react-icons/md"
import { GoThreeBars } from "react-icons/go"
import Sidebar from "./Sidebar/Sidebar"
import axios from "axios"
import "./Navbar.css"

const Navbar = ({ isLoggedIn, userId, logoutHandler }) => {

  const [username, setUsername] = useState("Username")
  const [sidebarActive, setSidebarActive] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarActive(prev => !prev)

  // Close sidebar when not needed anymore.
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth > 1000) setSidebarActive(false)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Get username from userId prop.
  useEffect(() => {
    const fetchUsername = async () => {
      const userObject = localStorage.getItem("userData")
      const user = JSON.parse(userObject)
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ user.token }`
        }
      }

      try {
        const { data } = await axios.get(`/api/user/${user.userId}`, config)
        setUsername(data.username)
      } catch {
        logoutHandler()
      }
    }
    
    if(isLoggedIn) fetchUsername()
  }, [isLoggedIn, logoutHandler])

  return (
    <nav id="navbar">

      <div className="nav-links-container">
        <div id="logo">
          <img src={logo} alt="typeracer logo"></img>
          <Link className="logo-link" to="/"><strong>typeracer</strong></Link>
        </div>
        <a className="nav-link" href="https://discord.com/invite/typeracer" target="_blank" rel="noreferrer noopener">Discord</a>
        <Link className="nav-link" to="/about">About</Link>
      </div>

      <div className="nav-btn-row" style={{display: isLoggedIn ? "none":"flex"}}>
        <div className="signup-info">Sign up to track your progress!</div>
        <Link to="/create-account"><button className="nav-btn">Create Account</button></Link>
        <Link to="/login"><button className="nav-btn">Sign In</button></Link>
      </div>

      <div className="nav-user-settings" style={{display: isLoggedIn ? "flex":"none"}}>
        <GiFullMotorcycleHelmet className="helmet-icon" size={40}/>
        <div className="nav-user-info">
          <p>{username}</p>
          <div className="nav-user-icons">
            <GoGear size={20} onClick={() => navigate(`/user/${userId}`)}></GoGear>
            <MdExitToApp size={20} onClick={logoutHandler}/>
          </div>
        </div>
      </div>

      <GoThreeBars id="hamburger-menu" size={30} onClick={toggleSidebar}/>
      <Sidebar sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} userId={userId} logoutHandler={logoutHandler}/>

    </nav>
  )
}   

export default Navbar