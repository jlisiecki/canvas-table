(function (d, w) {
    let scrollY = 0;
    let scrollX = 0;

    function draw(canvas) {
        if (!canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(scrollX, scrollY, 50, 50);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(
            canvas.width - 50 + scrollX,
            canvas.height - 50 + scrollY,
            50,
            50
        );
    }

    const canvasContainer = d.getElementById('canvas-container');
    const canvas = canvasContainer?.getElementsByTagName('canvas')?.[0];
    if (canvas) {
        new ResizeObserver(() => {
            canvas.width = canvasContainer.clientWidth;
            canvas.height = canvasContainer.clientHeight;
            draw(canvas);
        }).observe(canvasContainer);

        canvas.onwheel = (ev) => {
            ev.preventDefault();
            scrollY += ev.deltaY * 0.2;
            scrollY = scrollY < 0 ? 0 : scrollY;
            scrollX += ev.deltaX * 0.2;
            scrollX = scrollX < 0 ? 0 : scrollX;
            draw(canvas);
        };
    }
})(document, window);
