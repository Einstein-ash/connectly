import mongoose, { mongo } from "mongoose"

const connectToMongoDB = async() => {

    try{
      const res = await mongoose.connect(process.env.MONGO_DB_URI);
      if(res){
        console.log("Connection Successfull With MONGO DB")
      }


    }catch(err){
        console.log("connection failed with MONGO")
    }
}

export default connectToMongoDB