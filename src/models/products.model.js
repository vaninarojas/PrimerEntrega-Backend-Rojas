import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "products";

const schema = new mongoose.Schema({
    title: {type: String, required: true}, 
    description: {type: String, required:true},
    price: {type: Number, required:true},
    thumbnail: {type: String, required:true},
    code: {type: Number, required:true},
    stock: {type: String, required:true},

});

const model = mongoose.model(collection, schema);

export default model;


