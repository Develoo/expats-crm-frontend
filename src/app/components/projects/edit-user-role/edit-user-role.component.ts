import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-edit-user-role',
    templateUrl: './edit-user-role.component.html',
    styleUrls: ['./edit-user-role.component.scss'],
})
export class EditUserRoleComponent {
    editForm: FormGroup;
    formBuilder: any;
    id: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        // Initialisation du formulaire
        this.editForm = this.formBuilder.group({
            titre: ['', Validators.required],
            pays: ['', Validators.required],
            categorie: ['', Validators.required],
            description: ['', Validators.required],
            photo: [''],
        });

        // Récupération de l'ID depuis l'URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;

            // Appeler le service pour obtenir le numéro d'urgence par ID
            this.userService.getUserRoleById(this.id).subscribe(
                (data) => {
                    if (data) {
                        // Mettre à jour le formulaire avec les données reçues
                        this.editForm.patchValue({
                            titre: data.titre,
                            pays: data.pays,
                            categorie: data.categorie,
                            //  photo: data.photo,
                            description: data.description,
                        });
                        console.log('titre:' + data.titre);
                        console.log('titre:' + data.photo);
                    } else {
                        console.error('No data found for the specified ID');
                    }
                },
                (error) => {
                    console.error(
                        'Error fetching numero urgence by ID:',
                        error
                    );
                }
            );
        } else {
            console.error('No ID provided in the route');
        }
    }
}
