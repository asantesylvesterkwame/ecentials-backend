const router = require('express').Router();
const Orders = require('../../../../private/schemas/Orders');

async function cancelOrder ({ req }) {

    const order_id = req.order_id;

    try {
        const result = await Orders.updateOne({_id: order_id}, {$set: {order_status: "Cancelled"}});

        if(result != null){
            return { message: "success", data: result };
        }
        return { message: "Failed to create checkout item.", data: err };

    } catch (error) {
        return { message: "Failed to create checkout item.", data: error };
    }
}

module.exports = {
    cancelOrder, 
}