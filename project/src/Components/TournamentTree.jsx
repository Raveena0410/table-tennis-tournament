// =======================
// FRONTEND - TournamentTree.jsx
// =======================

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const TournamentTree = () => {

  const [selectedDate, setSelectedDate] = useState(new Date())

  const [matches, setMatches] = useState([])

  // FETCH MATCHES
  const fetchMatches = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3000/router/matches"
      )

      setMatches(res.data)

    }

    catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    fetchMatches()

  }, [])

  // RESCHEDULE MATCH
  const rescheduleMatch = async (id) => {

    try {

      await axios.put(

        `http://localhost:3000/router/reschedule/${id}`,

        {
          date: selectedDate
        }

      )

      fetchMatches()

    }

    catch (err) {

      console.log(err)

    }

  }

  return (

    <div className="container mt-5 text-light">

      <h1 className="text-center mb-5">
        Tournament Schedule
      </h1>

      {/* CALENDAR */}

      <div className="d-flex justify-content-center mb-5">

        <Calendar

          onChange={setSelectedDate}

          value={selectedDate}

          tileDisabled={({ date }) => {

            return (

              date.getDay() === 0 ||
              date.getDay() === 6

            )

          }}

        />

      </div>

      {/* MATCHES */}

      {

        matches.map((item, index) => (

          <div
            key={index}
            className="border p-3 rounded mb-3"
          >

            <h4>

              {item.teamA} vs {item.teamB}

            </h4>

            <p>

              Date :

              {

                new Date(item.date)
                  .toDateString()

              }

            </p>

            <button

              className="btn btn-warning"

              onClick={() =>
                rescheduleMatch(item._id)
              }

            >

              Reschedule

            </button>

          </div>

        ))

      }

    </div>

  )

}


export default TournamentTree