<template>
    <div class="blackboard-wrapper">
        <div :class="['canvas-wrapper', {'eraser-cursor': tool === 'ERASER'}]" >
            <canvas id="blackboard-canvas" width="800" height="600"></canvas>
            <canvas id="drawing-canvas" width="800" height="600" v-show="showDrawingCanvas"></canvas>
        </div>
        <div class="save-button-wrapper">
            <el-button disabled class="my-button">保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types';

    interface Point {
        x: number;
        y: number;
    }
    @Component({
    })
    export default class Blackboard extends Vue {
        private drawing: boolean = false;
        private solid: boolean = true;
        private dash: number[] = [10, 10];
        private eraserColor: string = '#FFFFFF';
        private eraserWidth: number = 30;

        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private drawingCanvas!: HTMLCanvasElement;
        private drawingCtx!: CanvasRenderingContext2D;
        private showDrawingCanvas: boolean = false;
        // private canvasHistory: string[] = [];
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('tool') private tool!: string;
        @Getter('clear') private clear!: boolean;
        @Mutation(mutations.SET_CLEAR) private setClear!: any;

        private getMousePosition = (canvas: HTMLCanvasElement, x: number, y: number) => {
            const boundingClientRect = canvas.getBoundingClientRect();
            return {
                x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
                y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height),
            };
        }

        @Watch('tool')
        private toolChanged(newVal: string) {
            this.clearCanvasStatus();
            const type = newVal.split('_');
            if (type.length > 1) {
                this.solid = true;
            } else {
                this.solid = false;
            }
            switch (type[0].toUpperCase()) {
                case 'PEN':
                    this.toolPen();
                    break;
                case 'LINE':
                    this.toolLine();
                    break;
                case 'RECTANGLE':
                    this.toolRect();
                    break;
                case 'CIRCLE':
                    this.toolOval();
                    break;
                case 'TRIANGLE':
                    this.toolTriangle();
                    break;
                case 'ERASER':
                    this.toolEraser();
                    break;
            }
        }

        @Watch('clear')
        private clearBlackboard(newVal: boolean) {
            if (newVal) {
                const canvas = this.canvas;
                canvas.height = canvas.height;
                this.setClear(false);

            }
        }

        private toolPen() {
            const that = this;
            const canvas = this.canvas;
            const ctx = this.ctx;
            ctx.restore();
            canvas.onmousedown = (e) => {
                that.drawing = true;

                const { x, y } = that.getMousePosition(canvas, e.clientX, e.clientY);
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.thickness;
                ctx.moveTo(x, y);
                canvas.onmousemove = (event) => {
                    if (that.drawing) {
                        const { x, y } = this.getMousePosition(canvas, event.clientX, event.clientY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        ctx.save();
                    }
                };
            };

            canvas.onmouseup = () => {
                that.drawing = false;
                ctx.closePath();
            };
        }

        private toolLine() {
            this.showDrawingCanvas = true;
            const that = this;
            const ctx = this.ctx;
            let from!: Point;
            let to!: Point;

            const drawingCanvas = this.drawingCanvas;
            const drawingCtx = this.drawingCtx;
            drawingCanvas.onmousedown = (e) => {
                that.drawing = true;

                from = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                drawingCtx.beginPath();
                drawingCtx.moveTo(from.x, from.y);

                drawingCanvas.onmousemove = (event) => {

                    if (that.drawing) {
                        to = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                        drawingCanvas.height = drawingCanvas.height;
                        if (this.solid) {
                            drawingCtx.setLineDash(this.dash);
                        } else {
                            drawingCtx.setLineDash([]);
                        }
                        drawingCtx.strokeStyle = this.color;
                        drawingCtx.lineWidth = this.thickness;
                        drawingCtx.moveTo(from.x, from.y);
                        drawingCtx.lineTo(to.x, to.y);

                        drawingCtx.stroke();
                        drawingCtx.closePath();
                        drawingCtx.restore();
                    }
                };
            };

            drawingCanvas.onmouseup = () => {
                if (from && to && from !== to) {
                    drawingCanvas.height = drawingCanvas.height;
                    that.drawing = false;
                    ctx.beginPath();
                    if (this.solid) {
                        ctx.setLineDash(this.dash);
                    } else {
                        drawingCtx.setLineDash([]);
                    }
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = this.thickness;
                    ctx.moveTo(from.x, from.y);
                    ctx.lineTo(to.x, to.y);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
            };
        }

        private toolRect() {
            this.showDrawingCanvas = true;
            const that = this;
            const ctx = this.ctx;
            let from!: Point;
            let to!: Point;

            const drawingCanvas = this.drawingCanvas;
            const drawingCtx = this.drawingCtx;
            drawingCanvas.onmousedown = (e) => {
                that.drawing = true;

                from = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                drawingCtx.beginPath();
                drawingCtx.moveTo(from.x, from.y);

                drawingCanvas.onmousemove = (event) => {

                    if (that.drawing) {
                        to = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                        drawingCanvas.height = drawingCanvas.height;
                        if (this.solid) {
                            drawingCtx.fillStyle = this.color;
                            drawingCtx.fillRect(from.x, from.y, to.x - from.x, to.y - from.y);
                        } else {
                            drawingCtx.lineWidth = this.thickness;
                            drawingCtx.strokeStyle = this.color;
                            drawingCtx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
                        }
                    }
                };
            };

            drawingCanvas.onmouseup = () => {
                drawingCanvas.height = drawingCanvas.height;
                that.drawing = false;
                ctx.beginPath();
                if (this.solid) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(from.x, from.y, to.x - from.x, to.y - from.y);
                } else {
                    ctx.lineWidth = this.thickness;
                    ctx.strokeStyle = this.color;
                    ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
                }
                ctx.closePath();
            };
        }

        private drawOval(context: CanvasRenderingContext2D, from: Point, to: Point) {
            const start = {x: (from.x + to.x) / 2, y: (from.y + to.y) / 2};
            const a = Math.abs((from.x - to.x) / 2);
            const b = Math.abs((from.y - to.y) / 2);
            const ox = 0.5 * a;
            const oy = 0.6 * b;

            context.save();
            context.translate(start.x, start.y);
            context.beginPath();
            context.moveTo(0, b);
            context.bezierCurveTo(ox, b, a, oy, a, 0);
            context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
            context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
            context.bezierCurveTo(-a, oy, -ox, b, 0, b);
            context.closePath();
            if (this.solid) {
                context.fillStyle = this.color;
                context.fill();
            } else {
                context.lineWidth = this.thickness;
                context.strokeStyle = this.color;
                context.stroke();
            }
        }

        private toolOval() {
            this.showDrawingCanvas = true;
            const that = this;
            const ctx = this.ctx;
            let from!: Point;
            let to!: Point;

            const drawingCanvas = this.drawingCanvas;
            const drawingCtx = this.drawingCtx;
            drawingCanvas.onmousedown = (e) => {
                that.drawing = true;

                from = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                drawingCtx.beginPath();
                drawingCtx.moveTo(from.x, from.y);

                drawingCanvas.onmousemove = (event) => {

                    if (that.drawing) {
                        to = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                        drawingCanvas.height = drawingCanvas.height;
                        this.drawOval(drawingCtx, from, to);
                        drawingCtx.restore();
                        drawingCtx.closePath();

                    }
                };
            };

            drawingCanvas.onmouseup = () => {
                drawingCanvas.height = drawingCanvas.height;
                that.drawing = false;
                ctx.beginPath();
                this.drawOval(ctx, from, to);
                ctx.restore();
                ctx.closePath();
            };
        }

        private drawTriangle(point1: Point, point2: Point, point3: Point) {

        }

        private toolTriangle() {
            this.showDrawingCanvas = true;
            const that = this;
            const ctx = this.ctx;
            let from!: Point;
            let to!: Point;
            let top!: Point;
            let count = 0;

            const drawingCanvas = this.drawingCanvas;
            const drawingCtx = this.drawingCtx;
            drawingCanvas.onclick = (e) => {
              count += 1;
              ctx.strokeStyle = this.color;
              ctx.lineWidth = this.thickness;
              ctx.fillStyle = this.color;
              switch (count % 3) {
                  case 1:
                      from = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                  case 2:
                      to = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                      ctx.beginPath();
                      ctx.moveTo(from.x, from.y);
                      ctx.lineTo(to.x, to.y);
                      ctx.stroke();
                      break;
                  case 0:
                      top = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                      ctx.lineTo(top.x, top.y);
                      if (this.solid) {
                          ctx.fill();
                      } else {
                          ctx.stroke();
                          ctx.lineTo(from.x, from.y);
                          ctx.stroke();
                      }
                      ctx.closePath();
                      ctx.restore();
                      this.clearBlackboard();
                      this.toolTriangle();
                      break;
              }
            };
            drawingCanvas.onmousedown = (e) => {
                that.drawing = true;

                const source = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                drawingCtx.beginPath();
                drawingCtx.moveTo(source.x, source.y);

                drawingCanvas.onmousemove = (event) => {

                    if (that.drawing) {
                        const tar = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                        drawingCanvas.height = drawingCanvas.height;
                        drawingCtx.strokeStyle = this.color;
                        drawingCtx.lineWidth = this.thickness;
                        drawingCtx.moveTo(source.x, source.y);
                        drawingCtx.lineTo(tar.x, tar.y);

                        drawingCtx.stroke();
                    }
                };
            };

            drawingCanvas.onmouseup = () => {
                // drawingCanvas.height = drawingCanvas.height;
                // that.drawing = false;
                // ctx.beginPath();
                // if (this.solid) {
                //     ctx.setLineDash(this.dash);
                // }
                // ctx.strokeStyle = this.color;
                // ctx.lineWidth = this.thickness;
                // ctx.moveTo(from.x, from.y);
                // ctx.lineTo(to.x, to.y);
                // ctx.stroke();
                // ctx.closePath();
            };
        }

        private drawCircle(x: number, y: number, radius: number) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.save();
        }

        private toolEraser() {
            const that = this;
            const canvas = this.canvas;
            const ctx = this.ctx;
            ctx.restore();
            canvas.onmousedown = (e) => {
                that.drawing = true;
                ctx.fillStyle = this.eraserColor;
                canvas.onmousemove = (event) => {
                    if (that.drawing) {
                        const { x, y } = this.getMousePosition(canvas, event.clientX, event.clientY);
                        const radius = this.eraserWidth / 2;
                        this.drawCircle(x + radius, y + radius, radius);
                    }
                };
            };

            canvas.onclick = (e) => {
                const { x, y } = this.getMousePosition(canvas, e.clientX, e.clientY);
                const radius = this.eraserWidth / 2;
                this.drawCircle(x + radius, y + radius, radius);
            };

            canvas.onmouseup = () => {
                that.drawing = false;
                ctx.closePath();
            };
        }

        private clearCanvasStatus() {
            const canvas = this.canvas;
            const drawingCanvas = this.drawingCanvas;
            this.showDrawingCanvas = false;
            canvas.onmouseup = () => {return; };
            canvas.onclick = () => {return; };
            canvas.onmousedown = () => {return; };
            canvas.onmousemove = () => {return; };
            drawingCanvas.onmouseup = () => {return; };
            drawingCanvas.onclick = () => {return; };
            drawingCanvas.onmousedown = () => {return; };
            drawingCanvas.onmousemove = () => {return; };

            const ctx = this.ctx;
            const drawingCtx = this.drawingCtx;
            ctx.setLineDash([]);
            drawingCtx.setLineDash([]);
        }

        private mounted() {
            const canvas: HTMLCanvasElement = document.getElementById('blackboard-canvas') as HTMLCanvasElement;
            if (!canvas || !canvas.getContext('2d')) {
                return false;
            } else {
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                this.canvas = canvas;
                this.ctx = ctx;
                this.toolPen();
            }

            const drawingCanvas: HTMLCanvasElement = document.getElementById('drawing-canvas') as HTMLCanvasElement;
            if (!drawingCanvas || !drawingCanvas.getContext('2d')) {
                return false;
            } else {
                const drawingCtx = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
                this.drawingCanvas = drawingCanvas;
                this.drawingCtx = drawingCtx;
            }
        }
    }
</script>

<style scoped src="./Blackboard.less" lang="less">
</style>