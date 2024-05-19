import url from "../jsondata/url.json"
import Swal from "sweetalert2"

export default async function postProfile(body){

    const response = await fetch(url.url + "accounts/profile", {
        method: "POST", 
        headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem("auth-token")},
        body: JSON.stringify(body)
    })
    
    if (!response.ok){
       const result = await response.json();
       alert(result.error)
       return null;
    }

    const result = await response.json()
    alert("success")
    return result;
}

