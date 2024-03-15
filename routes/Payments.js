const router = require("express").Router();
const razorpay = require("razorpay");
const crypto = require("crypto")

router.post("/orders" , async (req,res) =>{
    try{
        const instance = new razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount : req.body.amount * 100,
            currency : "INR",
            receipt : crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error,order) => {
            if(error){
                console.log(error);
                return res.status(500).json({message: "something went wrong!"});
            }
            res.status(200).json({data: order});
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
});


router.post("/verify", async (req,res) => {
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature} = req.body;
        const sign = razorpay_order_id +""+razorpay_payment_id;
        const expectedsign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

        if(razorpay_signature === expectedsign){
            return res.status(200).json({message: "Payment Verified Sucessfully"});
        }
        else{
            return res.status(400).json({message:"Invalid signature sent!"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "internal server error"});
    }
});

module.exports = router;