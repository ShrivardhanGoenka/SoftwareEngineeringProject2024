import url from "../jsondata/url.json"
import Swal from "sweetalert2"

// Function to update the profile of the current user
// @param body
// @returns JSON
export default async function postProfile(body){

    const response = await fetch(url.url + "accounts/profile", {
        method: "POST", 
        headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem("auth-token")},
        body: JSON.stringify(body)
    })
    
    if (!response.ok){
       const result = await response.json();
       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.error,
      });
       return null;
    }


    const result = await response.json()
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully.',
      });
    return result;
}

