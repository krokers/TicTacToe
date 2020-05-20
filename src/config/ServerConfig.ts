import {injectable} from 'inversify'

@injectable()
export class ServerConfig {
    PORT:string

    constructor() {
        this.PORT = process.env["TTT_PORT"] || "3000";
    }
}