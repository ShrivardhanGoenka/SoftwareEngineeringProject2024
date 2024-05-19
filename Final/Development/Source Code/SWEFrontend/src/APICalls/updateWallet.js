import url from "../jsondata/url.json"
import Swal from 'sweetalert2'

// Function to update the wallet of the current user
// @param action, changeAmount
// @returns JSON
export default async function updateWallet(action, changeAmount) {
    const body = {
        amount: changeAmount,
        action: action,
    };

    try {
        const response = await fetch(url.url + "accounts/wallet/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("auth-token"),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const res = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: res.error,
            });
            return null;
        }

        const res = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
        });
        return res;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'error',
            text: 'An error occurred',
        });
        return null;
    }
}