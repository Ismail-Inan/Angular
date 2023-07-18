import { CompanyItemDTO } from "../company-item-dto";

export class CompanyItemImage {
    id: number;
    imageUrl: string;
    ordinal: number;

    constructor(id: number, imageUrl: string, ordinal: number) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.ordinal = ordinal;
    }
}  