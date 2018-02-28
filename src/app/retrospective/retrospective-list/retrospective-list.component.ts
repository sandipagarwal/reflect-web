import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { API_RESPONSE_MESSAGES } from '../../../constants/app-constants';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';

@Component({
  selector: 'app-retrospective-list',
  templateUrl: './retrospective-list.component.html',
  styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit {
    dataSource: RetrospectiveListDataSource;
    displayedColumns = ['title', 'team', 'updated_at', 'latest_sprint'];

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private router: Router,
                private changeDetectorRefs: ChangeDetectorRef) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.retrospectiveService, this.showCannotGetRetrospectivesError.bind(this));
    }

    showCannotGetRetrospectivesError() {
        this.snackBar.open(API_RESPONSE_MESSAGES.getRetrospectivesError, '', {duration: SNACKBAR_DURATION});
    }

    navigateToRetrospectiveDetail(row) {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveDashboard.replace(':retrospectiveID', row.ID));
    }

    showCreateRetroModal() {
        const dialogRef = this.dialog.open(RetrospectiveCreateComponent, {
            width: '90%',
            height: '90%',
            maxWidth: 950
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.initializeDataSource();
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    navigateToLatestSprint(row) {
        this.retrospectiveService.getRetrospectiveLatestSprint(row.ID).subscribe(
            response => {
                this.router.navigateByUrl(APP_ROUTE_URLS.sprintDetails
                    .replace(':retrospectiveID', row.ID)
                    .replace(':sprintID', response.data.ID));
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.noSprintsError, '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    parseToDate(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toDateString();
    }
}
