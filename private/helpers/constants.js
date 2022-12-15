const DRUG_RETURN_DATA = {
    "name": 1,
    "price": 1,
    "selling_price": 1,
    "description": 1,
    "medicine_group": 1,
    "dosage": 1,
    "total_stock": 1,
    "views": 1,
    "nhis": 1,
    "expiry_date": 1,
    "discount": 1,
    "image": 1,
    "quantity": 1,
    "category_id": "$category._id",
    "category_name": "$category.name",
    "category_status": "$category.status",
    "store_id": "$store._id",
    "store_name": "$store.name",
    "store_location": "$store.location",
    "store_phone_number": "$store.phone_number",
    "store_open_hours": "$store.open_hours",
    "store_logo": "$store.logo"
}

const STORE_AND_CATEGORY_LOOKUP = [
    {
        $lookup: {
          from: "drugcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
    },
    {
        $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: "stores",
            localField: "store_id",
            foreignField: "_id",
            as: "store",
        },
    },
    {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
    },
]

module.exports = {
    DRUG_RETURN_DATA,
    STORE_AND_CATEGORY_LOOKUP
}