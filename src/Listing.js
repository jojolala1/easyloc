const { program } = require('commander'); 
const connectMongo = require('./noSql/dbConfigMongo');
const mongoose = require('mongoose');
const readline = require('readline')

class Commands {

    constructor(commandName, describe, model, sujet ){
        this.commandName = commandName
        this.describe = describe
        this.model = model
        this.sujet = sujet

    }

    listing() {
        program
    .command(this.commandName)
    .description(this.describe)
    .action(async ()=> {
        try {
            await connectMongo(process.env.MONGO_URI);
            const customers = await this.model.find();
            console.log(this.sujet,':' ,customers)
        }catch(error){
            console.error(`erreur pour ${this.describe}`,error)
        }finally {
           await mongoose.disconnect()
           process.exit(0);
        }
    })
    }

    add(){
        program
    .command(this.commandName)
    .description(this.describe)
    .action(async ()=> {
        this.promptUserDetails();
    })

    
    }

}

module.exports = Commands