import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './Lead.css'

const Leader_board = () => {

  const [data, setData] = useState([])

  const fetchLeaderboard = async () => {

    try {

      const res = await axios.get("http://localhost:3000/router/lead")

      setData(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    fetchLeaderboard()

  }, [])

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
              
              <th>Ratio</th>

            </tr>

          </thead>

          <tbody>

            {
              data.map((item, index) => (

                <tr key={item._id}>

                  <td>{item.team}</td>
                  <td>{item.played}</td>
                  <td>{item.won}</td>
                  <td>{item.lost}</td>
                  
                  <td>{item.ratio}</td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </>

  )
}

export default Leader_board