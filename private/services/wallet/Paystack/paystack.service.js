// const Wallet = require('../../schemas/Wallet');
const axios = require('axios');

// create a new ecentials wallet
async function initializePaymentTransaction(req) {
    // try {
        let headers = { Authorization: 'Bearer sk_test_d77ee1491d65f0139a0d0018e7f7f4c0a3500f94','Content-Type': 'application/json',  'cache-control': 'no-cache'}
        let params = { amount: req.body.amount, email: req.body.email, currency: 'GHS' };

        axios.post('https://api.paystack.co/transaction/initialize', {params}, {headers})
        .then((response) => {
        if(response.data.status == true) return {message: response.data}
        })
        .catch((error) => {
            console.log(error);
        });
    // } catch (error) {
    //     return { message: "An error occurred when initializing paystack" }
    // }
}


module.exports = {
    initializePaymentTransaction,
}