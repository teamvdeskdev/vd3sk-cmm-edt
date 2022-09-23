import { PostItDto } from './CreateUpdatePostItResponse';

export class LoadPostItResponse {
    public Performed: boolean;
    public Dto: PostItDto[];
}
