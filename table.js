import sampleData from './sampleData.js';
import Global from './Global.js';

const report = new Global();
const tbody = document.getElementById('tbody');
const colgroup = document.getElementById('cg');
console.log(colgroup);

report.columns.forEach((column) => {
    const col = document.createElement('col');
    col.style.width = column.width + 'px';
    colgroup.appendChild(col);
});

sampleData.forEach((data, index) => {
    const tr = document.createElement('tr');
    report.columns.forEach((column) => {
        const td = document.createElement('td');
        td.style.width = column.width + 'px';
        td.innerText = data[column.dataProperty];
        tr.appendChild(td);
    });
    tbody.appendChild(tr);
});
