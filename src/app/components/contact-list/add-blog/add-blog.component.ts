import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { BlogService } from 'src/app/_services/blog.service';
import { FileService } from 'src/app/_services/file.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

export interface Blog {
    title: string;
    content: string;
    blogCategorieId: number;
    blogScategorieIds: number[]; // Tableau pour les IDs des BlogSCategorie
}

@Component({
    selector: 'app-add-blog',
    templateUrl: './add-blog.component.html',
    styleUrls: ['./add-blog.component.scss'],
})
export class AddBlogComponent implements OnInit {
    userForm: FormGroup;
    selectedFile: File | null = null;
    currentBook: any;
    categories: any[] = [];
    blogScategories: any[] = [];
    focused = false;
    blurred = false;
    newTag: string = '';
    blogForm: FormGroup;
    files: File[] = [];

    tagInputs: string[] = ['']; // Initialiser avec un champ vide

    public name: string;

    accountFields = [
        { label: 'title', name: 'title', type: 'text' },
        //  { label: 'image', name: 'image', type: 'text' },
        // { label: 'content', name: 'content', type: 'text' },
        //  { label: 'photo', name: 'photo', type: 'text' },
        // { label: 'categorie', name: 'categorie', type: 'text' },
        //  { label: 'pays', name: 'pays', type: 'text' },

        /*{
      label: 'prefe comunication',
      name: 'prefer_communi',
      type: 'text',
  },*/
    ];

    ngOnInit() {
        this.initForm();
        this.blogService.getCategories().subscribe((data) => {
            this.categories = data;
            console.log('les categories' + this.categories);
        });

        this.blogService.getBlogSCategories().subscribe((data) => {
            this.blogScategories = data;
            console.log('les sous categories' + this.blogScategories);
        });
    }

    get tags(): FormArray {
        return this.blogForm.get('tags') as FormArray;
    }

    addTag() {
        const tagGroup = this.fb.group({
            nom: ['', Validators.required],
        });
        this.tags.push(tagGroup);
    }

    removeTag(index: number) {
        this.tags.removeAt(index);
    }

    created(event: Quill) {}

    blur($event: any) {
        this.focused = false;
        this.blurred = true;
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {}

    focus($event: any) {
        this.focused = true;
        this.blurred = false;
    }

    constructor(
        public dialog: MatDialog,
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private scroller: ViewportScroller,
        private router: Router,
        private blogService: BlogService,
        public fileService: FileService
    ) {}

    initForm() {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            photo: ['', Validators.required],
            // description: ['', Validators.required], // Ajout du champ
            /*prefer_communi: ['', Validators.required],*/
            // categorie: ['', Validators.required],
            pays: ['', Validators.required],
            //blogCategorieId: [''],
            blogCategorieId: ['', Validators.required],
            blogScategorieIds: [[]],
            tags: this.fb.array([]), // Créez un FormArray pour les tags
            // tags: this.fb.array([]),
            //lien: ['', Validators.required],
            // marquesPreferees: this.fb.control([]),
        });
        this.addTag(); // Ajouter un champ tag par défaut
    }

    /* onSubmit() {
        if (this.userForm.valid) {
            const blogData = this.userForm.value;
            console.log(blogData); 

            this.blogService.addblogs(blogData).subscribe({
                next: (response) => {
                    console.log('Blog ajouté avec succès', response);
                },
                error: (error) => {
                    console.error("Erreur lors de l'ajout du blog", error);
                },
            });
        } else {
            console.log('Formulaire invalide');
        }
    }*/

    onSubmit() {
        if (this.blogForm.valid) {
            const blogData = this.blogForm.value;
            console.log(blogData);

            this.blogService.addblogs(blogData).subscribe({
                next: (response) => {
                    console.log('Blog ajouté avec succès', response);
                },
                error: (error) => {
                    console.error("Erreur lors de l'ajout du blog", error);
                },
            });
        } else {
            console.log('Formulaire invalide');
        }
    }

    selectFiles(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const files = Array.from(input.files);

            files.forEach((file) => {
                this.fileService.upload(file).subscribe(() => {
                    const cleanedFileName = file.name.replace(
                        'C:\fakepath\\',
                        ''
                    );

                    this.userForm.patchValue({
                        photo: cleanedFileName,
                    });
                    console.log(
                        `File ${cleanedFileName} uploaded successfully`
                    );
                });
            });
        } else {
            console.error('No files selected or input is null.');
        }
    }

    /*onSelect(event: NgxDropzoneChangeEvent) {
        const selectedFiles = Array.from(event.addedFiles);

        selectedFiles.forEach((file) => {
            this.files.push(file);
            this.fileService.upload(file).subscribe(() => {
                const cleanedFileName = file.name.replace('C:\\fakepath\\', '');

                this.userForm.patchValue({
                    photo: cleanedFileName,
                });

                console.log(`File ${cleanedFileName} uploaded successfully`);
            });
        });
    }

    onRemove(file: File) {
        this.files = this.files.filter((f) => f !== file);
        console.log(`File ${file.name} removed.`);
    }*/
}
