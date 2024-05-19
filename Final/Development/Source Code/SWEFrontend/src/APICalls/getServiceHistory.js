import url from "../jsondata/url.json"
import Swal from "sweetalert2"

// Function to get the service history of the current user
// @param None
// @returns JSON
export default async function getServiceHistory(){

    const response = await fetch(url.url + "accounts/servicehistory", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
    })

    if(!response.ok){
        const result = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.error,
          });
        return "";
    }

    const result = await response.json();
    return result 
    

}