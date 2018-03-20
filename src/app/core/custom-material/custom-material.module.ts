import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatTableModule, MatTabsModule,
    MatToolbarModule, MatTooltipModule, MatRadioModule, MatSnackBarModule, MatDialogModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatSlideToggleModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatTabsModule,
        MatTableModule,
        MatExpansionModule,
        MatSelectModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatSnackBarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatTabsModule,
        MatTableModule,
        MatExpansionModule,
        MatSelectModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatSnackBarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
})
export class CustomMaterialModule {
}