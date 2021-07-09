import { ETipoGiacenza } from "../enumerations/ETipoGiacenza";

export class EntityRequestFilter {
    categoria: string;
    titolo: string;
    prezzo: number[];
    tipoGiacenza: ETipoGiacenza;
}