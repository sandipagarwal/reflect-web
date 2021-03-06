import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';
import { APP_ROUTE_URLS, LOGIN_ERROR_TYPES } from '../../../constants/app-constants';
import { environment } from '../../../environments/environment';
import { UserStoreService } from '../stores/user.store.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Injectable()
export class RestApiHelperService {

    private dataRestangular: Restangular;
    private dataRestangularWithLoader: Restangular;
    private authRestangular: Restangular;

    constructor(
        private restangular: Restangular,
        private loaderService: LoadingBarService,
        userStoreService: UserStoreService,
        router: Router
    ) {
        this.restangular = restangular.withConfig(function (RestangularProvider) {
            RestangularProvider.addErrorInterceptor(response => {
                if (response.status === 401) {
                    userStoreService.clearUserData();
                    const queryParams = {'error': LOGIN_ERROR_TYPES.unauthorized, 'returnUrl':  window.location.pathname};
                    router.navigate([APP_ROUTE_URLS.login], {queryParams: queryParams});
                    return false;
                }
                return true;
            });
            RestangularProvider.setFullResponse(true);

        });
    }

    public getBasicDataApiHelper() {
        if (!this.dataRestangular) {
            this.dataRestangular = this.restangular.withConfig((RestangularProvider) => {
                RestangularProvider.setBaseUrl(environment.apiHostUrl + environment.baseApiUrl);
            });
        }
        return this.dataRestangular;
    }

    public getDataApiHelperWithLoader() {
        if (!this.dataRestangularWithLoader) {
            this.dataRestangularWithLoader = this.restangular.withConfig((RestangularProvider) => {
                RestangularProvider.setBaseUrl(environment.apiHostUrl + environment.baseApiUrl);
                RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
                    this.loaderService.start();
                    return {
                        params: params,
                        headers: headers,
                        element: element
                    };
                });
                RestangularProvider.addResponseInterceptor(data => {
                    this.loaderService.complete();
                    return data;
                });
                RestangularProvider.addErrorInterceptor(data => {
                    this.loaderService.complete();
                    return data;
                });
            });
        }
        return this.dataRestangularWithLoader;
    }

    public getAuthApiHelper() {
        if (!this.authRestangular) {
            this.authRestangular = this.restangular.withConfig((RestangularProvider) => {
                RestangularProvider.setBaseUrl(environment.apiHostUrl);
            });
        }
        return this.authRestangular;
    }
}
