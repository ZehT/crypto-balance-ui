import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BasicResponse, RequestOptions} from "./http-commons-interfaces";
import {AppInjector} from "../app-injector";
import {NotificationService} from "../notification/notification.service";

export class HttpCommons {

    private static OK: number = 200;
    private static NOT_FOUND: number = 404;
    private static CONFLICT: number = 409;

    public static async getRequest<T>(url: string, params: any = null): Promise<T> {
        const httpClient = this.initHttpClient();
        const requestOptions: RequestOptions = {
            params: this.getHttpParams(params)
        };
        const httpRequest = await httpClient.get<BasicResponse<T>>(url, requestOptions);
        return this.generalHttpHandler<T>(httpRequest);
    }

    public static async postRequest<T>(url: string, body: any, params: any = null): Promise<T> {
        const httpClient = this.initHttpClient();
        const requestOptions: RequestOptions = this.getRequestOptions(params);
        const httpRequest = await httpClient.post<BasicResponse<T>>(url, body, requestOptions);
        return this.generalHttpHandler<T>(httpRequest);
    }

    public static async putRequest<T>(url: string, body: any, params: any = null): Promise<T> {
        const httpClient = this.initHttpClient();
        const requestOptions: RequestOptions = this.getRequestOptions(params);
        const httpRequest = await httpClient.put<BasicResponse<T>>(url, body, requestOptions);
        return this.generalHttpHandler<T>(httpRequest);
    }

    public static async deleteRequest<T>(url: string, params: any = null): Promise<T> {
        const httpClient = this.initHttpClient();
        const requestOptions: RequestOptions = this.getRequestOptions(params);
        const httpRequest = await httpClient.delete<BasicResponse<T>>(url, requestOptions);
        return this.generalHttpHandler<T>(httpRequest);
    }

    private static initHttpClient(): HttpClient {
        return AppInjector.get<HttpClient>(HttpClient);
    }

    private static initiNotificationService(): NotificationService {
        return AppInjector.get<NotificationService>(NotificationService);
    }

    private static getHttpParams(params: any): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(k => {
                if (params[k]) {
                    if (Array.isArray(params[k])) {
                        params[k].forEach(value => {
                            httpParams = httpParams.append(k, value);
                        });
                    } else {
                        httpParams = httpParams.set(k, params[k]);
                    }
                }
            });
        }
        return httpParams;
    }

    private static generalHttpHandler<T>(httpObservable: Observable<BasicResponse<T>>): Promise<T> {
        return httpObservable.toPromise()
            .then((response: BasicResponse<T>) => {
                    return this.successHandler<T>(response);
                }
            )
            .catch((errorResponse: BasicResponse<T>) => {
                this.errorHandler(errorResponse);
                throw new Error();
            });
    }

    private static getRequestOptions(params: any): RequestOptions {
        return {
            params: this.getHttpParams(params)
        };
    }

    private static errorHandler<T>(errorResponse: BasicResponse<T>): void {
        const notificationService = this.initiNotificationService();
        if (this.NOT_FOUND === errorResponse.error.statusCode) {
            notificationService.warning(errorResponse.error.message)
        } else if (this.CONFLICT === errorResponse.error.statusCode) {
            notificationService.warning(errorResponse.error.message)
        } else {
            notificationService.error(errorResponse.error.message)
        }
    }

    private static successHandler<T>(response: BasicResponse<T>): T {
        const notificationService = this.initiNotificationService();
        if (this.OK === response.statusCode) {
            if (response.message) {
                notificationService.success(response.message);
            }
            return response.data;
        } else {
            this.errorHandler(response);
        }
    }
}
