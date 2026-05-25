require('dotenv').config()
const express=require('express')
const app=express()
const port=3000
const route=require('./route/route')
const connectdb=require('./config/config')
const cors=require('cors')
app.use(express.json())
app.use(cors())
connectdb()

app.get("/", ()=> {
    return "I am serving on port 3000"
});

app.use('/router',route)
app.listen(port,()=>{
    console.log(`port is listen on ${port}`)
})
