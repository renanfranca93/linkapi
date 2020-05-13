import mongoose from 'mongoose';

//criando schema do mongo
 var dealSchema = new mongoose.Schema({
    dealId: Number,
    userId: Number,
    userName: String,
    orgName: String,
    value: Number,
    date: Date,
  
  });
  
//criando model 
var Deal = mongoose.model("Deal", dealSchema);

export {dealSchema, Deal}


