<template>
    <div class="blackboard-wrapper">
        <div :class="['canvas-wrapper', {'eraser-cursor': tool === 'ERASER'}]">
            <canvas id="setting-canvas" width="800" height="600" v-show="showSettingCanvas"></canvas>
            <canvas id="blackboard-canvas" width="800" height="600"></canvas>
            <canvas id="drawing-canvas" width="800" height="600" v-show="showDrawingCanvas"></canvas>
        </div>
        <div class="save-button-wrapper">
            <el-button class="my-button my-button-medium">R U N</el-button>
            <el-button :disabled="disableSave" class="my-button my-button-medium" @click="saveCanvas">S A V E</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types';
    import {Blackboard, Point, Stroke, User} from '../../store';
    import * as tools from '../../base/tools';

    @Component({})
    export default class SingleBlackboard extends Vue {
        private drawing: boolean = false;
        private solid: boolean = true;
        private dash: number[] = [10, 10];
        private eraserColor: string = '#FFFFFF';
        private eraserWidth: number = 30;

        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private drawingCanvas!: HTMLCanvasElement;
        private drawingCtx!: CanvasRenderingContext2D;
        private settingCanvas!: HTMLCanvasElement;
        private settingCtx!: CanvasRenderingContext2D;
        private showDrawingCanvas: boolean = false;
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('tool') private tool!: string;
        @Getter('clear') private clear!: boolean;
        @Getter('currentStrokes') private currentStrokes!: Stroke[];
        @Getter('undoStrokes') private undoStrokes!: Stroke[];
        @Getter('blackboard') private curBlackboard!: Blackboard;
        @Getter('blackboards') private blackboards!: Blackboard[];
        @Getter('tarBlackboard') private tarBlackboard!: Blackboard;
        @Getter('logStatus') private logStatus!: boolean;
        @Getter('logUser') private logUser!: User;
        @Getter('saveCurrentCanvasStatus') private saveCurrentCanvasStatus!: boolean;
        @Mutation(mutations.SET_CLEAR) private setClear!: any;
        @Mutation(mutations.DRAW_STROKE) private drawStroke!: any;
        @Mutation(mutations.SET_SAVE_CURRENT_CANVAS) private setSaveCurrentCanvas!: any;
        @Mutation(mutations.CHANGE_CANVAS) private changeCanvas!: any;
        @Mutation(mutations.CLEAR_BLACKBOARDS) private clearBlackboards!: any;
        @Action('saveBlackboardAction') private saveBlackboardAction!: any;
        @Getter('selectedStroke') private selectedStroke!: Stroke;

        get disableSave() {
            if (!this.logStatus || this.blackboards.length === 0) {
                return true;
            }
            return this.curBlackboard.strokes.toString() == this.currentStrokes.toString();
        }

        get showSettingCanvas() {
            return this.tool === tools.SETTING;
        }

        private getMousePosition = (canvas: HTMLCanvasElement, x: number, y: number) => {
            const boundingClientRect = canvas.getBoundingClientRect();
            return {
                x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
                y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height),
            };
        };

        @Watch('saveCurrentCanvasStatus')
        private saveCurrentCanvas(newVal: boolean) {
            if (newVal) {
                this.saveCanvas();
                setTimeout(() => {
                    this.changeCanvas(this.tarBlackboard);
                    this.setSaveCurrentCanvas({status: false, tarBlackboard: {id: '', strokes: [], thumbnail: '', createdAt: 0}});
                }, 100);
            }
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

        @Watch('currentStrokes')
        private strokeChanged() {
            const canvas = this.canvas;
            canvas.height = canvas.height;
            this.redrawCanvas(this.currentStrokes);
        }

        @Watch('logStatus')
        private logOutClearCanvas() {
            if (this.logStatus === false) {
                this.clearBlackboards();
            }
        }

        @Watch('selectedStroke', {deep: true})
        private changeSelectedStroke() {
            console.log(this.selectedStroke)
        }

        private redoPen(stroke: Stroke) {
            const ctx = this.ctx;
            const points: Point[] = stroke.points;
            if (points.length === 0) {
                return;
            }
            const start = points[0];
            ctx.beginPath();
            if (stroke.solid) {
                ctx.setLineDash(this.dash);
            } else {
                ctx.setLineDash([]);
            }
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.thickness;
            ctx.moveTo(start.x, start.y);
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
            ctx.save();
            ctx.closePath();
        }

        private toolPen() {
            const that = this;
            const canvas = this.canvas;
            const ctx = this.ctx;
            let points: Point[] = [];
            ctx.restore();
            canvas.onmousedown = (e) => {
                that.drawing = true;

                const {x, y} = that.getMousePosition(canvas, e.clientX, e.clientY);
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.thickness;
                ctx.moveTo(x, y);
                points.push(new Point(x, y));
                canvas.onmousemove = (event) => {
                    if (that.drawing) {
                        const {x, y} = this.getMousePosition(canvas, event.clientX, event.clientY);
                        points.push(new Point(x, y));
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        ctx.save();
                    }
                };
            };

            canvas.onmouseup = () => {
                this.drawStroke(new Stroke(tools.PEN, points, this.color, this.thickness));
                that.drawing = false;
                ctx.closePath();
                points = [];
            };

        }

        private redoLine(stroke: Stroke) {
            if (stroke.points.length !== 2) {
                return;
            }
            const ctx = this.ctx;
            const from = stroke.points[0];
            const to = stroke.points[1];
            ctx.beginPath();
            if (stroke.solid) {
                ctx.setLineDash(this.dash);
            } else {
                ctx.setLineDash([]);
            }
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.thickness;
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.closePath();
            ctx.save();
        }

        private toolLine() {
            this.showDrawingCanvas = true;
            const that = this;
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
                    const stroke = new Stroke(tools.LINE, [from, to], this.color, this.thickness, this.solid);
                    this.redoLine(stroke);
                    this.drawStroke(stroke);
                    this.drawing = false;
                }
            };
        }

        private redoRect(stroke: Stroke) {
            if (stroke.points.length !== 2) {
                return;
            }
            const ctx = this.ctx;
            const from = stroke.points[0];
            const to = stroke.points[1];
            ctx.beginPath();
            ctx.setLineDash([]);
            if (stroke.solid) {
                ctx.fillStyle = stroke.color;
                ctx.fillRect(from.x, from.y, to.x - from.x, to.y - from.y);
            } else {
                ctx.lineWidth = stroke.thickness;
                ctx.strokeStyle = stroke.color;
                ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
            }
            ctx.closePath();
        }

        private toolRect() {
            this.showDrawingCanvas = true;
            const that = this;
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
                let stoke = new Stroke(tools.RECTANGLE, [from, to], this.color, this.thickness, this.solid);
                this.redoRect(stoke);
                this.drawStroke(stoke);
            };
        }

        private drawOval(context: CanvasRenderingContext2D, from: Point, to: Point, color: string, thickness: number, solid: boolean) {
            const start = {x: (from.x + to.x) / 2, y: (from.y + to.y) / 2};
            const a = Math.abs((from.x - to.x) / 2);
            const b = Math.abs((from.y - to.y) / 2);
            const ox = 0.5 * a;
            const oy = 0.6 * b;

            context.save();
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.translate(start.x, start.y);
            context.moveTo(0, b);
            context.bezierCurveTo(ox, b, a, oy, a, 0);
            context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
            context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
            context.bezierCurveTo(-a, oy, -ox, b, 0, b);
            if (solid) {
                context.fillStyle = color;
                context.fill();
            } else {
                context.lineWidth = thickness;
                context.strokeStyle = color;
                context.stroke();
            }
            context.restore();
            context.closePath();
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
                        this.drawOval(drawingCtx, from, to, this.color, this.thickness, this.solid);
                        drawingCtx.restore();
                        drawingCtx.closePath();

                    }
                };
            };

            drawingCanvas.onmouseup = () => {
                drawingCanvas.height = drawingCanvas.height;
                that.drawing = false;
                ctx.beginPath();
                let stoke = new Stroke(tools.CIRCLE, [from, to], this.color, this.thickness, this.solid);
                this.drawOval(ctx, stoke.points[0], stoke.points[1], stoke.color, stoke.thickness, stoke.solid);
                ctx.restore();
                ctx.closePath();
                this.drawStroke(stoke);
            };
        }

        private redoTriangle(context: CanvasRenderingContext2D, stroke: Stroke) {
            const ctx = context;
            if (stroke.points.length !== 3) {
                return;
            }
            let [from, to, top] = stroke.points;
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.thickness;
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.lineTo(from.x, from.y);
            ctx.stroke();
            ctx.lineTo(top.x, top.y);
            ctx.stroke();
            ctx.closePath();

            if (stroke.solid) {
                ctx.fillStyle = stroke.color;
                ctx.fill();
            }
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
                        drawingCtx.beginPath();
                        drawingCtx.moveTo(from.x, from.y);
                        this.drawing = true;

                        drawingCanvas.onmousemove = (event) => {

                            if (that.drawing) {
                                const tar = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                                drawingCanvas.height = drawingCanvas.height;
                                drawingCtx.strokeStyle = this.color;
                                drawingCtx.lineWidth = this.thickness;
                                drawingCtx.moveTo(from.x, from.y);
                                drawingCtx.lineTo(tar.x, tar.y);

                                drawingCtx.stroke();
                            }
                        };
                        break;
                    case 2:
                        to = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                        ctx.beginPath();
                        ctx.moveTo(from.x, from.y);
                        ctx.lineTo(to.x, to.y);
                        ctx.stroke();
                        drawingCanvas.onmousemove = (event) => {

                            if (that.drawing) {
                                const tar = this.getMousePosition(drawingCanvas, event.clientX, event.clientY);
                                drawingCanvas.height = drawingCanvas.height;
                                this.redoTriangle(drawingCtx, new Stroke(tools.TRIANGLE, [from, to, tar], this.color, this.thickness, this.solid));
                            }
                        };
                        break;
                    case 0:
                        top = that.getMousePosition(drawingCanvas, e.clientX, e.clientY);
                        let stroke = new Stroke(tools.TRIANGLE, [from, to, top], this.color, this.thickness, this.solid);
                        this.redoTriangle(ctx, stroke);
                        this.drawStroke(stroke);
                        that.drawing = false;
                        drawingCanvas.height = drawingCanvas.height;
                        this.toolTriangle();
                        break;
                }
            };
        }

        private drawCircle(x: number, y: number, radius: number) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.save();
        }

        private redoEraser(stroke: Stroke) {
            const ctx = this.ctx;
            const points: Point[] = stroke.points;
            if (points.length === 0) {
                return;
            }
            const start = points[0];
            ctx.beginPath();
            ctx.fillStyle = this.eraserColor;
            ctx.moveTo(start.x, start.y);
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                const radius = this.eraserWidth / 2;
                this.drawCircle(point.x + radius, point.y + radius, radius);
            }
            ctx.save();
            ctx.closePath();
        }

        private toolEraser() {
            const that = this;
            const canvas = this.canvas;
            const ctx = this.ctx;
            let points: Point[] = [];
            ctx.restore();
            canvas.onmousedown = (e) => {
                that.drawing = true;
                ctx.fillStyle = this.eraserColor;
                canvas.onmousemove = (event) => {
                    if (that.drawing) {
                        const {x, y} = this.getMousePosition(canvas, event.clientX, event.clientY);
                        points.push(new Point(x, y));
                        const radius = this.eraserWidth / 2;
                        this.drawCircle(x + radius, y + radius, radius);
                    }
                };
            };

            canvas.onclick = (e) => {
                const {x, y} = this.getMousePosition(canvas, e.clientX, e.clientY);
                points.push(new Point(x, y));
                const radius = this.eraserWidth / 2;
                this.drawCircle(x + radius, y + radius, radius);
            };

            canvas.onmouseup = () => {
                that.drawing = false;
                ctx.closePath();
                canvas.height = canvas.height;
                this.redoEraser(new Stroke(tools.ERASER, points, this.color, this.thickness));
                this.drawStroke(new Stroke(tools.ERASER, points, this.color, this.thickness));
                points = [];
            };
        }

        private clearCanvasStatus() {
            const canvas = this.canvas;
            const drawingCanvas = this.drawingCanvas;
            this.showDrawingCanvas = false;
            canvas.onmouseup = () => {
                return;
            };
            canvas.onclick = () => {
                return;
            };
            canvas.onmousedown = () => {
                return;
            };
            canvas.onmousemove = () => {
                return;
            };
            drawingCanvas.onmouseup = () => {
                return;
            };
            drawingCanvas.onclick = () => {
                return;
            };
            drawingCanvas.onmousedown = () => {
                return;
            };
            drawingCanvas.onmousemove = () => {
                return;
            };

            const ctx = this.ctx;
            const drawingCtx = this.drawingCtx;
            ctx.setLineDash([]);
            drawingCtx.setLineDash([]);
        }

        private redrawCanvas(strokes: Stroke[]) {
            const ctx = this.ctx;
            for(let i = 0; i < strokes.length; i++) {
                let stroke = strokes[i];
                switch (stroke.type) {
                    case tools.PEN:
                        this.redoPen(stroke);
                        break;
                    case tools.LINE:
                        this.redoLine(stroke);
                        break;
                    case tools.RECTANGLE:
                        this.redoRect(stroke);
                        break;
                    case tools.CIRCLE:
                        this.drawOval(ctx, stroke.points[0], stroke.points[1], stroke.color, stroke.thickness, stroke.solid);
                        break;
                    case tools.TRIANGLE:
                        this.redoTriangle(ctx, stroke);
                        break;
                    case tools.ERASER:
                        this.redoEraser(stroke);
                        break;

                }
            }
        }

        private saveCanvas() {
            var data = this.canvas.toDataURL('image/png', 1 );
            this.saveBlackboardAction({
                user: this.logUser.id,
                canvas: data,
                onError: (message: string) => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: message,
                    })
                }
            })
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

            const settingCanvas: HTMLCanvasElement = document.getElementById('setting-canvas') as HTMLCanvasElement;
            if (!settingCanvas || !settingCanvas.getContext('2d')) {
                return false;
            } else {
                const settingCtx = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
                this.settingCanvas = drawingCanvas;
                this.settingCtx = settingCtx;
            }
        }
    }
</script>

<style scoped src="./Blackboard.less" lang="less">
</style>