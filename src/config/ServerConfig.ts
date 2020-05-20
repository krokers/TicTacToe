import {injectable} from 'inversify'

@injectable()
export class ServerConfig {
    PORT:string

    constructor() {
        const envPort = process.env["TTT_PORT"];
        this.PORT = envPort ? envPort : "3000";
    }
}