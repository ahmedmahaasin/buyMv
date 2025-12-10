import mongoose from "mongoose"

const subCategorySchema = new mongoose.Schema({ 
    cat_name: {type:String, required:true},
    cat_image:{type:String, required:true},
    show_home:{type:Boolean, required:true},
    date: { type: Number, required: true }
})

const subCategoryModle = mongoose.models.sSubcategories || mongoose.model('Subcategories',subCategorySchema)


export default subCategoryModle