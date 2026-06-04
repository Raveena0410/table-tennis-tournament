import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './Lead.css'

const Leader_board = () => {

  const [data, setData] = useState(() => {

  const saved =
  localStorage.getItem("leaderboard")

  return saved
    ? JSON.parse(saved)
    : []

})

  const fetchLeaderboard = async () => {

    try {

      const res = await axios.get("https://table-tennis-tournament-five.vercel.app/router/lead")

      setData(res.data)

localStorage.setItem(
  "leaderboard",
  JSON.stringify(res.data)
)

    }

    catch (err) {

      console.log(err)

    }

  }

 useEffect(() => {

  fetchLeaderboard()


},[])
  return (

    <>

      <div>

        <h1 className='cb'>Leaderboard</h1>

        <table className='table table-dark table-hover tb'>

          <thead>

            <tr>

              <th>Team</th>
              <th>Played</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Score</th>
              
              <th>Ratio</th>

            </tr>

          </thead>
          <tbody>

{
  data.length > 0 ? (

    data.map((item) => (

      <tr key={item._id}>

        <td>{item.team}</td>
        <td>{item.played}</td>
        <td>{item.won}</td>
        <td>{item.lost}</td>
        <td>{item.score}</td>
        <td>{item.ratio}</td>

      </tr>

    ))

  ) : (

    <tr>

      <td colSpan="5">
        No leaderboard data
      </td>

    </tr>

  )
}

</tbody>


        </table>

      </div>

    </>

  )
}

export default Leader_board