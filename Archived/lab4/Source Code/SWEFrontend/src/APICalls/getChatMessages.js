import url from "../jsondata/url.json";

export default async function getChatMessages() {
    const response = await fetch(url.url + "services/chat", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token"),
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        return data["chat"];
    }

    return null;
}