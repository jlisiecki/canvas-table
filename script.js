import Global from './Global.js';
import sampleData from './sampleData.js';

(function (d, w) {
    let scrollY = 0;
    let scrollX = 0;
    let yStartIndex = 0;
    let yStopIndex = 0;
    const padding = 3;
    const fontSize = 13;
    const lineWidth = 1;

    const report = new Global();

    function binarySearch({ max, getValue, match }) {
        let min = 0;

        while (min <= max) {
            let guess = Math.floor((min + max) / 2);
            const compareVal = getValue(guess);

            if (compareVal === match) return guess;
            if (compareVal < match) min = guess + 1;
            else max = guess - 1;
        }

        return max;
    }

    function fitString(ctx, str, maxWidth) {
        let width = ctx.measureText(str).width;
        const ellipsis = '…';
        const ellipsisWidth = ctx.measureText(ellipsis).width;
        if (width <= maxWidth || width <= ellipsisWidth) {
            return str;
        }

        const index = binarySearch({
            max: str.length,
            getValue: (guess) => ctx.measureText(str.substring(0, guess)).width,
            match: maxWidth - ellipsisWidth
        });

        return str.substring(0, index) + ellipsis;
    }

    function draw(canvas) {
        if (!canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        // clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        yStartIndex = Math.floor(
            -scrollY / (fontSize + 2 * padding + 2 * lineWidth)
        );

        yStopIndex = Math.ceil(
            (canvas.height - scrollY) / (fontSize + 2 * padding + 2 * lineWidth)
        );

        for (let index = yStartIndex; index <= yStopIndex; index++) {
            const data = sampleData[index];
            let columnPosition = 0;
            report.columns.forEach((column) => {
                if (columnPosition + column.width < -scrollX) {
                    columnPosition += column.width;
                    return;
                }
                if (columnPosition > canvas.width - scrollX) {
                    columnPosition += column.width;
                    return;
                }
                cell(
                    ctx,
                    index,
                    columnPosition,
                    column.width,
                    data?.[column.dataProperty]?.toString() || ''
                );
                columnPosition += column.width;
            });
        }
    }

    function cell(ctx, rowNumber, columnPosition, rowWidth, text) {
        const rowHeight = fontSize + padding * 2 + lineWidth * 2;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'black';

        ctx.strokeRect(
            columnPosition + scrollX + 0.5,
            rowNumber * rowHeight + scrollY + 0.5,
            rowWidth,
            rowHeight
        );

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.fillText(
            fitString(ctx, text, rowWidth - padding * 2),
            scrollX + columnPosition + padding,
            scrollY +
                rowNumber * rowHeight +
                (rowHeight - padding - lineWidth * 2 - 0.5)
        );
    }

    const canvasContainer = d.getElementById('canvas-container');
    const canvas = canvasContainer?.getElementsByTagName('canvas')?.[0];
    const div = canvasContainer?.getElementsByTagName('div')?.[0];
    if (canvas) {
        div.style.height = `${
            sampleData.length * (lineWidth * 2 + padding * 2 + fontSize)
        }px`;
        div.style.width = `${report.columns.reduce((pV, cV) => {
            return pV + cV.width;
        }, 0)}px`;
        new ResizeObserver(() => {
            canvas.width = canvasContainer.clientWidth;
            canvas.height = canvasContainer.clientHeight;
            draw(canvas);
        }).observe(canvasContainer);

        canvasContainer.onscroll = (ev) => {
            scrollY = -canvasContainer.scrollTop;
            scrollX = -canvasContainer.scrollLeft;
            draw(canvas);
        };
    }
})(document, window);
