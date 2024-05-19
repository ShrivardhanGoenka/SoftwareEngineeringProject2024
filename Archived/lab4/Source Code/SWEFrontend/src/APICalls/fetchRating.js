import url from "../jsondata/url.json";

export default async function fetchRating(){
    const response = await fetch(url.url + "services/get_rating", {
     method: "GET",
     headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth-token')
        },
    });

    

    if(response.ok){
        const result = await response.json()
        return result
     // setRating(result)
    }else{
        console.log("Rating is not fetched.")
   }
}