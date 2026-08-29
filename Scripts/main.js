// Get Data from HTML
const password = document.getElementById("password");
const error = document.getElementById("error");
const sendingScreen = document.getElementById("sendingScreen");

// Function for Make a request to backend
async function sendToBackend(){
    
    // URLs
    const API_URL = "https://mr-sky-backend-feh5.onrender.com";
    const localURL = "http://127.0.0.1:5000"
    
    // Start Sending Animation
    error.textContent = "";
    sendingScreen.style.display = "flex";
    
    // Try
    try{
        
        // Fetch URL
        const response = await fetch(
            `${API_URL}/login`, {
            
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password.value
            })
        });
        
        /*
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Text:", text)*/
        
        // End Sending Animation
        sendingScreen.style.display = "none";
        
        // Clear Input
        password.value = "";
        
        // Make Data
        const data = await response.json();
        
        // If Login Successful
        if (response.ok){
            
            // Erase Error
            error.textContent = "";
            
            // Store Session Token
            sessionStorage.setItem("mr_sky_token", data.token);
            
            // Switch to Mr. Sky
            window.location.href = `${API_URL}/sky.html`;
        }else{
            
            // Make error
            error.innerHTML = `${data.text}`;
            error.style.display = "block";
        }
    }
    
    // Catch Error
    catch(error){
        
        console.error("Error Name", error.name);
        console.error("Error Message", error.message);
    }
    
}

// Control for Keyboard
password.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendToBackend();
    }
});
