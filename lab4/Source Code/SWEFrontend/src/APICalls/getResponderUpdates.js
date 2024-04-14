import url from "../jsondata/url.json"

export default async function getResponderUpdates() {    
    const response = await fetch(url.url + "services/responderstatus", {headers: {"Content-Type": "application/json","Authorization": localStorage.getItem("auth-token")}});
    const result = await response.json();
    return result;
}