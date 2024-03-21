const Rect = (x, y, w, h) => {
    return { x, y, w, h };
};

const getElements = (container, selector) =>
    Array.from(container.querySelectorAll(selector));

const drawRect = (rect, style, canvasCtx) => {
    canvasCtx.beginPath();
    canvasCtx.rect(rect.x, rect.y, rect.w, rect.h);
    canvasCtx.fillStyle = style;
    canvasCtx.fill();
};

export const resizeCanvas = (canvas, w, h) => {
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
};

const rectOfElement = (el, container, options) => {
    const { x, y } = container.getBoundingClientRect();
    const elementDim = el.getBoundingClientRect();
    const hRatio = options.height / container.scrollHeight;
    const wRatio = options.width / container.scrollWidth;
    return Rect(
        (elementDim.x - x) * wRatio,
        (elementDim.y - y + container.scrollTop) * hRatio,
        el.offsetWidth * wRatio,
        el.offsetHeight * hRatio
    );
};

const rectOfViewport = (options, container) => {
    const hRatio = options.height / container.scrollHeight;
    const wRatio = options.width / container.scrollWidth;
    return Rect(
        window.scrollX * hRatio,
        window.scrollY * hRatio,
        window.innerWidth * wRatio,
        window.innerHeight * hRatio
    );
};

const drawContent = (options, container, context) => {
    Object.keys(options.selector).forEach((sel) => {
        getElements(container, sel).forEach((element) => {
            drawRect(
                rectOfElement(element, container, options),
                options.selector[sel],
                context
            );
        });
    });
};

const drawBackground = (options, container, context) => {
    const hRatio = options.height / container.scrollHeight;
    const wRatio = options.width / container.scrollWidth;
    drawRect(
        Rect(0, 0, container.scrollWidth * wRatio, container.scrollHeight * hRatio),
        options.background,
        context
    );
};

export const draw = (options, ctx, containerRef, isDrag) => {
    ctx.clearRect(0, 0, options.width, options.height);
    //draw background
    drawBackground(options, containerRef, ctx);
    //content
    drawContent(options, containerRef, ctx);
    //viewPort
    drawRect(
        rectOfViewport(options, containerRef),
        isDrag ? options.drag : options.viewport,
        ctx
    );
};
