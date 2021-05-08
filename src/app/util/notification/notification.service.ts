import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    public constructor(private toastr: ToastrService) {

    }

    public success(msg) {
        this.toastr.success(msg, 'Sucess');
    }

    public error(msg) {
        this.toastr.error(msg, 'Error');
    }

    public warning(msg) {
        this.toastr.warning(msg, 'Attention');
    }

}
