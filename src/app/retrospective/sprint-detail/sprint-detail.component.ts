import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    API_RESPONSE_MESSAGES,
    APP_ROUTE_URLS,
    SNACKBAR_DURATION,
    SPRINT_ACTIONS,
    SPRINT_ACTIONS_LABEL,
    SPRINT_STATES,
    SPRINT_STATES_LABEL,
    SPRINT_SYNC_STATES
} from '../../../constants/app-constants';
import {BasicModalComponent} from '../../shared/basic-modal/basic-modal.component';
import {RetrospectiveService} from '../../shared/services/retrospective.service';

@Component({
    selector: 'app-sprint-detail',
    templateUrl: './sprint-detail.component.html',
    styleUrls: ['./sprint-detail.component.scss']
})
export class SprintDetailComponent implements OnInit {
    sprintDays: number;
    sprintStatus: number;
    selectedValue: number;
    sprintID: any;
    retrospectiveID: any;
    sprintDetails: any;
    selectedTabIndex = 0;
    enableRefresh = true;
    dateFormat = 'MMMM dd, yyyy';
    sprintStates = SPRINT_STATES;
    sprintStatesLabel = SPRINT_STATES_LABEL;
    sprintActions = SPRINT_ACTIONS;
    sprintActionsLabel = SPRINT_ACTIONS_LABEL;
    syncStates = SPRINT_SYNC_STATES;

    static workdayCount(start, end) {
        const first = start.clone().endOf('week');
        const last = end.clone().startOf('week');
        const days = last.diff(first, 'days') * 5 / 7;
        let wfirst = first.day() - start.day();
        if (start.day() === 0) {
            --wfirst;
        }
        let wlast = end.day() - last.day();
        if (end.day() === 6) {
            --wlast;
        }
        return wfirst + days + wlast;
    }

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.getSprintDetails();
    }

    getSprintDetails() {
        const params = this.activatedRoute.snapshot.params;
        this.retrospectiveID = params['retrospectiveID'];
        this.sprintID = params['sprintID'];
        this.retrospectiveService.getSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            response => {
                this.sprintDetails = response.data;
                this.sprintStatus = response.data.Status;
                this.sprintDays = SprintDetailComponent.workdayCount(moment(response.data.StartDate), moment(response.data.EndDate));
                if (this.sprintDetails.SyncStatus === SPRINT_SYNC_STATES.SYNCING) {
                    setTimeout(() => this.getSprintDetails(), 5000);
                }
            },
            err => {
                this.snackBar.open(
                    err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES.getSprintDetailsError,
                    '', {duration: SNACKBAR_DURATION});
                this.navigateToRetrospectiveDashboard();
            }
        );
    }

    navigateToRetrospectiveDashboard() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveDashboard.replace(':retrospectiveID', this.retrospectiveID));
    }

    sprintStateChangeError(errorMessage) {
        if (errorMessage) {
            this.snackBar.open(errorMessage, '', {duration: SNACKBAR_DURATION});
        }
        this.selectedValue = undefined;
    }

    sprintStateChange(action) {
        if (_.includes(this.sprintActions, action)) {
            const dialogRef = this.dialog.open(BasicModalComponent, {
                data: {
                    content: 'Are you sure you want to ' + this.sprintActionsLabel[action] + ' sprint?',
                    confirmBtn: 'Yes',
                    cancelBtn: 'Cancel'
                },
                disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (action === this.sprintActions.ACTIVATE) {
                        this.retrospectiveService.activateSprint(this.retrospectiveID, this.sprintID).subscribe(
                            () => {
                                this.sprintStatus = this.sprintStates.ACTIVE;
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.sprintActivated,
                                    '', {duration: SNACKBAR_DURATION});
                            },
                            err => this.sprintStateChangeError(
                                err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES
                                    .sprintActivateError
                            )
                        );
                    } else if (action === this.sprintActions.FREEZE) {
                        this.retrospectiveService.freezeSprint(this.retrospectiveID, this.sprintID).subscribe(
                            () => {
                                this.sprintStatus = this.sprintStates.FROZEN;
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.sprintFrozen,
                                    '', {duration: SNACKBAR_DURATION});
                            },
                            err => this.sprintStateChangeError(
                                err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES
                                    .sprintFreezeError
                            )
                        );
                    } else if (action === this.sprintActions.DISCARD) {
                        this.retrospectiveService.discardSprint(this.retrospectiveID, this.sprintID).subscribe(
                            () => {
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.sprintDiscarded,
                                    '', {duration: SNACKBAR_DURATION});
                                this.navigateToRetrospectiveDashboard();
                            },
                            err => this.sprintStateChangeError(
                                err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES
                                    .sprintDiscardError
                            )
                        );
                    } else {
                        this.sprintStateChangeError(API_RESPONSE_MESSAGES.invalidOption);
                    }
                } else {
                    this.sprintStateChangeError('');
                }
            });
        }
    }

    refreshSprintDetails() {
        this.retrospectiveService.refreshSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            () => {
                this.sprintDetails.SyncStatus = SPRINT_SYNC_STATES.SYNCING;
                this.snackBar.open(
                    API_RESPONSE_MESSAGES.sprintComputationInitiated,
                    '', {duration: SNACKBAR_DURATION});
            },
            err => {
                this.snackBar.open(
                    err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES.refreshSprintError,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    toggleAutoRefresh() {
        this.enableRefresh = !this.enableRefresh;
    }
}