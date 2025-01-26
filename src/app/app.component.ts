import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../app/components/customizer-settings/customizer-settings.service';
import { ToggleService } from '../app/components/common/header/toggle.service';
import { AuthService } from './_services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Tagus - Material Design Angular Admin Dashboard Template';
    isAdminLoggedIn: boolean = false; // Variable pour contrôler l'affichage du header

    isToggled = false;

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef
    ) {
        this.toggleService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    /* ngOnInit() {
        this.isAdminLoggedIn = this.authService.isAdmin();
        console.log('le role est' + this.isAdminLoggedIn);
    }*/

    ngOnInit() {
        this.isAdminLoggedIn = this.authService.isAdmin();
        console.log('le role est' + this.isAdminLoggedIn);

        // Force le changement de détection
        this.cdRef.detectChanges();
    }

    toggleRightSidebarTheme() {
        this.themeService.toggleRightSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
