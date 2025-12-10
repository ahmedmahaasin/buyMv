import jwt from 'jsonwebtoken'


const adminAuth  = async (req,res, next) => {

    try {
        
        const {token} =req.headers
        if (!token) {
            return res.json({success:false , message: "Not authorized, please login again"})
            
        } 
        const token_decode = jwt.verify(token, process.env.JWTSECRET);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false , message: "Not authorized, please login again"})
        }
        next()
    } catch (error) {
         console.error(error);
         res.json({ success: false, message: error.message });
        
    }
}

export default adminAuth
