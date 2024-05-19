import url from "../jsondata/url.json";

export default async function getWalletHistory(){
    const response = await fetch(url.url + "accounts/wallet/history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("auth-token"),
        },
      })

    
    if(response.ok){
        const result = await response.json();
        return result;
    }else{
        console.log("Wallet history is not fetched.")
    }
        
}