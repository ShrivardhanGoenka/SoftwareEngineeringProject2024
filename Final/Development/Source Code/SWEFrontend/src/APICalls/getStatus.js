import url from "../jsondata/url.json"

// Function to get the status of the user
// @param None
// @returns JSON
export default function getStatusOfUser() {

    const token = localStorage.getItem("auth-token");
    if (!token) {
        return null;
    }

    return fetch(url.url + "services/anyrides", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
        return null;
    }).catch(error => { console.log(error) });

}