import { EServiceResponse } from "../enumerations/EServiceResponse";

export interface ServiceResponse<T> {
    response: EServiceResponse;
    data: T;
}