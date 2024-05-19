import url from "../jsondata/url.json"
import Swal from "sweetalert2"

export default async function getProfile(){

    const response = await fetch(url.url + "accounts/profile", {headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem("auth-token")}})
    
    if (!response.ok){
       const res = response.json()
       alert(response.error)
    }
    
    const result = await response.json()
    return result
}

