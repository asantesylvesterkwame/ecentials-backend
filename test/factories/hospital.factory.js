const Hospital = require("../../private/schemas/Hospital")

class HospitalFactory {
    constructor(name, address, opening_hours, phone_number) {
        this.name = name
        this.address = address
        this.opening_hours = opening_hours
        this.phone_number = phone_number
    }

    static async create(hospitalfactory) {
        const hospital = await Hospital.create({
            name: hospitalfactory.name,
            address: hospitalfactory.address,
            opening_hours: hospitalfactory.opening_hours,
            phone_number: hospitalfactory.phone_number
        });
        return hospital;
    }
}

module.exports = HospitalFactory;
