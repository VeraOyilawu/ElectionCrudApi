//NESTED MODEL
const express = require("express")
const mongoose = require("mongoose")
const url = "mongodb://localhost/schoolDB"
const PORT = 2019

const app = express()
app.use( express.json())

const electionSchema = new mongoose.Schema({
   state: String,
   parties: [String],
   result: {
     APC: Number,
     PDP: Number,
     LP: Number
   },
   collectionOfficer: String,
   isRiged: Boolean,
   totalLG: Number
  
})

const election = mongoose.model("election", electionSchema)

app.post( "/election", async(req, res) => {
    const newelection = await election.create(req.body)
    res.status(200).json({
       new: newelection
    })
})

app.get("/getAll", async (req, res) => {
    const allElcction = await election.find()

    res.status(200).json( {
        message: "The available election in my database are: " + allElcction.length,
        data: allElcction
    })
})

app.get("/getone/:id" ,async (req, res) => {
    const getOne = await election.findById(req.params.id)
    res.status(200).json( {
        message:" the one election",
        data: getOne
    })
})

app.put( "/update/:id", async(req, res) => {
    try {
        const id = req.params.id
    const oldData = await election.findById(id)
    const updatestudent = {
        state: req.body.state || oldData.state,
        parties: req.body.parties || oldData.parties,
        result:{
            APC:  req.body.APC  || oldData.result.APC,
            PDP:  req.body.PDP || oldData.result.PDP,
            LP:  req.body.LP || oldData.result.LP
        },
        collectionOfficer: req.body.collectionOfficer || oldData.collectionOfficer,
        isRiged: req.body.isRiged || oldData.isRiged,
        totalLG: req.body.totalLG || oldData.totalLG
        }
    
     await election.updateOne(updatestudent, {new: true});
     if (updatestudent){
        res.status(200).json({
            message: `this ${id} has been updated`,
            data: updatestudent
        })
     } else {
        res.status(400).json({
            Error: "error updating student"
        })
     }
    } catch (error) {
      res.status(400).json({
        message: error.message
      })  
    }
})

app.delete ("/delete/:id", async (req, res) => {
    const id = req.params.id
    const deleteStudent = await election.findByIdAndDelete((id)) 

    res.status(200).json( {
        message : `This info: ${id} has been deleted`,
        data : deleteStudent
    })
})



mongoose.connect(url).then(()=>{
    console.log('conneected.............')
}).catch(()=>{
    console.log('connection failed...')
})


app.listen( PORT, () => {
    console.log(`listening to port ${PORT}`);
})