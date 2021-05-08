import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {setAppInjector} from "./util/app-injector";
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {AssetComponent} from "./asset/asset.component";
import {CardComponentComponent} from './card-component/card-component.component';
import {allIcons, NgxBootstrapIconsModule} from "ngx-bootstrap-icons";

@NgModule({
    declarations: [
        AppComponent,
        AssetComponent,
        CardComponentComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            preventDuplicates: true,
            progressBar: true,
            closeButton: true
        }),
        FormsModule,
        NgxBootstrapIconsModule.pick(allIcons)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(injector: Injector) {
        setAppInjector(injector);
    }
}
