import url from "../jsondata/url.json"

export default async function getCurrentRequestInfo() {
    try {
        const response = await fetch(url.url + "services/current_request_info", {
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