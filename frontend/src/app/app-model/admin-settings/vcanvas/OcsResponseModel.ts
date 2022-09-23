import { UserModelOcsData } from "./UserModel";

export class OcsResponseModel {
    ocs: {
        meta: any;
        data: OcsDataModel
    }
}
export class OcsDataModel {
    users: any;
}