import { SignatureType } from '../components/digital-signature/set-signature/set-signature.component';

export class SignatureParamInput {
    public accountId: number;
    public accountUserEmail: string;
    public padesCoordinatesFormat: string;
    public axisOrigin: string;
    public pathSaveFile: string;
    public location: string;
    public reason: string;
    public type: SignatureType;
    public isInvisibleSignature = false;
    public isMultipleSignature: boolean;
    public isMultipageSignature: boolean;
    public keepSingleFile = false;
    public userid?: string;
    public certid?: string;
    public requiredMark?: boolean;
}
