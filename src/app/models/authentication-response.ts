import { CompanyDTO } from './company-dto';

export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    companyDTO: CompanyDTO;
}