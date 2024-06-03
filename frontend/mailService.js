// let body = document.querySelector("body");
let clickCount = 0;
let timeout;

// body.addEventListener("click", function () {
//     clickCount++;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//         clickCount = 0;
//     }, 3000);

//     if (clickCount === 3) {
//         console.log("Three clicks within three seconds detected!");
//         askForEmailDetails();
//     }
// });

function speak(text) {
    return new Promise((resolve, reject) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = resolve;
            utterance.onerror = (event) => {
                console.error("Speech synthesis error", event);
                console.log("Speech synthesis failed: " + event.error);
                reject(event.error);
            };
            speechSynthesis.speak(utterance);
        } else {
            console.log("Sorry, your browser doesn't support text to speech!");
            reject("Speech synthesis not supported");
        }
    });
}

async function askForEmailDetails() {
    try {
        await speak("Please say the sender email address. Don't include @gmail.com.");
        let sourceEmail = await getVoiceInput();
        document.getElementById("senderemail").value = validateEmail(sourceEmail);

        await speak("Please say the receiver email address. Don't include @gmail.com.");
        let destinationEmail = await getVoiceInput();
        document.getElementById("recieveremail").value = validateEmail(destinationEmail);

        await speak("Please say the subject.");
        let subject = await getVoiceInput();
        document.getElementById("subject").value = subject;

        await speak("Please say your message.");
        let message = await getVoiceInput();
        document.getElementById("message").value = message;
    } catch (error) {
        console.error("Error in askForEmailDetails:", error);
        // console.log("An error occurred: " + error);
    }
}

function getVoiceInput() {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Sorry, your browser doesn't support speech recognition!");
            return reject("Speech recognition not supported");
        }
        

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.onstart = () => {
            console.log("Voice recognition started. Speak into the microphone.");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voice input: " + transcript);
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Voice recognition error", event);
            // alert("Voice recognition error: " + event.error);
            reject("Voice recognition error");
        };

        recognition.onend = () => {
            console.log("Voice recognition ended.");
        };

        recognition.start();
    });
}

// async function tripleTap() {
//     console.log("Triple tap instruction spoken.");
//     await speak("Triple tap anywhere on screen to send mail through voice");
// }

function onPageLoad() {
    console.log("Page has started loading");
    document.getElementById("instructionButton").addEventListener("click", async () => {
        await askForEmailDetails();
        // await tripleTap();
    });
    console.log('Page is fully loaded');
}

window.addEventListener('load', onPageLoad);

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let senderemail = document.getElementById('senderemail').value;
    let recieveremail = document.getElementById('recieveremail').value;
    let subject = document.getElementById('subject').value;
    let message = document.getElementById('message').value;

    senderemail = validateEmail(senderemail);
    recieveremail = validateEmail(recieveremail);

    const data = {
        senderemail: senderemail,
        recieveremail: recieveremail,
        subject: ` ${senderemail} : ${subject} ` ,
        message: message
    };

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Email sent successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        // alert('Failed to send email: ' + error.message);
    });
});

function validateEmail(email) {
    email = email.replace(/\s+/g, '');
    if (!email.includes('@gmail.com')) {
        email += '@gmail.com';
    }
    return email;
}
