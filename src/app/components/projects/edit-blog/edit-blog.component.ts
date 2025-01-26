import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import { BlogDTO, BlogService } from 'src/app/_services/blog.service';
import { BlogtagService } from 'src/app/_services/blogtag.service';
import { FileService } from 'src/app/_services/file.service';

@Component({
    selector: 'app-edit-blog',
    templateUrl: './edit-blog.component.html',
    styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
    blogId: number;
    blogData: any;
    editForm: FormGroup;
    id: number;
    selectedFile: File;
    focused = false;
    blurred = false;
    editFields = [
        { name: 'title', label: 'Titre', type: 'text' },
        { name: 'content', label: 'Contenu', type: 'text' },
        { name: 'pays', label: 'pays', type: 'text' },
        { name: 'blogCategorieId', label: 'blogCategorieId', type: 'number' },
    ];
    blogScategories: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        private router: Router,
        private formBuilder: FormBuilder,
        private fileService: FileService,
        private blogtagService: BlogtagService
    ) {}

    ngOnInit(): void {
        // Initialisation du formulaire avec validation
        this.editForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            pays: ['', Validators.required],
            blogCategorieId: ['', Validators.required],
            blogScategorieIds: [[], Validators.required],
            tags: this.formBuilder.array([]), // Initialise le FormArray pour les tags
            // tags: this.fb.array([])  Initialise le FormArray pour les tags
            /*categorie: ['', Validators.required],
            photo: [''],*/
        });

        // Charger les sous-catégories disponibles
        this.blogService.getBlogSCategories().subscribe((data) => {
            this.blogScategories = data;
            console.log('les blogScategories' + this.blogScategories);
        });

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = +idParam;
            this.loadBlogData(this.id);
        } else {
            console.error('Aucun ID fourni dans la route');
        }
    }

    // Méthode pour charger les données du blog
    loadBlogData(blogId: number): void {
        this.blogService.getBlogById(blogId).subscribe(
            (data) => {
                this.editForm.patchValue({
                    title: data.title,
                    content: data.content,
                    pays: data.pays,
                    blogCategorieId: data.blogCategorieId,
                    blogScategorieIds: data.blogScategories.map(
                        (scategorie: any) => scategorie.id
                    ),
                });

                console.log('le contenu est' + data.content);
                // Récupérer et charger les tags dans le FormArray
                this.blogtagService
                    .getTagsByBlogId(blogId)
                    .subscribe((tags) => {
                        // Afficher les tags dans la console
                        console.log('Tags récupérés:', tags);
                        tags.forEach((tag: any) => {
                            this.tags.push(
                                this.formBuilder.group({
                                    nom: [tag.nom, Validators.required],
                                })
                            );
                        });
                    });
            },
            (error) => {
                console.error('Erreur lors de la récupération du blog:', error);
            }
        );
    }

    // Getter pour accéder plus facilement au FormArray des tags
    get tags(): FormArray {
        return this.editForm.get('tags') as FormArray;
    }

    // Ajouter un tag au FormArray
    addTag(): void {
        this.tags.push(
            this.formBuilder.group({
                nom: ['', Validators.required], // Ajoute un tag vide avec une validation
            })
        );
    }

    // Supprimer un tag du FormArray
    removeTag(index: number): void {
        this.tags.removeAt(index);
    }

    focus($event: any) {
        this.focused = true;
        this.blurred = false;
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {}

    blur($event: any) {
        this.focused = false;
        this.blurred = true;
    }

    created(event: Quill) {}

    onEditorCreated(editor: any) {
        const content = this.editForm.get('content')?.value; // Récupérer le contenu
        console.log(
            "Valeur du content au moment de la création de l'éditeur:",
            content
        ); // Vérifiez ici
        if (content) {
            editor.setContents(editor.clipboard.convert(content)); // Injecte le contenu si présent
        }
    }

    // Fonction pour gérer la mise à jour du blog
    onUpdate(): void {
        if (this.editForm.valid) {
            const updatedData = this.editForm.value;

            // Envoi des données mises à jour au service
            this.blogService.updateBlog(this.id, updatedData).subscribe(
                (response) => {
                    console.log('Blog mis à jour avec succès:', response);
                    this.router.navigate(['/blogs']); // Rediriger après la mise à jour
                },
                (error) => {
                    console.error(
                        'Erreur lors de la mise à jour du blog:',
                        error
                    );
                }
            );
        }
    }

    // Fonction pour gérer la sélection d'un fichier
    selectFiles(event: any): void {
        const file = event.target.files[0];
        this.editForm.patchValue({ photo: file });
        this.selectedFile = file;
    }
}
