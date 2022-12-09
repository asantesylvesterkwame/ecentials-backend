const router = require('express').Router();
const Orders = require('../../../../private/schemas/Orders');

async function generateOrderCode () {
    const orderInitial = "ORDER";
    let initials = orderInitial.slice(0, 2).toUpperCase();
    
    let randomDigits = (Math.floor(Math.random()*90000) + 100000).toString();
    
    return initials +"-"+ randomDigits
}

async function fetchLastInvoiceNumber () {
    // pharmacy_id = req.user._id;
    const today = new Date()

    const day = today.getDate()        
    const month = today.getMonth() 
    const year = today.getFullYear() 

    const result = await Orders.find({}, {_id: 0, invoice_number: 1}).sort( { _id : -1 }).limit(1);
    data = []
    data = result;

    if(data.length == 0){
        return "Ecen/" + year + "/" + month + "/" + day + "/001";
    }
    else{
        for (var index = 0; index < data.length; index++) {
            return data[index].invoice_number;
        }
        // data.forEach(element => {
        //     console.log(element);
        // });
        // return data;
    }
}

function generateInvoiceNumber (oldInvoiceNumber) {
    var count = oldInvoiceNumber.match(/\d*$/);

    // Take the substring up until where the integer was matched
    // Concatenate it to the matched count incremented by 1
    return oldInvoiceNumber.substr(0, count.index) + (++count[0]);
}

async function createOrderItem(req) {
    const user_id = req.user._id;
    // console.log(req.body);
    try{
        const order = req.body
        order.forEach(async element =>{
            // console.log(element.delivery_date)
    
            const order_code = await generateOrderCode();
            const last_no = await fetchLastInvoiceNumber();
    
            const invoice_number = generateInvoiceNumber(last_no);
            var store_id = element.store_id
            var delivery_address_id = element.delivery_address_id
            var delivery_date = element.delivery_date
            var delivery_method = element.delivery_method
            var coordinates = element.coordinates
            var shipping_fee = element.shipping_fee
            var note = element.note
            var grand_total = element.grand_total
            var products_summary = element.products_summary

            // console.log(order.length)
            await Orders.create({
                user_id, order_code, invoice_number, store_id, delivery_address_id, 
                delivery_date, delivery_method, coordinates, shipping_fee, note, grand_total, products_summary
            })     
        })
        return { message: "Order created successfully"};
    } catch (error) {
        return { message: "Failed to create checkout item.", data: error };
    }
}

module.exports = {
    generateOrderCode, 
    fetchLastInvoiceNumber, 
    generateInvoiceNumber, 
    createOrderItem
}