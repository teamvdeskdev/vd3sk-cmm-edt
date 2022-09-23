export class FlowV2Model {
    login: string;
    loginMobile: string;
    poll: Poll;
}

export class Poll {
    endpoint: string;
    token: string;
}