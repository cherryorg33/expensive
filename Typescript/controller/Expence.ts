import { Router } from "express";
import { Request,Response,NextFunction } from "express";
import ExpensivModel from "../models/Expence";
import UserModel from "../models/User";
const router = Router()



///Added Expensive
router.post('/add/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id :string = req.params.id as string;
    try{
        const {title, amount, category, description, date}  = req.body
        if(amount <0) {
            return res.status(400).json({
                success:false,
                message:"amount is postive intiger"
            })
        }
        const NewExpensive = await ExpensivModel.create({
            user:id,
            title,
             amount, 
             category, 
             description, 
             date:Date.now()
        })
        if(NewExpensive){
            return res.status(201).json({
                success:true,
                message:"Expensive Added"
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
        
    }
})

///get the expensive
router.get('/get/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id : string = req.params.id as string
    try{
        const User = await UserModel.findById(id)
        if(!User){
            return res.status(404).json({
                success:false,
                message:"internal server error"
            })
        }else{
            const expensives = await ExpensivModel.find({user:id}).exec()
            if(expensives.length === 0){
                return res.status(404).json({
                    success:false,
                    message:"no expensive found"
                })
            }else{
                return res.status(200).json({
                    success:true,
                    expensives:expensives
                })
            }
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
        
    }
})

///delete the expensive
router.delete('/delete/:userid/:expensiveid',async(req:Request,res:Response,next:NextFunction)=>{
    const userid : string = req.params.userid as string
    const expensiveid : string = req.params.expensiveid as string
    try{
        const User = await UserModel.findById(userid)
        if(!User){
            return res.status(404).json({
                success:false,
                message:"internal server error"
            })
        }
        const responce = await ExpensivModel.findByIdAndDelete(expensiveid)
        if(responce){
            return res.status(200).json({
                success:true,
                message:"deleted successfully"
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})


export default router