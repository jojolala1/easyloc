const connectSql = require("../dbConfigSqlServer");
const { program } = require("commander");
const { request } = require("http");
const sql = require("mssql");
const { exit } = require("process");
const readline = require("readline");

function getCurrentFormattedDate() {
    const now = new Date(); // Obtenir la date et l'heure actuelles

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois entre 01 et 12
    const day = String(now.getDate()).padStart(2, '0'); // Jour entre 01 et 31
    const hours = String(now.getHours()).padStart(2, '0'); // Heures entre 00 et 23
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes entre 00 et 59
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Secondes entre 00 et 59

    // Retourner la date formatée
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const cmd = readline.createInterface(process.stdin, process.stdout);

const searchContract = () => {
    const promptSearchContract = async () => {
        cmd.question("idantifiant : ", async (idContract) => {
            try {
                await connectSql();
                const request = new sql.Request();
                request.input("idContract", sql.Int, idContract);

                const result = await request.query(
                    "SELECT * FROM contract WHERE id = @idContract"
                );

                if (result.recordset.length > 0) {
                    console.log("Facture trouvée :")
                    console.table(result.recordset);
                } else {
                    console.log("Aucun contract trouvée avec cet identifiant.");
                }
            } catch (err) {
                console.error("Erreur de connexion à SQL Server :", err);
            } finally {
                cmd.close();
                process.exit(0);
            }
        });
    };

    program
        .command("searchContract")
        .description("rechercher un contract avec son id unique")
        .action(() => {
            promptSearchContract();
        });
}

const createContract = () => {
    const promptCreateContract = async () => {
        cmd.question("idantifiant du vehicule : ", async (idVehicle) => {
            cmd.question("idantifiant du conducteur : ", async (idCustomer) => {
                cmd.question("date et heure signature du contrat(format:YYYY-MM-DD HH:mm:ss ou rien mettre si date acctuel) : ", async (sign_datetime) => {
                    if(sign_datetime == ''){
                        sign_datetime = getCurrentFormattedDate()
                    }
                    cmd.question("debut du contrat (format: YYYY-MM-DD HH:mm:ss) : ", async (loc_begin_datetime) => {
                        cmd.question("fin du contrat (format: YYYY-MM-DD HH:mm:ss) : ", async (loc_end_datetime) => {
                            cmd.question("date du rendu du vehicule (format: YYYY-MM-DD HH:mm:ss) : ", async (returning_datetime) => {
                                cmd.question("prix : ", async (price) => {
                                    try {
                                        await connectSql()
                                        const request = new sql.Request()
                                        request.input('idVehicle', sql.VarChar(255), idVehicle)
                                        request.input('idCustomer', sql.VarChar(255), idCustomer)
                                        request.input('sign_datetime', sql.DateTime, sign_datetime)
                                        request.input('loc_begin_datetime', sql.DateTime, loc_begin_datetime)
                                        request.input('loc_end_datetime', sql.DateTime, loc_end_datetime)
                                        request.input('returning_datetime', sql.DateTime, returning_datetime)
                                        request.input('price', sql.Money, price)

                                        const result = await request.query(
                                            'insert into contract (vehicle_uid, customer_uid, sign_datetime,  loc_begin_datetime, loc_end_datetime, returning_datetime, price) values (@idVehicle, @idCustomer,@sign_datetime,@loc_begin_datetime,@loc_end_datetime, @returning_datetime, @price)'
                                        );
                                        if(result.rowsAffected > 0 ){
                                            console.log(result)
                                        }

                                    } catch (err) {
                                        console.error('erreur creation contract : ', err)
                                    } finally {
                                        cmd.close()
                                        process.exit(0)
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });

    };

    program
        .command("createContract")
        .description("creer un contrat")
        .action(() => {
            promptCreateContract();
        });
};

const deleteContract = () => {
    const promptDeleteContract = async () => {
        cmd.question("idantifiant du contrat : ", async (id) => {
            try {
                await connectSql();
                const request = new sql.Request();
                request.input("id", sql.Int, parseInt(id));
                const result = await request.query(
                    "delete from contract where id = @id"
                );

                if (result.rowsAffected[0] > 0) {
                    console.log("contrat supprimé :");
                } else {
                    console.log("echec supppression contrat .");
                }
            } catch (err) {
                console.error("Erreur de connexion à SQL Server :", err);
            } finally {
                cmd.close();
                process.exit(0);
            }
        });
    };
    program
        .command("deleteContract")
        .description("supprimer un contrat")
        .action(() => {
            promptDeleteContract();
        });
};

const updateContract = () => {
    const promptUpdateContract = async () => {
        cmd.question('id du contrat a modifier : ',async (id)=> {
            try {
                await connectSql()
                const request = new sql.Request()
                request.input('id', sql.Int, id)
                const searchId = await request.query('select * from contract WHERE id = @id'
                );
                if(searchId.recordset.length > 0 ){
                    console.log('contrat trouvé')
                }else{
                    console.log('pas de contract trouvé')
                    cmd.close()
                process.exit(0)
                }
            }catch(err){console.error('pas trouvé de contract de cet id',err)
                cmd.close()
                process.exit(0)

            }
            cmd.question("nouvel idantifiant du vehicule : ", async (idVehicle) => {
                cmd.question("nouvel idantifiant du conducteur : ", async (idCustomer) => {
                    cmd.question("nouvelle date et heure signature du contrat(format:YYYY-MM-DD HH:mm:ss ou rien mettre si date acctuel) : ", async (sign_datetime) => {
                        if(sign_datetime == ''){
                            sign_datetime = getCurrentFormattedDate()
                        }
                        cmd.question("nouvelle date debut du contrat (format: YYYY-MM-DD HH:mm:ss) : ", async (loc_begin_datetime) => {
                            cmd.question(" nouvelle date fin du contrat (format: YYYY-MM-DD HH:mm:ss) : ", async (loc_end_datetime) => {
                                cmd.question("nouvelle date du rendu du vehicule (format: YYYY-MM-DD HH:mm:ss) : ", async (returning_datetime) => {
                                    cmd.question("nouveau prix : ", async (price) => {
                                        try {
                                            await connectSql()
                                            const request = new sql.Request()
                                            request.input('id', sql.Int, id)
                                            request.input('idVehicle', sql.VarChar(255), idVehicle)
                                            request.input('idCustomer', sql.VarChar(255), idCustomer)
                                            request.input('sign_datetime', sql.DateTime, sign_datetime)
                                            request.input('loc_begin_datetime', sql.DateTime, loc_begin_datetime)
                                            request.input('loc_end_datetime', sql.DateTime, loc_end_datetime)
                                            request.input('returning_datetime', sql.DateTime, returning_datetime)
                                            request.input('price', sql.Money, price)
    
                                            const result = await request.query('UPDATE contract SET vehicle_uid = @idVehicle,customer_uid = @idCustomer,sign_datetime = @sign_datetime,loc_begin_datetime = @loc_begin_datetime,loc_end_datetime = @loc_end_datetime, returning_datetime = @returning_datetime,price = @price WHERE id = @id'
                                            );
                                            if(result.recordsets.length > 0 ){
                                                console.log('modification reussit')
                                            }
    
                                        } catch (err) {
                                            console.error('erreur modification contract : ', err)
                                        } finally {
                                            cmd.close()
                                            process.exit(0)
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })

    };

    program
        .command("updateContract")
        .description("modifier un contrat")
        .action(() => {
            promptUpdateContract();
        });
};

const listingContract = () => {
    const promptListingContract = async () => {
        try {
            await connectSql()
            const request = new sql.Request()
            const result = await request.query('SELECT * FROM Contract')
            if (result.recordset.length > 0) {
                console.table(result.recordset)
            } else { console.log('echec recuperations contrats') }
        } catch (err) {
            console.error('probleme connection bdd', err.message)
        } finally {
            cmd.close()
            process.exit(0)
        }
    }
    program
        .command('listingContracts')
        .description('lister tout les contrats')
        .action(() => {
            promptListingContract()
        })
}



module.exports = {
    searchContract,
    createContract,
    deleteContract,
    updateContract,
    listingContract
};

