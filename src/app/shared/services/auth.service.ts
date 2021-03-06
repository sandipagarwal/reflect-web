import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';


@Injectable()
export class AuthService {
    private restangular: Restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getAuthApiHelper();
    }

    login() {
        return this.restangular.one(API_URLS.login).get();
    }

    auth(queryParams: any): Observable<any> {
        return this.restangular.one(API_URLS.auth).post(undefined, undefined, queryParams);
    }

    logout() {
        return this.restangular.one(API_URLS.logout).post();
    }
}
