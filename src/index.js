require('dotenv').config();
const {program} = require('commander')
const CustomerModel = require('./noSql/customer/customerModel')
const VehicleModel = require('./noSql/vehicle/vehicleModel')
const mongoose = require('mongoose')
const Listing = require('./Listing')
const {listingCustomer, createCustomer, dropCustomer, updateCustomer, searchByNamesCustomer} = require('./noSql/customer/customer')


    vehicle = new Listing ('listVehicles','affiche tout les vehicules',VehicleModel,'liste des vehicles')

    listingCustomer.listing()
    vehicle.listing()

    createCustomer()
    dropCustomer()
    updateCustomer()
    searchByNamesCustomer()


    program.parse(process.argv);
