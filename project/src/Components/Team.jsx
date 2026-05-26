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

           {
   teams.map((t,index)=>(

      <div key={index}>

         <h1 style={{color:"white"}}>

            {t.team}

         </h1>

         <p style={{color:"white"}}>

            {t.member1}

         </p>

         <p style={{color:"white"}}>

            {t.member2}

         </p>

      </div>

   ))
}

        </div>

        </>
    )
}

export default Team