import url from '../jsondata/url.json'

// Function to get the service id by time started
// @param timeStarted
// @returns JSON
export default async function getServiceIdByTimeStarted(timeStarted){
    const body = {
        time_started: timeStarted
    }

    console.log(body);

    const response = await fetch(url.url + "services/getServiceIdByTimeStarted", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
        body: JSON.stringify(body)
    });

    if (!response.ok){
        return null;
    }

    const res = await response.json();
    console.log(res);
    return res;

}