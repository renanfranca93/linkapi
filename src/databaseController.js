import mongoose from 'mongoose';

//criando schema do mongo
 var dealSchema = new mongoose.Schema({
    deal_id: Number,
    user_id: Number,
    user_name: String,
    name: String,
    value: Number,
    date: Date,
  
  });
  
//criando model 
var Deal = mongoose.model("Deal", dealSchema);

export {dealSchema, Deal}


