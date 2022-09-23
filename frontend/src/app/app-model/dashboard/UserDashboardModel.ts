export class UserDashboardModel {
    public rows: Row[];
    public backgroundColor: string;
    public backgroundImage: string;
    public isColorSelected: boolean;

    findNewsRow() {
        if (this.rows) {
            return this.rows.filter(r => r.isNewsSection)[0];
        }
        return null;
    }

    setOrderNews(order: number) {
        const newsRow = this.findNewsRow();
        if (newsRow) {
            newsRow.orderNews = order;
        }
    }

    setOrderReminders(order: number) {
        const newsRow = this.findNewsRow();
        if (newsRow) {
            newsRow.orderReminders = order;
        }
    }

    isEnableNewsArea(value: boolean) {
        const newsRow = this.findNewsRow();
        if (newsRow) {
            newsRow.isEnabled = value;
        }
    }
}

export class Row {
    public index?: number;
    public orderNews?: number;
    public orderReminders?: number;
    public isEnabled?: boolean;
    public isNewsSection: boolean;
    public columns: Column[];
    constructor(isNewsSectionRow: boolean, columnsInRow: Column[], rowIndex?: number) {
        this.index = rowIndex;
        this.isNewsSection = isNewsSectionRow;
        this.columns = columnsInRow;
    }
}

export class Column {
    public index?: number;
    public components: DraggableComponent[];
    constructor(colComponents: DraggableComponent[], colIndex?: number) {
        this.index = colIndex;
        this.components = colComponents;
    }
}

export class DraggableComponent {
    public name: string;
    constructor(cardName: string) {
        this.name = cardName;
    }
}
