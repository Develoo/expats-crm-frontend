import { CentreInteret } from './CentreInteret';
import { MarquesPreferees } from './MarquesPreferees';
import { ServiceRechercheSurPlatform } from './servicesRechercheSurPlatform';

export class UserRole {
    id: any;
    username: any;
    role: any;
    email: any;
    autoris_consent: any;
    prefer_communi: any;
    password: any;
    age: any;
    prenom: any;
    nom: any;
    paysresiden: any;
    ville: any;
    creationDate: any;
    statutmatrimonial: any;
    professionactuel: any;
    secteuractivite: any;
    employeuractuel: any;
    centreInterets: CentreInteret[];
    servicesRechercheSurPlatform: ServiceRechercheSurPlatform[];
    marquesPreferees: MarquesPreferees[];
}
