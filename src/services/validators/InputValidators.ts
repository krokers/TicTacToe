import {IInputValidators} from "./IInputValidators";
import {HttpError} from "../../utils/HttpError";
import {keysAsString} from "../../utils/TextUtils";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {PlayerTypes} from "../../graphql/apollo/data/data";

@injectable()
export class InputValidators implements IInputValidators{

    validatePlayer(player:PlayerTypes):boolean {

        if (!Object.values(PlayerTypes).includes(player)) {
            throw new HttpError(`Incorrect player type. Allowed types are ${keysAsString(PlayerTypes, ', ')}`, 412)
        }
        return true;
    }

    validatePosition(position: number):boolean {
        if (position<0 || position > 8) {
            throw new HttpError(`Incorrect position to check. Must be a value between 0-8`, 412)
        }
        return true;
    }
}