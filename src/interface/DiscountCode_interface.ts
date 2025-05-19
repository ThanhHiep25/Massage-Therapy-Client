export interface DiscountCodeRequest {
    nameDiscount: string;
    code: string;
    discountAmount: number;
    discountDes: string;
    startDate: string;
    expiredDate: string;
}

export interface DiscountCodeResponse {
    discountCodeId: number;
    nameDiscount: string;
    code: string;
    discountAmount: number;
    discountDes: string;
    startDate: string;
    expiredDate: string;
    status: string;
}