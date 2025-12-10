import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({ 
    cat_name: {type:String, required:true},
    cat_image:{type:String, required:true},
    show_home:{type:Boolean},
    date: { type: Number, required: true }
})

const categoryModel = mongoose.models.categories || mongoose.model('categories',categorySchema)

export default categoryModel