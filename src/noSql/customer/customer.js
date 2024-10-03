const Commands = require("../../Listing");
const CustomerModel = require("./customerModel");
const { program } = require("commander");
const connectMongo = require("../dbConfigMongo");
const mongoose = require("mongoose");
const readline = require("readline");

const listingCustomer = new Commands(
    "listingCustomers",
    "affiche tout les clients",
    CustomerModel,
    "liste des clients"
);

createCustomer = () => {
    const promptUser = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("Nom :", (firstname) => {
            cmd.question("prénom : ", (second_name) => {
                cmd.question("adresse : ", (address) => {
                    cmd.question(
                        "numéro de permis : ",
                        async (permit_number) => {
                            try {
                                // Connexion à MongoDB
                                await connectMongo(process.env.MONGO_URI);
                                const newCustomer = new CustomerModel({
                                    firstname,
                                    second_name,
                                    address,
                                    permit_number,
                                });
                                console.log(`
                                        nom : ${firstname},\n
                                        prenom : ${second_name},\n
                                        adresse : ${address},\n
                                        numéro de permis : ${permit_number},\n`);
                                console.log("chargement...");
                                await newCustomer.save();
                                console.log("client enregistré");
                            } catch (err) {
                                console.log(
                                    "erreur de creation de client",
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
        });
    };
    program
        .command("createCustomer")
        .description("pour creer un nouveau client")
        .action(() => {
            promptUser();
        });
};

dropCustomer = () => {
    const promptSearchNames = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("Nom :", async (firstname) => {
            cmd.question("prénom : ", async (second_name) => {
                try {
                    // Connexion à MongoDB
                    await connectMongo(process.env.MONGO_URI);
                    const customer = await CustomerModel.deleteOne({
                        firstname,
                        second_name,
                    });
                    if (customer.deletedCount > 0) {
                        console.log("client supprimé");
                    } else {
                        console.log("aucun client correspondant");
                    }
                } catch (err) {
                    console.log("erreur de la supression du client", err);
                } finally {
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                }
            });
        });
    };
    program
        .command("dropCustomer")
        .description("pour creer un nouveau client")
        .action(() => {
            promptSearchNames();
        });
};

updateCustomer = () => {
    const promptUpdateByNames = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("Nom actuel : ", async (firstname) => {
            cmd.question("prénom actuel : ", async (second_name) => {
                await connectMongo(process.env.MONGO_URI);
                const customer = await CustomerModel.findOne({
                    firstname,
                    second_name,
                });
                if (!customer) {
                    console.log("Aucun client correspondant trouvé.");
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                    return;
                }
                cmd.question("nouveau nom : ", async (firstnameNew) => {
                    cmd.question(
                        "nouveau prénom : ",
                        async (second_nameNew) => {
                            cmd.question(
                                "nouvelle adresse : ",
                                async (addressNew) => {
                                    cmd.question(
                                        "nouveau numero de permis : ",
                                        async (permit_numberNew) => {
                                            try {
                                                const result =
                                                    await CustomerModel.updateOne(
                                                        {
                                                            firstname,
                                                            second_name,
                                                        },
                                                        {
                                                            $set: {
                                                                firstname:
                                                                    firstnameNew,
                                                                second_name:
                                                                    second_nameNew,
                                                                address:
                                                                    addressNew,
                                                                permit_number:
                                                                    permit_numberNew,
                                                            },
                                                        }
                                                    );
                                                if (result.modifiedCount > 0) {
                                                    console.log(
                                                        "client modifié"
                                                    );
                                                } else {
                                                    console.log(
                                                        "aucune modification faite sur le client"
                                                    );
                                                }
                                            } catch (err) {
                                                console.log(
                                                    "erreur de la modification du client",
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
            });
        });
    };
    program
        .command("updateCustomer")
        .description("pour modifier un client")
        .action(() => {
            promptUpdateByNames();
        });
};

searchByNamesCustomer = () => {
    const promptSearchByNames = () => {
        const cmd = readline.createInterface(process.stdin, process.stdout);

        cmd.question("Nom actuel : ", async (firstname) => {
            cmd.question("prénom actuel : ", async (second_name) => {
                try {
                    await connectMongo(process.env.MONGO_URI);
                    const customer = await CustomerModel.findOne({ firstname, second_name });
                    if (customer) {
                        console.log("Client trouvé :", customer);
                    } else {
                        console.log("Aucun client correspondant trouvé.");
                    }
                } catch (err) {
                    console.error("Erreur lors de la recherche du client :", err);
                } finally {
                    cmd.close();
                    await mongoose.disconnect();
                    process.exit(0);
                }
            });
        })
    }
    program
        .command("searchByNamesCustomer")
        .description("pour chercher un client")
        .action(() => {
            promptSearchByNames();
        });
};

module.exports = {
    listingCustomer,
    createCustomer,
    dropCustomer,
    updateCustomer,
    searchByNamesCustomer,
};
