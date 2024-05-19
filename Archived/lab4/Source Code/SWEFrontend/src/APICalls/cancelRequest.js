import url from "../jsondata/url.json"
import Swal from "sweetalert2"

export default async function cancelRequest(){

    const response = await fetch(url.url + "services/cancel", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
    });

    if (!response.ok) {
        const res = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.error,
          });
        return false;
    }
    else{
        return true;
    }

}