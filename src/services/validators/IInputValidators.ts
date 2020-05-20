import {PlayerTypes} from "../../graphql/apollo/data/data";

export interface IInputValidators {
    validatePlayer(player: PlayerTypes): boolean;
    validatePosition(position: number): boolean;
}
