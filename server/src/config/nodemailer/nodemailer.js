import nodemailer from "nodemailer"

 async function sendMail({to ,subject,text}){
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

 const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
    
  });
  console.log("Message sent:", info.messageId);
 }

 export default sendMail