export class CardEmailCountsResponse {
    public Performed: boolean;
    public Dto: DtoCardEmailCountsResponse;
  }

export class DtoCardEmailCountsResponse {
    public TotalMessages: number;
    public TotalUnreadMessages: number;
    public TotalPecMessages: number;
    public TotalUnreadPecMessages: number;
}
