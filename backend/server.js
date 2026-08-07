const express = require("express");
const cors = require("cors");

const interviewRoute = require("./routes/interview");


const app = express();


app.use(cors());

app.use(express.json());


app.use("/api/interview", interviewRoute);



app.get("/", (req,res)=>{
    res.send("AI Interview Agent Backend Running");
});



const PORT = 5000;


app.listen(PORT,()=>{
    console.log(
      `Server running on port ${PORT}`
    );
});