import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Team.css'

const Team = () => {

    const [teams, setTeams] = useState([])

    const fetchTeams = async() => {

        const res = await axios.get(
            "http://localhost:3000/router/teams"
        )

        setTeams(res.data)
    }

    useEffect(() => {
        fetchTeams()
    }, [])

    return (
        <>

        <div className="card3">

            <h1>Participating Teams</h1>

          <div className="cards">

   {
      teams.map((t,index)=>(

         <div className="card1" key={index}>

            <h1>{t.team}</h1>

            <ul>
               <li>{t.member1}</li>
               <li>{t.member2}</li>
            </ul>

         </div>

      ))
   }

</div>
        </div>

        </>
    )
}

export default Team