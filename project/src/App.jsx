import './App.css'

import Navbar from './Components/Navbar'
import Team from './Components/Team'
import Lead from './Components/Leader_board'
import Tree from './Components/TournamentTree'

import Page1 from './Pages/Page1'
import Page2 from './Pages/Page2'
import Page3 from './Pages/Page3'
import Page4 from './Pages/Page4'
import TeamForm from './Pages/TeamForm'

import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>

      <Routes>

        {/* LOGIN / SIGNUP */}
        <Route
          path="/"
          element={<Page4 />}
        />

        {/* PAGE 3 */}
        <Route
          path="/Page3"
          element={<Page3 />}
        />

        {/* TEAM FORM */}
        <Route
          path="/teamform"
          element={
            <>
              <Navbar />
              <TeamForm />
            </>
          }
        />

        /* {/* HOME */}
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Team />
              <Lead />
              <Tree />
            </>
          }
        /> */

        {/* PAGE 1 */}
        <Route
          path="/Page1"
          element={
            <>
              <Navbar />
              <Page1 />
            </>
          }
        />

        {/* PAGE 2 */}
        <Route
          path="/Page2"
          element={
            <>
              <Navbar />
              <Page2 />
            </>
          }
        />

      </Routes>

    </>
  )
}

export default App
