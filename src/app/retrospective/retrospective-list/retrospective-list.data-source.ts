import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

export class RetrospectiveListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private retrospectiveService: RetrospectiveService,
                private errorCallback: any) {
        super();
    }

    connect(): Observable<any> {
        this.retrospectiveService.getRetrospectives().subscribe(
            response => {
                this.dataChange.next(response.data.Retrospectives);
            },
            err => {
                this.errorCallback(err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1));
            }
        );
        return this.dataChange.asObservable();
    }

    disconnect() {
    }
}