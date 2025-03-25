import jwt from 'jsonwebtoken';

const authMiddlerware = async (req,res,next)=>{
    const {token} = req.headers;
    if(!token){
        return res.json({success:false,message:"Not authorized login again"});
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET); //verifying our token and send it to the req.body
        req.body.userId = token_decode.id;
        next();  //next() moves to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export default authMiddlerware;