export interface BaseResponseDto<T> {
    timestamp: Date;
    status: number;
    success: boolean;
    error: boolean;
    response: T
}