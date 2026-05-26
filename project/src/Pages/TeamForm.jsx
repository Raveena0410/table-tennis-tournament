import React, { useState } from 'react'
import axios from 'axios'

const TeamForm = () => {

    const [formData, setFormData] = useState({
        team: '',
        member1: '',
        member2: ''
    })

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async(e) => {

        e.preventDefault()

        await axios.post(
            "https://table-tennis-tournament-five.vercel.app/router/addteam",
            formData
        )

        alert("Team Added")
    }

    return (
        <>

        <div className="container mt-5">

            <div className="card p-4">

                <h1 className='text-center mb-4'>
                    Team Registration
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                    type="text"
                    name='team'
                    placeholder='Enter Team Name'
                    className='form-control mb-3'
                    onChange={handleChange}
                    />

                    <input
                    type="text"
                    name='member1'
                    placeholder='Enter Member 1'
                    className='form-control mb-3'
                    onChange={handleChange}
                    />

                    <input
                    type="text"
                    name='member2'
                    placeholder='Enter Member 2'
                    className='form-control mb-3'
                    onChange={handleChange}
                    />

                    <button className='btn btn-primary w-100'>
                        Add Team
                    </button>

                </form>

            </div>

        </div>

        </>
    )
}

export default TeamForm