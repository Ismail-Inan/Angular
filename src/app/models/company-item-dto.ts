import { CompanyDTO } from "./company-dto";
import { UserItemImage } from "./user.item.image";

export class CompanyItemDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  giveAway: boolean;
  owner: CompanyDTO;
  thumbnail: any;
  category: string;
  publishedAt: Date;
  images: UserItemImage[];
}