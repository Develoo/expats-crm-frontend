import { Langue } from './Langue';

export interface UserLangue {
    id: number;
    langue: string;
    nv_comp: string;
    Langues: Langue[];
    langueNom: string;
}
