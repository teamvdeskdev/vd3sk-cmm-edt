import { PostItDto } from './CreateUpdatePostItResponse';

export class SharePostItResponse {
    public Performed: boolean;
    public Shared: boolean;
    public Dto: PostItDto;
}
