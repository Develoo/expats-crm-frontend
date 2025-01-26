import { CentreInteret } from './CentreInteret';
import { MarquesPreferees } from './MarquesPreferees';
import { ServiceRechercheSurPlatform } from './servicesRechercheSurPlatform';
import { UserLangue } from './Userlangue';

export class User {
    id: number;
    username: string;
    role: string;
    email: string;
    password: string;
    centreInterets: CentreInteret[];
    servicesRechercheSurPlatform: ServiceRechercheSurPlatform[];
    marquesPreferees: MarquesPreferees[];
    userLangues: UserLangue[];
}
