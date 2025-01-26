import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private AUTH_API = 'http://localhost:8080/api/auth/';

    constructor(private http: HttpClient) {}

    getRolePro(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-pro');
    }

    getRoleUser(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-user');
    }

    getRoleUserEtEmbassadeur(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-user-embassadeur');
    }

    getRoleEmbassadeur(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-embassadeur');
    }

    getRoleProActif(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-pro/Actif');
    }

    getRoleProEnattente(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-pro/EnAttente');
    }

    getRoleProRefuse(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'role-pro/Refusé');
    }

    updateUser3(id: any, user: any): Observable<any> {
        return this.http.put<any>(AUTH_API + 'users/${id}/update', user);
    }

    updateUser(id: number, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}up/${id}`, user);
    }

    updateUserr(id: number, etat: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(
            `http://localhost:8080/api/auth/up/${id}`,
            { etat },
            { headers }
        );
    }

    /* login(email: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API + 'signin',
            {
                email,
                password,
            },
            httpOptions
        );
    }*/

    /* login(credentials: any): Observable<any> {
        return this.http
            .post(
                AUTH_API + 'signin',
                {
                    email: credentials.email,
                    password: credentials.password,
                },
                httpOptions
            )
            .pipe(
                map((user) => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return user;
                })
            );   
    }*/

    login(credentials: any): Observable<any> {
        return this.http
            .post(
                AUTH_API + 'signin',
                {
                    email: credentials.email,
                    password: credentials.password,
                },
                httpOptions
            )
            .pipe(
                map((user: any) => {
                    // Stocker les détails de l'utilisateur et le token JWT dans le localStorage
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Stocker également le rôle de l'utilisateur dans le localStorage
                    const userRole = user.roles[0]; // Supposons que l'utilisateur ait un seul rôle
                    localStorage.setItem('userRole', userRole);

                    return user;
                })
            );
    }

    register(user: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}signup`,
            {
                username: user.username,
                email: user.email,
                role: [user.role],
                password: user.password,
            },
            httpOptions
        );
    }

    // registeruserole(UserRole: any): Observable<any> {
    //     return this.http.post(
    //         `${AUTH_API}ajusers`,
    //         UserRole
    //     );
    // }
    // registeruserole(UserRole: any): void {
    //     this.http.post(
    //         `${AUTH_API}ajusers`,
    //         UserRole
    //     )
    //         .pipe(
    //             catchError((error: HttpErrorResponse) => {
    //                 console.error('Error adding user:', error);
    //                 // Show a user-friendly error message
    //                 return throwError(error);
    //             })
    //         )
    //         .subscribe(
    //             response => {
    //                 console.log('User added successfully:', response);
    //             },
    //             (error: HttpErrorResponse) => {
    //                 console.error('Error during POST request:', error);
    //                 // Display an error message to the user
    //             }
    //         );
    //
    // }

    registeruserole(UserRole: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}ajusers`,
            {
                prenom: UserRole.prenom,
                nom: UserRole.nom,
                username: UserRole.username,
                email: UserRole.email,
                autoris_consent: UserRole.autoris_consent,
                //userPreferCommunis: UserRole.userPreferCommunis,
                password: UserRole.password,
                numtele: UserRole.numtele,
                numwhats: UserRole.numwhats,
                photo: UserRole.photo,
                nbr_pays_expat: UserRole.nbr_pays_expat,
                expat_depui: UserRole.expat_depui,
                question1: UserRole.question1,
                question2: UserRole.question2,
                question3: UserRole.question3,
                pays: UserRole.pays,
                ville: UserRole.ville,
                genre: UserRole.genre,
                datenaiss: UserRole.datenaiss,
                stat_matrim: UserRole.stat_matrim,
                nbr_enf: UserRole.nbr_enf,
                prof_act: UserRole.prof_act,
                sect_act: UserRole.sect_act,
                emp_act: UserRole.emp_act,
                userLangues: UserRole.userLangues,
                userReseauSociaux: UserRole.userReseauSociaux,
                userPreferCommuni: UserRole.userPreferCommuni,
                centreInterets: UserRole.centreInterets,
                serviceRecherches: UserRole.serviceRecherches,
                marquesPreferees: UserRole.marquesPreferees,
            },
            httpOptions
        );
    }

    registerpro(ProRole: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}pro`,
            {
                nomentreprise: ProRole.nomentreprise,
                secteuractivite: ProRole.secteuractivite,
                descriptionentre: ProRole.descriptionentre,
                pays: ProRole.pays,
                ville: ProRole.ville,
                rue: ProRole.rue,
                codepostal: ProRole.codepostal,
                liengooglemap: ProRole.liengooglemap,
                numtel: ProRole.numtel,
                numwhats: ProRole.numwhats,
                siteweb: ProRole.siteweb,
                facebook: ProRole.facebook,
                instag: ProRole.instag,
                linkedin: ProRole.linkedin,
                twitter: ProRole.twitter,
                autre: ProRole.autre,
                nomprenomcontprin: ProRole.nomprenomcontprin,
                fonctioncontprin: ProRole.fonctioncontprin,
                numtelcontprin: ProRole.numtelcontprin,
                numwhatcontprin: ProRole.numwhatcontprin,
                emailcontprin: ProRole.emailcontprin,
                premierparrain: ProRole.premierparrain,
                secondparrain: ProRole.secondparrain,
                commentperso: ProRole.commentperso,
                location: ProRole.location,
                username: ProRole.username,
                email: ProRole.email,
                password: ProRole.password,
            },
            httpOptions
        );
    }

    registerprorole(ProRole: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}ajuserspro`,
            {
                prenom: ProRole.prenom,
                nom: ProRole.nom,
                username: ProRole.username,
                email: ProRole.email,

                autoris_consent: ProRole.autoris_consent,
                //userPreferCommunis: UserRole.userPreferCommunis,
                password: ProRole.password,
                numtele: ProRole.numtele,
                numwhats: ProRole.numwhats,
                photo: ProRole.photo,
                commentperso: ProRole.commentperso,
                photoentre: ProRole.photoentre,
                // openingTime: ProRole.openingTime,
                //closingTime: ProRole.closingTime,
                // openingHours: ProRole.openingHours,
                rue: ProRole.rue,
                //ville: ProRole.ville,
                //userTypeCompagnSouhait: ProRole.userTypeCompagnSouhait,
                servic_spec_expat: ProRole.servic_spec_expat,
                accept_platf: ProRole.accept_platf,
                nomentreprise: ProRole.nomentreprise,
                numtel: ProRole.numtel,
                pays: ProRole.pays,
                ville: ProRole.ville,
                codepostal: ProRole.codepostal,
                liengooglemap: ProRole.liengooglemap,
                prenom_pers_cont: ProRole.prenom_pers_cont,
                nom_pers_cont: ProRole.nom_pers_cont,
                foncti_pers_cont: ProRole.foncti_pers_cont,
                email_pers_cont: ProRole.email_pers_cont,
                num_tel_pers_cont: ProRole.num_tel_pers_cont,
                num_what_pers_cont: ProRole.num_what_pers_cont,
                premierparrain: ProRole.premierparrain,
                secondparrain: ProRole.secondparrain,
                userReseauSociaux: ProRole.userReseauSociaux,
                moy_payem: ProRole.moy_payem,
                livrai_dispo: ProRole.livrai_dispo,
                frai_livrais: ProRole.frai_livrais,
                condit_livrai: ProRole.condit_livrai,
                interet_compag_mark: ProRole.interet_compag_mark,
                budg_pub_mensuel: ProRole.budg_pub_mensuel,
                secteuractivite: ProRole.secteuractivite,
                descriptionentre: ProRole.descriptionentre,
                num_siret: ProRole.num_siret,
                num_tva: ProRole.num_tva,
                certif_accred: ProRole.certif_accred,
                site_web: ProRole.site_web,
            },
            httpOptions
        );
    }

    // Exemple pour vérifier si un utilisateur est administrateur
    isAdmin(): boolean {
        // Vous pouvez vérifier un token JWT ou un rôle ici
        const userRole = localStorage.getItem('userRole'); // Exemple: stocker le rôle dans le localStorage
        console.log('Rôle récupéré :', userRole);
        return userRole === 'ROLE_ADMIN';
    }
}
