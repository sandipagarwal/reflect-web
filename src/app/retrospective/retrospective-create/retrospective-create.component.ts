import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION, TRACKER_TICKET_TYPE_MAP } from '../../../constants/app-constants';
import * as _ from 'lodash';
import { UtilsService } from '../../shared/utils/utils.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-retrospective-create',
    templateUrl: './retrospective-create.component.html',
    styleUrls: ['./retrospective-create.component.scss']
})
export class RetrospectiveCreateComponent implements OnInit, OnDestroy {
    retroFormGroup: FormGroup;
    isTeamOptionsLoaded = false;
    isProviderOptionsLoaded = false;
    disableButton = false;

    // These are the possible options for the teams and task providers
    teamOptions: any = [];
    taskProviderOptions: any = [];

    // It is used to render the task provider components (When we add a task provider,
    // a new entry will be made in this list with a true value (as of now))
    taskProvidersList: any = [];
    // Maintains the task providers count
    taskProvidersIndex = -1;

    // Keys used for form controls and provider lookups
    taskProviderKey = 'taskProvider';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.getTeamList();
        this.getTaskProviders();
        this.createRetroFormGroup();
        this.addTaskProvider();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getTeamList() {
        this.retrospectiveService.getTeamList()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    if (_.isEmpty(response.data.Teams)) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.noTeamsError,
                            '', {duration: SNACKBAR_DURATION});
                        this.dialogRef.close();
                    } else {
                        this.teamOptions = response.data.Teams;
                        this.isTeamOptionsLoaded = true;
                    }
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getTeamListError,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close();
                }
            );
    }

    getTaskProviders() {
        this.retrospectiveService.getTaskProvidersList()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.taskProviderOptions = response.data.TaskProviders;
                    this.isProviderOptionsLoaded = true;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getTeamProviderOptionsError,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close();
                }
            );
    }

    taskProviderInitialized(index) {
        return taskProviderFormGroup => {
            if (this.taskProvidersList[index]) {
                (<FormArray>this.retroFormGroup.controls[this.taskProviderKey])
                    .setControl(index, taskProviderFormGroup);
            }
        };
    }

    createRetroFormGroup() {
        this.retroFormGroup = new FormGroup({
            'team': new FormControl('', Validators.required),
            'storyPointPerWeek': new FormControl('', Validators.required),
            'projectName': new FormControl('', Validators.required),
        });
    }

    addTaskProvider() {
        if (!this.retroFormGroup.contains(this.taskProviderKey)) {
            this.retroFormGroup.addControl(this.taskProviderKey, new FormArray([]));
        }
        (<FormArray>this.retroFormGroup.controls[this.taskProviderKey]).push(new FormGroup({}));
        this.taskProvidersList[++this.taskProvidersIndex] = true;
    }

    createRetro(formValue) {
        this.disableButton = true;
        const selectedTeam = this.teamOptions.filter(team => team.ID === formValue.team)[0];
        const requestBody = {
            'title': selectedTeam && selectedTeam.Name || '',
            'team': formValue.team,
            'storyPointPerWeek': formValue.storyPointPerWeek,
            'projectName': formValue.projectName,
            'taskProvider': formValue.taskProvider.map(provider => {
                const taskProviderConfig = provider.taskProviderConfig;

                // Parse the ticket type mapping to a list of keywords
                _.forEach(TRACKER_TICKET_TYPE_MAP, (ticketType) => {
                    const ticketTypeValue = taskProviderConfig[ticketType];
                    if (_.isString(ticketTypeValue)) {
                        // trim trailing and leading commas and spaces
                        taskProviderConfig[ticketType] = ticketTypeValue.replace(/(^(,|\s)+)|((,|\s)+$)/g, '');
                    }
                });

                return {
                    'type': provider.selectedTaskProvider,
                    'data': {
                        ...taskProviderConfig,
                        'credentials': {
                            ...provider.Credentials.data,
                            'type': provider.Credentials.type
                        }
                    }
                };
            })
        };

        this.retrospectiveService.createRetro(requestBody)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.retroCreated,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close(true);
                    this.disableButton = false;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.createRetroError,
                        '', {duration: SNACKBAR_DURATION});
                    this.disableButton = false;
                }
            );
    }

    closeDialog(result = false) {
        this.dialogRef.close(result);
    }
}
