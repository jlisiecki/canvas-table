import ReportColumn from './ReportColumn.js';
export default class Global {
    constructor() {
        this.name = 'Global';
        this.filter = () => true;
        this.single = [];
        this.charts = [];
        this.columns = [
            new ReportColumn('#', 'id', true, 50),
            new ReportColumn('URL', 'href', true, 500),
            new ReportColumn('Indexable?', 'indexable'),
            new ReportColumn('Indexation Status', 'indexationStatus'),
            new ReportColumn('Content Type', 'contentType'),
            new ReportColumn('Status Code', 'statusCode'),
            new ReportColumn('Status Text', 'statusText'),
            new ReportColumn('Encoding', 'encoding'),
            new ReportColumn('Size', 'size'),
            new ReportColumn('Title', 'title'),
            new ReportColumn('Meta Description', 'metaDescription'),
            new ReportColumn('Meta Keywords', 'metaKeywords'),
            new ReportColumn('H1 First', 'h1First'),
            new ReportColumn('H1 Count', 'h1Count'),
            new ReportColumn('H2 First', 'h2First'),
            new ReportColumn('H2 Count', 'h2Count'),
            new ReportColumn('Outlinks', 'outLinksCount'),
            new ReportColumn('Text Content Length', 'textContentLength'),
            new ReportColumn('Images', 'imagesCount'),
            new ReportColumn('Redirect URL', 'redirectURL'),
            new ReportColumn('Canonical', 'canonicalUrl'),
            new ReportColumn('X-Robots-Tag', 'xRobotsTag'),
            new ReportColumn(
                'Is URL Blocked by robots.txt?',
                'isUrlBlockedByRobotsTxt'
            ),
            new ReportColumn('Meta Robots', 'metaRobots')
        ];
    }
    getColumn(dataProperty) {
        return this.columns.find(
            (column) => column.dataProperty === dataProperty
        );
    }
    deleteColumn(dataProperty) {
        const index = this.columns.indexOf(this.getColumn(dataProperty));
        if (index !== -1) this.columns.splice(index, 1);
    }
}
