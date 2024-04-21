import url from "../jsondata/url.json"

// Function to get the current ride info
// @param None
// @returns JSON
export default async function getCurrentRideInfo() {
    try {
        const response = await fetch(url.url + "services/current_ride_info", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("auth-token")
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            return {"status": "success", "data": data};
        } else {
            return {"status": "failed", "data": null};
        }
    } catch (error) {
        return {"status": "error", "data": null};
    }
}