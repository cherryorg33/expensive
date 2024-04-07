import express ,{json,urlencoded} from "express";
import mongoose from "mongoose"
import cors from 'cors'
import bodyParser from "body-parser";
import UserRouter from './controller/User';
import Expensive from './controller/Expence';
import Income from './controller/Income'

const PORT = 4500
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())





mongoose.connect("mongodb://localhost:27017/expensive").then(()=>{
    console.log("database connected")
    app.listen(PORT,()=>{
        console.log(`server is running the ${PORT}`)
    })
})



app.use('/user',UserRouter)
app.use('/expensive',Expensive)
app.use('/income',Income)