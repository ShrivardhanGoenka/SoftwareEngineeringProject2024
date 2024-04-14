import url from "../jsondata/url.json";

export default async function sendChatMessage(message, role) {
    
    const dateTime = new Date();
    dateTime.setHours(dateTime.getHours() + 8);
    
    const body = {
        message: message, 
        role: role, 
        time: dateTime.toISOString()
    };

    const response = await fetch(url.url + "services/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(body),
    });

    if (response.status === 200) {
        return true;
    }

    return false;
}
    