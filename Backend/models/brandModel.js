import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({ 
    Brand_name: {type:String, required:true},
    Brand_image:{type:String,},
    show_home:{type:Boolean},
    date: { type: Number, required: true }
})

const brandModel = mongoose.models.Brands || mongoose.model('Brands',brandSchema)

export default brandModel