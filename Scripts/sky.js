// Get HTML content 
const log = document.getElementById("log");
const input = document.getElementById("input");
const reply = document.getElementById("reply");
const requestCount = document.getElementById("requestCount");

// Variables
let requests = 0;

// Function for Getting Current Local Time
function time() {

    // Return Time
    return new Date()
        .toLocaleTimeString();
}

// Add activity log
function addLog(text, cls = "", addCircle = false) {

    // Create Element 
    const line = document.createElement("div");

    // Add Attributes & Edit HTML
    line.className = "line";
    line.innerHTML = `
        
        <span class = "time">
            [${time()}]
        </span>
        <span class = "${cls}">
            ${text}
        </span>`;
    
    // If want to add animation
    if (addCircle){
        
        // Create Elememt
        sendingCircle = document.createElement("div");
        sendingCircle.id = "sendingCircle";
        
        // Append circle into line
        line.appendChild(sendingCircle);
    }

    // Append in Logs
    log.appendChild(line);

    // Go to Bottom
    log.scrollTop = log.scrollHeight;
}

// Function for Taking Response From Python Server
async function sendToBackend(msg){
    
    // Make Controller
    const controller = new AbortController();
    
    // Variables
    let timeout;
    const token = sessionStorage.getItem("mr_sky_token");
    const API_URL = "https://mr-sky-backend-feh5.onrender.com";
    const local_URL = "http://127.0.0.1:5000";
    
    // Reset Timeout Function
    function resetTimeout(){
        
        // Clear Timeout
       clearTimeout(timeout);
        
        // Make Timeout
        timeout = setTimeout(() => {
            
            // Cancle Request
            controller.abort();
        },  10000);
    }
        
    // Try To Send Message
    try{
        
        // Start Timeout
       // resetTimeout(timeout);
        
        // Send Request to a Address
        const response = await fetch(
            `${API_URL}/chat`,{
            
                method: "POST",
                headers: {
                
                   "Content-Type": "application/json",
                   "token": `Bearer ${token}`
                },
                body: JSON.stringify({
                
                    message: msg
                }),
                signal: controller.signal
            }
        );
        
        // Remove Sending Circle Animation
        try{
            sendingCircle.remove();
        }catch{}
        
        // Make Variables & Objects
        const decoder = new TextDecoder();
        const reader = response.body.getReader();
        let buffer = "";
        
        // Loop Over Data
        while (true){
            
            // Extract Data from reader
            const {value, done} = await reader.read();
            
            // Break Loop, if Everything is done
            if (done){break;}
            
            // Reset Timeout
            resetTimeout();
            
            // Make buffer
            buffer += decoder.decode(value, {stream : true});
            
            // Make Lines
            lines = buffer.split('\n');
            
            // Keep Incomplete Lines into Buffer
            buffer = lines.pop();
            
            // For Every Line
            for (line of lines){
                
                // Exceptions
                if (!line.trim()){continue;}
                
                // Make Data
                const data = JSON.parse(line);
                
                // Check Data Category
                if (data.category == "log"){
                
                    // Add Log
                    addLog(data.text, data.type);
                }
                else{
                    
                    // Add Reply
                    reply.textContent += data.text;
                    reply.scrollTop = reply.scrollHeight;
                }
            }
        }
    }
    
    // Catch Error
    catch(error){
        
        // Error Details
        console.error("Couldn't connect to backend server.");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        
        // Abort Error
        if (error.name == "AbortError"){console.log("Request Timed out.");}
    }
    
    // At End
    finally{
        
        // Clearn Timeout
        clearTimeout(timeout);
    }
}

// Function For Sending Message
function sendMessage(){
    
    // User Input
    const text = input.value.trim();
    
    // Make Initial log
    log.innerHTML = "";
    addLog("Sending your request to backend", "init", true);
        
    // Clear Input Box
    input.value = "";
    
    // Send To Backend
    sendToBackend(text);
}

// Keyboard Input System
input.addEventListener("keydown", (e) => {

    // Check Presssed Key
    if(
        e.key === "Enter" &&
        !e.shiftKey
    ){
        // Send Message
        e.preventDefault();
        sendMessage ();
    }
});
