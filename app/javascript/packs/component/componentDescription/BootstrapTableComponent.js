export default class BootstrapTableComponent {
	constructor(element) {
		this.container = element;
		this.config = this.configuration();
		this.createWrapper();
		this.createTable();
	}

	createWrapper() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('table-responsive');
		this.container.appendChild(this.wrapper);
	}

	createTable() {
		this.tableElement = document.createElement('table');
		this.tableElement.classList.add('table', 'table-striped', 'table-hover', 'table-sm');
		this.wrapper.appendChild(this.tableElement);

		this.createThead();
		this.createTbody();
		this.createTfooter();
	}

	createThead() {
		const thead = document.createElement('thead');
		this.tableElement.appendChild(thead);

		const tr = document.createElement('tr');
		thead.appendChild(tr);

		this.config.columns.forEach((column) => {
			const th = document.createElement('th');
			const thText = document.createElement('span');
			th.setAttribute('scope', 'col');
			thText.textContent = column.name;
			tr.appendChild(th);
			th.appendChild(thText);
		});
	}

	createResizeEmptySpace(extraClass) {
		const div = document.createElement('div');
		div.classList.add('tabulator-col-resize-handle');
		if (extraClass) div.classList.add(extraClass);
		return div;
	}

	createTbody() {
		this.tbody = document.createElement('tbody');
		this.tableElement.appendChild(this.tbody);
	}

	createTfooter() {
		const tfooter = document.createElement('div');
		this.tableElement.appendChild(tfooter);
	}
	onData(data, sub) {
		console.log('onData', data);
		const array = this.config.topElement(data);
		const maxRows = 10;

		array.forEach((rowData) => {
			const tr = document.createElement('tr');
			this.tbody.appendChild(tr);
			this.config.columns.forEach(async (column) => {
				const td = document.createElement('td');
				const textCell = document.createElement('span');
				td.classList.add('tabulator-cell', 'ellipsis');
				td.setAttribute('role', 'gridcell');
				if (column.type === 'link') {
					this.createLinkCellContent(textCell, rowData, column);
				} else {
					textCell.textContent = column.cell(rowData);
				}
				if (column.type === 'date') {
					this.createDateCellContent(textCell, rowData, column);
				}
				tr.appendChild(td);
				td.appendChild(textCell);
				if (column.rendering) {
					const div = await column.rendering(column.cell(rowData));
					td.style.display = 'flex';
					td.style.alignItems = 'center';
					td.style.justifyContent = 'center';
					td.removeChild(textCell);
					td.appendChild(div);
				}
			});
			if (sub) {
				this.tbody.insertBefore(tr, this.tbody.firstChild);
				if (this.tbody.childElementCount > maxRows) {
					this.tbody.removeChild(this.tbody.lastChild);
				}
			} else {
				this.tbody.appendChild(tr);
			}
		});
	}

	createDateCellContent(textCell, rowData, column) {
		const result = new Date(column.cell(rowData)).toLocaleString();
		textCell.textContent = result;
	}

	createLinkCellContent(textCell, rowData, column) {
		const link = document.createElement('a');
		link.setAttribute('target', 'blank');
		link.href = `${column.cell(rowData)}`; // Change  URL
		link.textContent = column.cell(rowData);
		textCell.appendChild(link);
	}
}

class GoogleChartsTableComponent {
	constructor(element, queryMetaInfo) {
		this.table = new google.visualization.Table(element);
		this.data = new google.visualization.DataTable();
		this.options = {
			allowHtml: true,
			showRowNumber: false,
			width: '100%',
			height: '100%',
			sortColumn: 0,
			sortAscending: false,
		};
		this.config = this.configuration();
		this.config.columns.forEach((column) => {
			this.data.addColumn(column.type ? column.type : 'string', column.name);
		});
		this.table.draw(this.data, this.options);
	}

	onData(data) {
		let array = this.config.topElement(data);
		let rows = [];
		array.forEach((rowData) => {
			let row = [];
			this.config.columns.forEach((column) => row.push(column.cell(rowData)));
			rows.push(row);
		});
		this.data.addRows(rows);
		this.table.draw(this.data, this.options);
	}
}
