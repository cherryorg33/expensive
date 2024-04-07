import {Router} from 'express'
import { Request,Response,NextFunction } from 'express'
import UserModel from '../models/User'
import multer from 'multer'
import {v4 as uuidv4} from 'uuid'
import path from 'path'
const router = Router();




const Storage = multer.diskStorage({
    destination:"Users",
    filename:(req:any,cb:any,file:any)=>{
        const unnifix = uuidv4()
        const fileExtansaction = path.extname(file.originalname)
        cb(null,file.field + "-" + unnifix + fileExtansaction)
    }
});

const upload = multer({storage:Storage})

interface register {
    full_name?:string,
    email?:string
    password?:string
}



//user register
router.post("/register",upload.single("image"),async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {full_name,email,password} : register = req.body
        const Exictinguser = await UserModel.find({email:email})
        if(Exictinguser){
            return res.status(400).json({
                success:false,
                message:"email alresdy exict"
            })
        }else{
            const Newuser = await UserModel.create({
                email:email,
                password:password,
                full_name:full_name,
                image:req.file?.filename
            })
            if(!Newuser){
                return res.status(400).json({
                    success:false,
                    message:"some wnt wroung try after some time"
                })
            }else{
                return res.status(201).json({
                    success:true,
                    message:"Registerd successfully"
                })
            }
            
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})



//user login
router.post("/login",async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} : register = req.body;
        const User = await UserModel.findOne({email:email,password:password})
        if(!User){
            return res.status(404).json({
                success:false,
                message:"invalid credentials"
            })
        }else{
            return res.status(200).json({
                succes:true,
                message:"Login Successfull",
                User:User
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})


router.get("/profile/:id",async(req:Request,res:Response,next:NextFunction)=>{
    const id : string = req.params.id as string
    try{
        const User = await UserModel.findById(id)
        if(!User){
            return res.status(404).json({
                success:false,
                message:"no user found"
            })
        }else{
            return res.status(200).json({
                success:true,
                User:User
            })
        }


    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})



export default router