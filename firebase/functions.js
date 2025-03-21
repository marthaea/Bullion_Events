const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Email configuration (replace with your email & app password)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "marthapraisekatusiime721@.com",
        pass: "your-app-password"
    }
});

exports.sendEmail = functions.https.onRequest((req, res) => {
    const { fname, lname, email, subject, message } = req.body;

    const mailOptions = {
        from: email,
        to: "marthapraisekatusiime721@.com",
        subject: `New Message from ${fname} ${lname} - ${subject}`,
        text: `You received a message from:\n\nName: ${fname} ${lname}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        return res.status(200).send("Message sent successfully!");
    });
});
