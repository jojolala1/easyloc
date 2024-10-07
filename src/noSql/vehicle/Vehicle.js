const Commands = require("../../Listing");
const { program } = require("commander");
const connectMongo = require("../dbConfigMongo");
const mongoose = require("mongoose");
const readline = require("readline");
const VehicleModel = require("./vehicleModel");

const listingVehicles = new Commands(
    "listingVehicles",
    "affiche tout les vehicules",
    VehicleModel,
    "liste des vehicules"
);

const createVehicle = () => {
    const promptUser = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("numero de plaque : ",async (licence_plate) => {
            cmd.question("informations : ", async (informations) => {
                cmd.question("nombre total de km : ",async (km) => {
                    
                            try {
                                // Connexion à MongoDB
                                await connectMongo(process.env.MONGO_URI);
                                const newVehicle = new VehicleModel({
                                    licence_plate,
                                    informations,
                                    km,
                                });
                                console.log(`
                                        numero de plaque : ${licence_plate},\n
                                        informations : ${informations},\n
                                        nombre total de km : ${km},\n
                                        `);
                                console.log("chargement...");
                                await newVehicle.save();
                                console.log("vehicule enregistré");
                            } catch (err) {
                                console.log(
                                    "erreur de creation du vehicule",
                                    err
                                );
                            } finally {
                                cmd.close();
                                await mongoose.disconnect();
                                process.exit(0);
                            }
                        }
                    );
                
            });
        });
    };
    program
        .command("createVehicle")
        .description("pour creer un nouveau vehicule")
        .action(() => {
            promptUser();
        });
};

const dropVehicle = () => {
    const promptSearchPlateDelete = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("numero de plaque : ", async (licence_plate) => {
                try {
                    // Connexion à MongoDB
                    await connectMongo(process.env.MONGO_URI);
                    const vehicle = await VehicleModel.deleteOne({
                        licence_plate
                    });
                    if (vehicle.deletedCount > 0) {
                        console.log("vehicule supprimé");
                    } else {
                        console.log("aucun vehicule correspondant");
                    }
                } catch (err) {
                    console.log("erreur de la supression du vehicule", err);
                } finally {
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                }
            });
    };
    program
        .command("dropVehicle")
        .description("pour suprimer un vehicule")
        .action(() => {
            promptSearchPlateDelete();
        });
};

const updateVehicle = () => {
    const promptUpdateByPlate = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("Numero de plaque : ", async (licence_plate) => {
                await connectMongo(process.env.MONGO_URI);
                const vehicle = await VehicleModel.findOne({
                    licence_plate
                });
                if (!vehicle) {
                    console.log("Aucun ehicule correspondant trouvé.");
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                    return;
                }
                cmd.question("nouvelle plaque : ", async (licence_plateNew) => {
                    cmd.question(
                        "nouvelles informations : ",
                        async (informationsNew) => {
                            cmd.question(
                                "nouveaux km : ",
                                async (kmNew) => {
                                            try {
                                                const result =
                                                    await VehicleModel.updateOne(
                                                        {
                                                            licence_plate
                                                        },
                                                        {
                                                            $set: {
                                                                licence_plate:
                                                                    licence_plateNew,
                                                                informations:
                                                                    informationsNew,
                                                                km:
                                                                    kmNew,
                                                            },
                                                        }
                                                    );
                                                if (result.modifiedCount > 0) {
                                                    console.log(
                                                        "vehicule modifié"
                                                    );
                                                } else {
                                                    console.log(
                                                        "aucune modification faite sur le vehicule"
                                                    );
                                                }
                                            } catch (err) {
                                                console.log(
                                                    "erreur de la modification du vehicule",
                                                    err
                                                );
                                            } finally {
                                                cmd.close();
                                                await mongoose.disconnect();
                                                process.exit(0);
                                            }
                                        }
                                    );
                                }
                            );
                        }
                    );
                });

    };
    program
        .command("updateVehicle")
        .description("pour modifier un vehicule")
        .action(() => {
            promptUpdateByPlate();
        });
};

const searchByPlate = () => {
    const promptSearchByPlate = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("numero de plaque : ", async (licence_plate) => {
                try {
                    await connectMongo(process.env.MONGO_URI);
                    const vehicle = await VehicleModel.findOne({ licence_plate });
                    if (vehicle) {
                        console.log("Vehicule trouvé :", vehicle);
                    } else {
                        console.log("Aucun vehicule correspondant trouvé.");
                    }
                } catch (err) {
                    console.error("Erreur lors de la recherche du vehicule :", err);
                } finally {
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                }
            });
    }
    program
        .command("searchByPlate")
        .description("pour chercher un vehicule")
        .action(() => {
            promptSearchByPlate();
        });
};

const filterByKm = () => {
    const promptFilterByKm = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);
        cmd.question("km maximum : ", async (maxKm) => {
                try {
                    await connectMongo(process.env.MONGO_URI);
                    const vehicle = await VehicleModel.find({km:{$lte: maxKm}});
                    if (vehicle) {
                        console.log(`Vehicules de moins de ${maxKm} :`, vehicle);
                    } else {
                        console.log("Aucun vehicule correspondant trouvé.");
                    }
                } catch (err) {
                    console.error("Erreur lors de la recherche des vehicules :", err);
                } finally {
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                }
            });
    }
    program
        .command("filterByKm")
        .description("pour chercher un vehicule inferieur a un nombre de km donné")
        .action(() => {
            promptFilterByKm();
        });
}

module.exports = {
    listingVehicles,
    createVehicle,
    dropVehicle,
    updateVehicle,
    searchByPlate,
    filterByKm
};
