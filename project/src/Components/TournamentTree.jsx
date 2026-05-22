import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const TournamentTree = () => {

   const [teams, setTeams] = useState([])

   const [matches, setMatches] = useState([])

   const [selectedDate, setSelectedDate] =
   useState(new Date())


   // FETCH TEAMS
   const fetchTeams = async () => {

      try {

         const res = await axios.get(
            "http://localhost:3000/router/teams"
         )

         setTeams(res.data)

      }

      catch (err) {

         console.log(err)

      }

   }


   // FETCH MATCHES
   const fetchMatches = async () => {

      try {

         const res = await axios.get(
            "http://localhost:3000/router/matches"
         )

         setMatches(res.data)

      }

      catch(err){

         console.log(err)

      }

   }


   useEffect(() => {

      fetchTeams()

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

         // FETCH UPDATED MATCHES AGAIN
         fetchMatches()

      }

      catch(err){

         console.log(err)

      }

   }


   return (

      <div className="container text-light mt-5">

         <h1 className="text-center mb-5">

            Tournament Tree

         </h1>


         {/* CALENDAR */}

         <div className="d-flex justify-content-center mb-5 pb-5">

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

         <div className="mb-5">

            <h2 className="text-info mb-4">

               Matches

            </h2>

            {

               matches.map((item) => (

                  <div

                     key={item._id}

                     className="border rounded p-3 mb-3"

                  >

                     <h5>

                        {item.teamA}

                        {" vs "}

                        {item.teamB}

                     </h5>

                     <p>

                        Date :

                        {" "}

                        {

                           item.date

                           ?

                           new Date(item.date)
                           .toDateString()

                           :

                           "Not Scheduled"

                        }

                     </p>

                     <button

                        className="btn btn-warning"

                        onClick={() =>
                           rescheduleMatch(item._id)
                        }

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