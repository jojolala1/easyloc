require('dotenv').config();
const {program} = require('commander')
const CustomerModel = require('./noSql/customer/customerModel')
const VehicleModel = require('./noSql/vehicle/vehicleModel')
const mongoose = require('mongoose')
const Listing = require('./Listing')
const {listingCustomer, createCustomer, dropCustomer, updateCustomer, searchByNamesCustomer} = require('./noSql/customer/customer')
const {listingVehicles, createVehicle, dropVehicle, updateVehicle, searchByPlate, filterByKm} = require('./noSql/vehicle/vehicle')
const { searchBilling, createBilling, deleteBilling, updateBilling, listingBilling} = require('./sql/billing/billing');
const { searchContract, createContract, updateContract, listingContract, deleteContract } = require('./sql/contract/contract');

    listingCustomer.listing()
    createCustomer()
    dropCustomer()
    updateCustomer()
    searchByNamesCustomer()

    listingVehicles.listing()
    createVehicle()
    dropVehicle()
    updateVehicle()
    searchByPlate()
    filterByKm()

    searchBilling()
    createBilling()
    deleteBilling()
    updateBilling()
    listingBilling()

    listingContract()
    searchContract()
    createContract()
    updateContract()
    deleteContract()


    program.parse(process.argv);
