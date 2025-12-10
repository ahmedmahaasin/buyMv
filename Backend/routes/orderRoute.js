import express from 'express'
import { allOders, placeOder, updateOdersStatus, updatePaymentStatus, userOders } from '../controllers/oderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const oderRouter = express.Router()


// admin features
oderRouter.post('/list',adminAuth, allOders)

oderRouter.post('/status',adminAuth, updateOdersStatus)

oderRouter.post('/payment',adminAuth, updatePaymentStatus)


//payment features
oderRouter.post('/place',authUser, placeOder)


// user features
oderRouter.post('/userorder',authUser, userOders)


export default oderRouter
