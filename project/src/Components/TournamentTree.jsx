import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Calendar from 'react-calendar'

const TournamentTree = () => {

   const [matches, setMatches] = useState([])

   const [selectedDate, setSelectedDate] =
   useState(new Date())


   // FETCH MATCHES

   const fetchMatches = async () => {

      try {

         const res = await axios.get(
            "https://table-tennis-tournament-five.vercel.app/router/matches"
         )

         setMatches(res.data)

      }

      catch(err){

         console.log(err)

      }

   }


   useEffect(() => {

      fetchMatches()

   }, [])



   // RESCHEDULE MATCH

   const rescheduleMatch = async (id) => {

      try {

         // SELECTED DATE ONLY

         let newDate = new Date(

            selectedDate.getFullYear(),

            selectedDate.getMonth(),

            selectedDate.getDate()

         )


         // STORE ONLY DATE

         const formattedDate =
         `${newDate.getFullYear()}-${
         String(newDate.getMonth() + 1)
         .padStart(2,'0')
         }-${
         String(newDate.getDate())
         .padStart(2,'0')
         }`


         await axios.put(

            `https://table-tennis-tournament-five.vercel.app/router/reschedule/${id}`,

            {
               date: formattedDate
            }

         )


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

         <div className="mb-5">

            <Calendar

               onChange={(value) => {

                  if (Array.isArray(value)) {

                     setSelectedDate(value[0])

                  }

                  else {

                     setSelectedDate(value)

                  }

               }}

               value={selectedDate}

               view="month"

               maxDetail="month"

               minDetail="month"

               selectRange={false}

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

                           item.date

                           :

                           "Not Scheduled"

                        }

                     </p>
                     <p>

   Status :

   {

      item.winner !== ""

      ?

      <span className="text-success fw-bold">

         Completed

      </span>

      :

      <span className="text-warning fw-bold">

         Pending

      </span>

   }

</p>



                     <button

                        className="btn btn-warning"

                        onClick={() =>
                           rescheduleMatch(
                              item._id
                           )
                        }

                     >

                        Reschedule Match

                     </button>

                  </div>

               ))

            }

         </div>



         {/* SEMI FINAL */}

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