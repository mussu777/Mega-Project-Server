const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

    otp:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }

});




// a function -> to send emails
async function sendVerificationEmail(email, otp){
    try{

        const mailResponse = await mailSender (email, "Verification Email from StudyNotion" , emailVerificationTemplate(otp));
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error){
        console.log("Error occured while sending mails: ", error);
        throw error;

    }
}


OTPSchema.pre("save" , async function(next) {
    // this.email and this.otp is used bcoz we are sending an email when a document is created
    await sendVerificationEmail(this.email, this.otp);
    next();
})


// module.exports = mongoose.model("OTP" , OTPSchema);

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;