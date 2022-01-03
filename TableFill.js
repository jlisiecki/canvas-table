import Global from './Global.js';
export default class TableFill {
    constructor(containerSelector, report = new Global()) {
        this.rowHeight = 20;
        this.container = document.querySelector(containerSelector);
        if (!this.container) throw new Error('Invalid selector!');
        this.report = report;
        this.styleContainer();
        this.createPlaceholder();
        this.createTable();
        this.startIndex = 0;
        this.scrollTop = this.container.scrollTop;
    }
    styleContainer() {
        this.container.classList.add('datatable-container');
        this.container.addEventListener('scroll', () => {
            this.scrollTop = this.container.scrollTop;
            window.requestAnimationFrame(async () => {
                this.table.style.marginLeft = `-${this.container.scrollLeft}px`;
                // this.table.style.marginTop = `-${
                //     this.scrollTop % this.rowHeight
                // }px`;
                await this.renderTable();
            });
        });
    }
    async createPlaceholder() {
        this.placeholder = document.createElement('div');
        this.placeholder.classList.add('datatable-placeholder');
        this.container.appendChild(this.placeholder);
        this.placeholder.style.width =
            this.report.columns.reduce((p, c) => {
                return p + c.width;
            }, 0) + 'px';
        const dataLength = await window.bridge.dataLengthRequest();

        this.placeholder.style.height = this.rowHeight * dataLength + 'px';
    }
    createTable() {
        this.tableContainer = document.createElement('div');
        this.tableContainer.classList.add('datatable-table-container');
        this.container.appendChild(this.tableContainer);

        this.table = document.createElement('div');
        this.table.classList.add('datatable-table');
        this.tableContainer.appendChild(this.table);

        this.head = document.createElement('div');
        this.head.classList.add('datatable-head');
        this.head.style.width =
            this.report.columns.reduce((p, c) => {
                return p + c.width;
            }, 0) + 'px';
        this.table.appendChild(this.head);
        this.report.columns.forEach((column) => {
            const cell = document.createElement('div');
            cell.classList.add('datatable-cell');
            cell.style.height = this.rowHeight + 'px';
            cell.style.width = column.width + 'px';
            cell.innerText = column.name;
            this.head.appendChild(cell);
        });
        this.body = document.createElement('div');
        this.table.appendChild(this.body);
        new ResizeObserver(() => {
            this.rows = [];
            this.body.innerHTML = '';
            for (
                let i = 0;
                i <
                Math.ceil(this.tableContainer.offsetHeight / this.rowHeight) -
                    1;
                i++
            ) {
                const row = {};
                const tr = document.createElement('div');
                tr.classList.add('datatable-row');
                this.body.appendChild(tr);
                this.rows.push(row);
                tr.style.width =
                    this.report.columns.reduce((p, c) => {
                        return p + c.width;
                    }, 0) + 'px';
                this.report.columns.forEach((column) => {
                    const cell = document.createElement('div');
                    cell.classList.add('datatable-cell');
                    cell.style.width = column.width + 'px';
                    cell.style.height = this.rowHeight + 'px';
                    row[column.dataProperty] = cell;
                    tr.appendChild(cell);
                });
            }
            window.requestAnimationFrame(
                async () => await this.renderTable(true)
            );
        }).observe(this.container);
    }
    async renderTable(reRender = false) {
        const st = performance.now();
        const start = Math.floor(this.scrollTop / this.rowHeight);

        if (!reRender && start === this.startIndex && this.scrollTop !== 0)
            return;

        const visibleColumns = [];

        {
            let columnPostion = 0;

            this.report.columns.forEach((column) => {
                if (
                    columnPostion + column.width >= this.container.scrollLeft &&
                    columnPostion <=
                        this.container.scrollLeft + this.container.offsetWidth
                ) {
                    visibleColumns.push(column);
                }
                columnPostion += column.width;
            });
        }

        if (
            this.startIndex < start &&
            start - this.startIndex < this.rows.length
        ) {
            console.log('down');

            const data = await window.bridge.dataPortionRequest(
                this.startIndex + this.rows.length + 1,
                this.startIndex + this.rows.length + start - this.startIndex,
                visibleColumns
            );
            for (let i = 0; i < start - this.startIndex; i++) {
                const row = this.rows.shift();
                const dataRow = data[i];
                Object.keys(row).forEach((key) => {
                    if (dataRow !== undefined && dataRow[key] !== undefined)
                        row[key].innerText = dataRow[key];
                });
                this.rows.push(row);
                this.body.appendChild(this.body.childNodes[0]);
            }
        } else if (
            this.startIndex > start &&
            start - this.startIndex < this.rows.length
        ) {
            console.log('up');
            const data = await window.bridge.dataPortionRequest(
                start,
                this.startIndex,
                visibleColumns
            );
            for (let i = 0; i < this.startIndex - start; i++) {
                const row = this.rows.pop();
                const dataRow = data[i];
                Object.keys(row).forEach((key) => {
                    if (dataRow !== undefined && dataRow[key] !== undefined)
                        row[key].innerText = dataRow[key];
                });
                this.rows.unshift(row);
                this.body.prepend(
                    this.body.childNodes[this.body.childElementCount - 1]
                );
            }
        } else {
            console.log('all');
            const data = await window.bridge.dataPortionRequest(
                start,
                start + this.rows.length - 1,
                visibleColumns
            );
            for (let i = 0; i < this.rows.length; i++) {
                this.report.columns.forEach(async (column) => {
                    if (data[i][column.dataProperty] !== undefined)
                        this.rows[i][column.dataProperty].innerText =
                            data[i][column.dataProperty];
                });
            }
        }
        this.startIndex = start;
    }
}
