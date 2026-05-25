import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Form = () => {

  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")

  const [set1A, setSet1A] = useState("")
  const [set1B, setSet1B] = useState("")

  const [set2A, setSet2A] = useState("")
  const [set2B, setSet2B] = useState("")

  const [set3A, setSet3A] = useState("")
  const [set3B, setSet3B] = useState("")

  const [teams, setteam] = useState([])

  // FETCH TEAMS
  const fetchTeams = async () => {

    try {

      const res = await axios.get(
        "https://table-tennis-tournament-five.vercel.app/router/teams"
      )

      setteam(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    fetchTeams()

  }, [])

  // SUBMIT MATCH
  const submitMatch = async () => {

    let teamAWins = 0
    let teamBWins = 0

    // SET 1
    if (Number(set1A) > Number(set1B)) {
      teamAWins++
    }

    else {
      teamBWins++
    }

    // SET 2
    if (Number(set2A) > Number(set2B)) {
      teamAWins++
    }

    else {
      teamBWins++
    }

    // SET 3
    if (Number(set3A) > Number(set3B)) {
      teamAWins++
    }

    else {
      teamBWins++
    }

    // FINAL WINNER
    const winner = teamAWins > teamBWins ? teamA : teamB

    try {

      await axios.post(
        "https://table-tennis-tournament-five.vercel.app/router",
        {

          teamA,
          teamB,

          set: [

            {
              teamA_set: set1A,
              teamB_set: set1B
            },

            {
              teamA_set: set2A,
              teamB_set: set2B
            },

            {
              teamA_set: set3A,
              teamB_set: set3B
            }

          ],

          winner

        }
      )

      alert("Match Submitted Successfully")

    }

    catch (err) {

      console.log(err)
      alert("Error")

    }

  }

  return (

    <>

      <div className="w-50 mx-auto mt-5 card bg-dark p-4">

        {/* TEAM A */}
        <div className="mb-3">

          <label className="form-label text-info">
            Team A
          </label>

          <select
            className="form-select"
            onChange={(e) => setTeamA(e.target.value)}
          >

            <option value="">
              Select Team
            </option>

            {
              teams.map((t, index) => (

                <option
                  value={t.team}
                  key={index}
                >

                  {t.team}

                </option>

              ))
            }

          </select>

        </div>

        {/* TEAM B */}
        <div className="mb-3">

          <label className="form-label text-info">
            Team B
          </label>

          <select
            className="form-select"
            onChange={(e) => setTeamB(e.target.value)}
          >

            <option value="">
              Select Team
            </option>

            {
              teams.map((t, index) => (

                <option
                  value={t.team}
                  key={index}
                >

                  {t.team}

                </option>

              ))
            }

          </select>

        </div>

        {/* SET 1 */}
        <h5 className="text-info">SET 1</h5>

        <input
          type="number"
          placeholder="Team A Score"
          className="form-control mb-2"
          onChange={(e) => setSet1A(e.target.value)}
        />

        <input
          type="number"
          placeholder="Team B Score"
          className="form-control mb-3"
          onChange={(e) => setSet1B(e.target.value)}
        />

        {/* SET 2 */}
        <h5 className="text-info">SET 2</h5>

        <input
          type="number"
          placeholder="Team A Score"
          className="form-control mb-2"
          onChange={(e) => setSet2A(e.target.value)}
        />

        <input
          type="number"
          placeholder="Team B Score"
          className="form-control mb-3"
          onChange={(e) => setSet2B(e.target.value)}
        />

        {/* SET 3 */}
        <h5 className="text-info">SET 3</h5>

        <input
          type="number"
          placeholder="Team A Score"
          className="form-control mb-2"
          onChange={(e) => setSet3A(e.target.value)}
        />

        <input
          type="number"
          placeholder="Team B Score"
          className="form-control mb-4"
          onChange={(e) => setSet3B(e.target.value)}
        />

        <button
          className="btn btn-info"
          onClick={submitMatch}
        >

          Submit Match

        </button>

      </div>

    </>

  )

}

export default Form