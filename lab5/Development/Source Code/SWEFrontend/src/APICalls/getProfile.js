import url from "../jsondata/url.json"
import Swal from "sweetalert2"

// Function to get the profile of the current user
// @param None
// @returns JSON
export default async function getProfile(){

    const response = await fetch(url.url + "accounts/profile", {headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem("auth-token")}})
    
    if (!response.ok){
       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Failed to retrieve profile",
      });
    }
    
    const result = await response.json()
    return result
}

