import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Matches = () => {

  const [matches, setMatches] = useState([])
  const [teams, setteams] = useState([])

  // FETCH MATCHES
  const fetchMatches = async () => {

    try {

      const res = await axios.get(
        "https://table-tennis-tournament-five.vercel.app/router"
      )

      setMatches(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  // FETCH TEAMS
  const fetchteams = async () => {

    try {

      const res = await axios.get(
        "https://table-tennis-tournament-five.vercel.app/router/teams"
      )

      setteams(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    fetchMatches()
    fetchteams()

  }, [])

  return (

    <div>

      {

        teams.map((team, index) => {

          // FILTER MATCHES
 const filteredMatches = matches.filter(

  (item) =>

    (
      item.teamA === team.team ||
      item.teamB === team.team
    )

    &&

    item.winner !== ""

)

          return (

            <div key={index}>

              {/* TEAM NAME */}
              <h2 className='text-center text-info mt-5'>
                {team.team}
              </h2>

              <table className="table table-dark table-hover w-75 mx-auto text-center">

                <thead>

                  <tr>

                    <th>Opponent Team</th>
                    <th>Set 1</th>
                    <th>Set 2</th>
                    <th>Set 3</th>
                    <th>Winner</th>

                  </tr>

                </thead>

                <tbody>

                  {

                    filteredMatches.map((item, i) => (

                      <tr key={i}>

                        {/* OPPONENT TEAM */}
                        <td>

                          {

                            item.teamA === team.team
                              ? item.teamB
                              : item.teamA

                          }

                        </td>

                        {/* SET 1 */}
                        <td>

                          {

                            item.set[0]

                              ?

                              `${item.set[0].teamA_set} - ${item.set[0].teamB_set}`

                              :

                              "-"

                          }

                        </td>

                        {/* SET 2 */}
                        <td>

                          {

                            item.set[1]

                              ?

                              `${item.set[1].teamA_set} - ${item.set[1].teamB_set}`

                              :

                              "-"

                          }

                        </td>

                        {/* SET 3 */}
                        <td>

                          {

                            item.set[2]

                              ?

                              `${item.set[2].teamA_set} - ${item.set[2].teamB_set}`

                              :

                              "-"

                          }

                        </td>

                        {/* WINNER */}
                        <td>

                          {item.winner}

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          )

        })

      }

    </div>

  )

}

export default Matches