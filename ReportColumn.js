export default class ReportColumn {
    constructor(name, dataProperty, visible = true, width) {
        this.name = name;
        this.dataProperty = dataProperty;
        this.visible = visible;
        if (width) this.width = width;
        else this.width = name.length * 9 + 20;
    }
}
