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

const BOOKMARK_LOOKUP = [
    {
        $lookup: {
          from: "labs",
          localField: "item_id",
          foreignField: "_id",
          as: "lab",
        },
    },
    {
        $unwind: {
          path: "$lab",
          preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
          from: "hospitals",
          localField: "item_id",
          foreignField: "_id",
          as: "hospital",
        },
    },
    {
        $unwind: {
          path: "$hospital",
          preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
          from: "stores",
          localField: "item_id",
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
    {
        $lookup: {
          from: "drugs",
          localField: "item_id",
          foreignField: "_id",
          as: "drug",
        },
    },
    {
        $unwind: {
          path: "$drug",
          preserveNullAndEmptyArrays: true,
        },
    },
]

const BOOKMARK_RETURN_DATA = {
    "user_id": 1,
    "item_id": 1,
    "bookmark_type": 1,
    "drug_id": "$drug._id",
    "drug_name": "$drug.name",
    "drug_price": "$drug.price",
    "drug_description": "$drug.description",
    "drug_medicine_group": "$drug.medicine_group",
    "drug_dosage": "$drug.dosage",
    "drug_nhis": "$drug.nhis",
    "drug_discount": "$drug.discount",
    "drug_image": "$drug.image",
    "hospital_id": "$hospital._id",
    "hospital_name": "$hospital.name",
    "hospital_address": "$hospital.address",
    "hospital_opening_hours": "$hospital.opening_hours",
    "hospital_phone_number": "$hospital.phone_number",
    "hospital_image": "$hospital.images",
    "store_id": "$store._id",
    "store_name": "$store.name",
    "store_location": "$store.location",
    "store_phone_number": "$store.phone_number",
    "store_open_hours": "$store.open_hours",
    "store_logo": "$store.logo",
    "lab_id": "$lab._id",
    "lab_name": "$lab.name",
    "lab_images": "$lab.images",
    "lab_name": "$lab.name",
    "lab_address": "$lab.address",
    "lab_opening_hours": "$lab.opening_hours",
    "lab_phone_number": "$lab.phone_number",
}

module.exports = {
    DRUG_RETURN_DATA,
    STORE_AND_CATEGORY_LOOKUP,
    BOOKMARK_LOOKUP,
    BOOKMARK_RETURN_DATA
}