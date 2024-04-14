import url from "../jsondata/url.json"

export default async function getRequesterUpdates() {

    const response = await fetch(url.url + "/services/requesterupdates", {headers: {"Content-Type": "application/json","Authorization": localStorage.getItem("auth-token")}});
    const result = await response.json();

    return result;

}