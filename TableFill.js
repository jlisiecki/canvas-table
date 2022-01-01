import Global from './Global.js';
export default class TableFill {
    constructor(containerSelector, data = [], report = new Global()) {
        this.rowHeight = 24;
        this.container = document.querySelector(containerSelector);
        if (!this.container) throw new Error('Invalid selector!');
        this.report = report;
        this.data = data;
        this.styleContainer();
        this.createPlaceholder();
        this.createTable();
        this.startIndex = 0;
        this.scrollTop = this.container.scrollTop;
    }
    styleContainer() {
        this.container.style.width = '100%';
        this.container.style.height = '100vh';
        this.container.style.overflow = 'auto';
        this.container.style.position = 'relative';
        this.container.addEventListener('scroll', () => {
            this.scrollTop = this.container.scrollTop;
            this.table.style.marginLeft = `-${this.container.scrollLeft}px`;
            window.requestAnimationFrame(() => {
                this.table.style.marginTop =
                    -(this.scrollTop % this.rowHeight) + 'px';
                this.fillTable();
            });
        });
    }
    createPlaceholder() {
        this.placeholder = document.createElement('div');
        this.container.appendChild(this.placeholder);
        this.placeholder.style.width =
            this.report.columns.reduce((p, c) => {
                return p + c.width;
            }, 0) + 'px';
        this.placeholder.style.height =
            this.rowHeight * this.data.length + 'px';
        this.placeholder.style.zIndex = '2';
        this.placeholder.style.position = 'relative';
    }
    createTable() {
        this.tableContainer = document.createElement('div');
        this.container.appendChild(this.tableContainer);
        this.tableContainer.style.position = 'fixed';
        this.tableContainer.style.width = '100%';
        this.tableContainer.style.height = '100%';
        this.tableContainer.style.overflow = 'hidden';
        this.tableContainer.style.zIndex = '1';
        this.tableContainer.style.top = '0';
        this.table = document.createElement('div');
        this.table.style.height = '100%';
        this.tableContainer.appendChild(this.table);
        this.headRow = document.createElement('div');
        this.headRow.style.position = 'sticky';
        this.headRow.style.top = 0;
        this.headRow.style.width =
            this.report.columns.reduce((p, c) => {
                return p + c.width;
            }, 0) + 'px';
        this.table.appendChild(this.headRow);
        this.table.style.borderTop = '1px solid #000';
        this.table.style.borderLeft = '1px solid #000';
        this.report.columns.forEach((column) => {
            const th = document.createElement('div');
            th.style.boxSizing = 'border-box';
            th.style.whiteSpace = 'nowrap';
            th.style.overflow = 'hidden';
            th.style.float = 'left';
            th.style.width = column.width + 'px';
            th.style.height = this.rowHeight + 'px';
            th.style.borderBottom = '1px solid #000';
            th.style.borderRight = '1px solid #000';
            th.style.zIndex = 4;
            th.style.backgroundColor = '#fff';
            this.headRow.appendChild(th);
            th.innerText = column.name;
            th.style.width = column.width + 'px';
        });
        this.tbody = document.createElement('div');
        this.table.appendChild(this.tbody);
        new ResizeObserver(() => {
            this.rows = [];
            this.tbody.innerHTML = '';
            for (
                let i = 0;
                i <
                Math.ceil(this.tableContainer.offsetHeight / this.rowHeight);
                i++
            ) {
                const row = {};
                const tr = document.createElement('div');
                this.tbody.appendChild(tr);
                this.rows.push(row);
                tr.style.width =
                    this.report.columns.reduce((p, c) => {
                        return p + c.width;
                    }, 0) + 'px';
                this.report.columns.forEach((column) => {
                    const td = document.createElement('div');
                    td.style.boxSizing = 'border-box';
                    td.style.overflow = 'hidden';
                    td.style.padding = 0;
                    td.style.borderBottom = '1px solid #000';
                    td.style.borderRight = '1px solid #000';
                    td.style.float = 'left';
                    td.style.width = column.width + 'px';
                    td.style.height = this.rowHeight + 'px';
                    td.style.whiteSpace = 'nowrap';
                    td.style.overflow = 'hidden';
                    td.style.textOverflow = 'ellipsis';
                    row[column.dataProperty] = td;
                    tr.appendChild(td);
                });
            }
            window.requestAnimationFrame(() => this.fillTable());
        }).observe(this.container);
    }
    fillTable() {
        const start = Math.floor(this.scrollTop / this.rowHeight);

        if (start === this.startIndex && this.scrollTop !== 0) return;

        if (
            this.startIndex < start &&
            start - this.startIndex < this.rows.length
        ) {
            for (let i = 0; i < start - this.startIndex; i++) {
                const row = this.rows.shift();
                const dataRow =
                    this.data[this.startIndex + this.rows.length + i + 1];
                Object.keys(row).forEach((key) => {
                    row[key].innerText = dataRow[key];
                });
                this.rows.push(row);
                this.tbody.appendChild(this.tbody.childNodes[0]);
            }
        } else {
            for (let i = start; i < start + this.rows.length; i++) {
                this.report.columns.forEach((column) => {
                    this.rows[i - start][column.dataProperty].innerText =
                        this.data[i][column.dataProperty];
                });
            }
        }
        this.startIndex = start;
    }
}
