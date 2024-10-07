const connectSql = require("../dbConfigSqlServer");
const { program } = require("commander");
const { request } = require("http");
const sql = require("mssql");
const { exit } = require("process");
const readline = require("readline");


const cmd = readline.createInterface(process.stdin, process.stdout);

const searchBilling = () => {
    const promptSearchBilling = async () => {
        cmd.question("idantifiant : ", async (idBilling) => {
            try {
                await connectSql(); 
                const request = new sql.Request();
                request.input("idBilling", sql.Int, idBilling);

                const result = await request.query(
                    "SELECT * FROM billing WHERE id = @idBilling"
                );

                if (result.recordset.length > 0) {
                    console.log("Facture trouvée :")
                    console.table( result.recordset);
                } else {
                    console.log("Aucune facture trouvée avec cet identifiant.");
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
                .command("searchBilling")
                .description("rechercher une facture avec son id unique")
                .action(() => {
                    promptSearchBilling();
                });
            }

const createBilling = () => {
    const promptCreateBilling = async () => {
        cmd.question("idantifiant du contrat : ", async (idContract) => {
            cmd.question("montant : ", async (amount) => {
            try {
                await connectSql(); 
                const request = new sql.Request();
                request.input("idContract", sql.Int, parseInt(idContract));
                request.input("amount", sql.Money, parseFloat(amount));
                const result = await request.query(
                    "insert into billing (contract_id, amount) values( @idContract, @amount)"
                );

                if (result.rowsAffected[0] > 0) {
                    console.log("Facture créé");
                } else {
                    console.log("echec creation facture .");
                }
            } catch (err) {
                console.error("Erreur de connexion à SQL Server :", err);
            } finally {
                cmd.close(); 
                process.exit(0);
            }
        });
    });

    };

            program
                .command("createBilling")
                .description("creer une facture")
                .action(() => {
                    promptCreateBilling();
                });
};

const deleteBilling = () => {
    const promptDeleteBilling = async () => {
        cmd.question("idantifiant de la facture : ", async (id) => {
            try {
                await connectSql(); 
                const request = new sql.Request();
                request.input("id", sql.Int, parseInt(id));
                const result = await request.query(
                    "delete from billing where id = @id"
                );

                if (result.rowsAffected[0] > 0) {
                    console.log("Facture supprimé :");
                } else {
                    console.log("echec supppression facture .");
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
                .command("deleteBilling")
                .description("supprimer une facture")
                .action(() => {
                    promptDeleteBilling();
                });
};

const updateBilling = () => {
    const promptUpdateBilling = async () => {
        cmd.question("Identifiant de la facture à modifier : ", async (id) => {
            try {
                await connectSql();
                const request = new sql.Request();
                request.input("id", sql.Int, parseInt(id));
                const result = await request.query("SELECT * FROM billing WHERE id = @id");

                if (result.recordset.length > 0) {
                    console.log("Facture trouvée :", result.recordset);
                    cmd.question("Nouvel identifiant du contrat : ", async (idContractNew) => {
                        cmd.question("Nouveau montant : ", async (amountNew) => {
                            try {
                                request.input("idContractNew", sql.Int, parseInt(idContractNew));
                                request.input("amountNew", sql.Money, parseFloat(amountNew));
                        
                                const updateResult = await request.query(
                                    "UPDATE billing SET contract_id = @idContractNew, amount = @amountNew WHERE id = @id"
                                );

                                if (updateResult.rowsAffected[0] > 0) {
                                    console.log("Facture mise à jour avec succès !");
                                } else {
                                    console.log("Échec de la mise à jour de la facture.");
                                }
                            } catch (updateErr) {
                                console.error("Erreur lors de la mise à jour de la facture :", updateErr);
                            } finally {
                                cmd.close();
                                process.exit(0);
                            }
                        });
                    });
                } else {
                    console.log("Aucune facture trouvée avec cet identifiant.");
                    cmd.close();
                    process.exit(0);
                }
            } catch (err) {
                console.error("Erreur lors de la connexion à SQL Server :", err);
                cmd.close();
                process.exit(0);
            }
        });
    };

    program
        .command("updateBilling")
        .description("Mettre à jour une facture")
        .action(() => {
            promptUpdateBilling();
        });
};

const listingBilling = () => {
    const promptListingBilling = async () => {
        try{
           await connectSql()
           const request = new sql.Request()
           const result = await request.query('SELECT * FROM billing')
           if(result.recordset.length > 0){
            console.table(result.recordset)
           }else{console.log('echec recuperations factures')}
        }catch(err){
            console.error('probleme connection bdd',err.message)
        }finally{
            cmd.close()
            process.exit(0)
        }
    }
    program
    .command('listingBilling')
    .description('lister toutes les factures')
    .action(()=> {
        promptListingBilling()
    })
}

module.exports = {
    searchBilling,
    createBilling,
    deleteBilling,
    updateBilling,
    listingBilling
};
