import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './page.css'

const Page4 = () => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        

        try {

            const res = await axios.post(
                'https://table-tennis-tournament-five.vercel.app/router/login',
                {
                    email,
                    password
                }
            )
            if(res.data.token){

            alert("Login Successful")

            navigate('/teamform')

        }

        else{

            alert(res.data.message)

        }

            
        }

        catch (err) {

            console.log(err)

            alert("Login Failed")

        }

    }

    return (

        <div className='container w-50 mt-5'>

            <h1 className='text-center text-light mt-3 mb-4'>
                Login
            </h1>

            <form>

                <div className="mb-3">

                    <label className='text-light'>
                        Enter Email
                    </label>

                    <input
                        type="text"
                        placeholder="Enter Email"
                        className='form-control'
                        onChange={(e) => setemail(e.target.value)}
                    />

                </div>

                <div className="mb-3">

                    <label className='text-light'>
                        Enter Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        className='form-control'
                        onChange={(e) => setpassword(e.target.value)}
                    />

                </div>

            </form>

            <button
                className='btn btn-info mb-3'
                onClick={login}
            >
                Login
            </button>

            <p className='text-center text-light mt-3'>

                Not Have Account?

                <Link to="/Page3">
                    Signup
                </Link>

            </p>

        </div>
    )
}

export default Page4