import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark custom-nav">
        <div className="container-fluid">

          <Link className="navbar-brand" to="/">
            Tournament Arena
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="collapsibleNavId"
          >
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="/home"
                >
                  Home
                </Link>
              </li>
               <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/TeamForm"
                >
                 Add Team
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/Page1"
                >
                  Leaderboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/Page2"
                >
                  Admin
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar