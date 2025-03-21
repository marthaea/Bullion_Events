const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true }); // Allow CORS for frontend requests

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Setup Nodemailer email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",  // Replace with your Gmail
        pass: "your-app-password"     // Generate an App Password in Gmail
    }
});

// Cloud Function to handle form submissions
exports.sendEmailAndSaveToFirestore = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== "POST") {
                return res.status(405).send("Method Not Allowed");
            }

            const { fname, lname, email, subject, message } = req.body;

            // Save data to Firestore
            const docRef = await db.collection("messages").add({
                fname,
                lname,
                email,
                subject,
                message,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log("Message stored with ID:", docRef.id);

            // Send email notification
            const mailOptions = {
                from: "your-email@gmail.com",
                to: "your-email@gmail.com", // Change to your email
                subject: `New Message from ${fname} ${lname}`,
                text: `From: ${email}\n\n${message}`
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).send("Message sent and stored!");
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).send("Error processing your request.");
        }
    });
});
