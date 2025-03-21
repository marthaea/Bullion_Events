document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page reload

        // Get form values
        const fname = document.getElementById("fname").value;
        const lname = document.getElementById("lname").value;
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        try {
            const response = await fetch(
                "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendEmailAndSaveToFirestore",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ fname, lname, email, subject, message })
                }
            );

            if (!response.ok) throw new Error("Failed to send message");

            alert("Message sent successfully!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert("Error sending message.");
        }
    });
});
