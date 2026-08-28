// Get Data from HTML
const password = document.getElementById("password");
const error = document.getElementById("error");

// Function for Make a request to backend
async function sendToBackend(){
    
    // URLs
    API_URL = "https://mr-sky-backend-feh5.onrender.com";
    localURL = "http://127.0.0.1:5000"
    
    // Try
    try{
        
        // Fetch URL
        const response = await fetch(`${API_URL}/login`, {
            
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password.value
            })
        });
        
        // Clear Input
        password.value = "";
        
        // Make Data
        const data = await response.json();
        
        // If Login Successful
        if (response.ok){
            
            // Store Session Token
            sessionStorage.setItem("mr_sky_token", data.token);
            
            // Switch to Mr. Sky
            window.location.href = "sky.html";
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
