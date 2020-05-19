import {PlayerTypes} from "../../graphql/resolvers/resolvers";

export interface IInputValidators {
    validatePlayer(player: PlayerTypes): boolean;
    validatePosition(position: number): boolean;
}
