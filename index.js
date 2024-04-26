const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/Payments");
const { MongoClient } = require('mongodb');
const app = express();
const sendMail = require('./utils/SendMail')


dotenv.config();

// middleware
app.use(express.json());
app.use(cors(
    {
        origin : "*",
        methods : ["POST","GET"],
        credentials : true
    }
));

client = new MongoClient('mongodb+srv://admin:admin@cluster0.rbtlcxt.mongodb.net/?retryWrites=true&w=majority')
client.connect();
const db = client.db('pet-adoption')
const col = db.collection('user-data')

// using routes
app.use("/api/payment/", paymentRoutes);

app.post('/insert', async (req,res)=>{
    try{
        const user = await col.findOne({email:req.body.email})
        if(user)
        {
            res.send('exists')
        }
        else 
        {
            const { name, email, password, phno } = req.body;
            await col.insertOne({ name, email, password, phno });
            res.send("datareceived")
        }
    }
    catch(e){
        console.log(e)
    }

})
app.post('/fetch', async (req,res)=>{
    try{
        const user = await col.findOne({email:req.body.email})
        if(user)
        {
            if(user.password == req.body.password)
            {
                res.send('loginsuccess')
            }
            else
            {
                res.send('wrongdetails');
            }
        }
        else 
        {
            res.send('notexists');
        }
    }
    catch(e)
    {
        console.log(e);
    }
})
// listening
const port = 8000;
app.listen(port, () => console.log('Listening to the port 8000'));

//sibd jake oskn aasm mail app passkey
//examportala2@gmail.com

app.post('/api/sendMail',async (req,res)=>{
    const{email,message,subject} = req.body

    try{
        const sent_to = "examportala2@gmail.com"
        const sent_from = email
        const reply_to = email
        const mailsubject = subject
       
        const textMessage = message
        await sendMail(mailsubject,  textMessage,sent_to, sent_from, reply_to);
        res.status(200).json({success:true,message:"Email sent successfully"})
    }
    catch(err){
        res.status(500).json(err.message)
    }
})

app.post('/sendmessage', async (req, res) => {
    try {
        var accountSid = 'ACeaf3703aec504e94a67c7e65e1c680cb';
        var authToken = 'f56a6d0359250cf738481afcc75c7206';

        // require the Twilio module and create a REST client
        var client = require('twilio')(accountSid, authToken);

        // Format the phone number to E.164 format
        var phoneNumber = `+917981864952`;

        client.messages.create({
            to: phoneNumber,
            from: "+13256030719",
            body: "Thank you for choosing the pet connect, You Have been short listed for the adoption",
        })
        .then(message => {
            console.log(message.sid);
            res.send({ success: true, message: "Message sent successfully" });
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send({ success: false, message: "Failed to send message" });
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
});

app.post('/adoptdata', async (req,res)=>{
    try{
        const col2 = db.collection('adopt-data')
        const response = await col2.insertOne({name:req.body.name,email:req.body.email,phno:req.body.phno,reason:req.body.reason,salary:req.body.salary,address:req.body.address})
        res.send('submit')
    }
    catch(e)
    {
        console.log(e)
    }
})
<<<<<<< HEAD

app.post('/addproduct', async (req,res)=>{
    try{
        const col3 = db.collection('products')
        await col3.insertOne(req.body);
        res.send("datareceived")
    }
    catch(e){
        console.log(e)
    }

})
=======
>>>>>>> 8e61a082e70834be3d9ef98dd91a29f6e4c558cd
