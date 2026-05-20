import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const TournamentTree = () => {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const[matchdate,setmatchdate]=useState("")
  const res=async function(){
    await axios.post("",{
      date
    })
  }

  const [matches, setMatches] = useState([

    {
      id: 1,
      day: "Day 1",
      teams: "Team1 vs Team2",
      date: "1 Aug 2026"
    },

    {
      id: 2,
      day: "Day 1",
      teams: "Team3 vs Team4",
      date: "1 Aug 2026"
    },

    {
      id: 3,
      day: "Day 2",
      teams: "Team1 vs Team3",
      date: "2 Aug 2026"
    },

    {
      id: 4,
      day: "Day 2",
      teams: "Team2 vs Team5",
      date: "2 Aug 2026"
    },

    {
      id: 5,
      day: "Day 3",
      teams: "Team1 vs Team4",
      date: "3 Aug 2026"
    },

    {
      id: 6,
      day: "Day 3",
      teams: "Team3 vs Team5",
      date: "3 Aug 2026"
    },

    {
      id: 7,
      day: "Day 4",
      teams: "Team1 vs Team5",
      date: "4 Aug 2026"
    },

    {
      id: 8,
      day: "Day 4",
      teams: "Team2 vs Team4",
      date: "4 Aug 2026"
    },

    {
      id: 9,
      day: "Day 5",
      teams: "Team2 vs Team3",
      date: "5 Aug 2026"
    },

    {
      id: 10,
      day: "Day 5",
      teams: "Team4 vs Team5",
      date: "5 Aug 2026"
    }

  ])

  const rescheduleMatch = (id) => {

    const updatedMatches = matches.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          date: selectedDate.toDateString()
        }

      }

      return item
    })

    setMatches(updatedMatches)
  }

  return (

    <div className="container text-light mt-5">

      <h1 className="text-center mb-5">
        Tournament Tree
      </h1>

      {/* CALENDAR */}

      <div className="d-flex justify-content-center mb-5">

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />

      </div>

      {/* MATCHES */}

      <div className="mb-5">

        <h2 className="text-info mb-4">
          Matches
        </h2>

        {
          matches.map((item) => (

            <div
              key={item.id}
              className="border rounded p-3 mb-3"
            >

              <h5>
                {item.day}
              </h5>

              <p>
                {item.teams}
              </p>

              <p>
                Date : {item.date}
              </p>

              <button
                className="btn btn-warning"
                onClick={() => rescheduleMatch(item.id)}
              >

                Reschedule Match

              </button>

            </div>

          ))
        }

      </div>

      {/* SEMI FINALS */}

      <div className="mb-5">

        <h2 className="text-warning mb-4">
          Semi Finals
        </h2>

        <pre className="text-light">

{`
Rank 1  ───────────┐
                   ├── Winner SF1
Rank 4  ───────────┘


Rank 2  ───────────┐
                   ├── Winner SF2
Rank 3  ───────────┘
`}

        </pre>

      </div>

      {/* FINAL */}

      <div>

        <h2 className="text-danger mb-4">
          Final
        </h2>

        <pre className="text-light">

{`
Winner SF1 ────────┐
                    ├── Champion
Winner SF2 ────────┘
`}

        </pre>

      </div>

    </div>

  )
}

export default TournamentTree