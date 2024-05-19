import url from '../jsondata/url.json'
import Swal from 'sweetalert2'

export default async function confirmDropoff(){
    try{
        const response = await fetch(url.url + "services/dropoff", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("auth-token")
            },
        });

        if(!response.ok){
            const res = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.error,
              });
            return null;
        }
        
        const res = response.json();
        return res;

    } catch(err){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          });
        return null;
    }
    
}