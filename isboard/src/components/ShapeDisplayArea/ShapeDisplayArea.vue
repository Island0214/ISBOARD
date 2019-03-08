<template>
    <div class="shape-display-area-wrapper">
        <div :class="['canvas-wrapper']">
            <div :class="['spot-wrapper']" :style="spot1Css" id="move-spot-1" v-if="showSpot1"></div>
            <canvas id="rectangle-canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
            <!--<canvas id="setting-canvas" width="800" height="600" v-show="showSettingCanvas"></canvas>-->
            <!--<canvas id="blackboard-canvas" width="800" height="600"></canvas>-->
            <!--<canvas id="drawing-canvas" width="800" height="600" v-show="showDrawingCanvas"></canvas>-->
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {FoldingRectangle, Point} from '../../store';
    import {Getter, Mutation} from 'vuex-class';
    import * as rectTypes from '../../base/rectangle-folding'
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class ShapeDisplayArea extends Vue {
        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private canvasWidth: number = 800;
        private canvasHeight: number = 600;
        private dash: number[] = [5, 5];
        private fontSize: number = 24;
        private textMargin: number = 10;
        private spot1: Point = {x: 350, y: 150};
        private spot2: Point = {x: 0, y: 0};
        private minX: number = 150;
        private maxX: number = 650;
        private minY: number = 150;
        private maxY: number = 450;

        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('foldingRectangles') private foldingRectangles!: FoldingRectangle[];
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
        @Mutation(mutations.SET_FOLDING_RECT_THUMBNAILS) private setFoldingRectThumbnailsMutation!: any;
        get spot1Css() {
            return {
                marginLeft: this.spot1.x - this.thickness * 1.25 + 'px',
                marginTop: this.spot1.y - this.thickness * 1.25 + 'px',
                width: this.thickness * 2.5 + 'px',
                height: this.thickness * 2.5 + 'px',
            }
        }

        get showSpot1() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_A;
        }

        private moveSpot() {
            const moveSpot1 = document.getElementById('move-spot-1');
            if (moveSpot1 === null) {
                return;
            }
            moveSpot1.onmousedown = (e) => {
                document.onmousemove = (event) => {
                    const {x, y} = this.getMousePosition(this.canvas, event.clientX, event.clientY);
                    if (this.minX < x && x < this.maxX) {
                        this.spot1.x = x;
                    }
                };
            };

            moveSpot1.onmouseup = () => {
                document.onmousemove = null;
                this.drawRectFoldingTypeA(500, 300, this.spot1);
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                this.drawRectFoldingTypeA(500, 300, this.spot1);
            };
        }

        private redoLine(from: Point, to: Point, dash: number[]) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.setLineDash(dash);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.closePath();
            ctx.save();
        }

        private drawTriangle(points: Point[], dash: number[]) {
            const ctx = this.ctx;
            if (points.length !== 3) {
                return;
            }
            let [from, to, top] = points;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            ctx.setLineDash(dash);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.lineTo(from.x, from.y);
            ctx.stroke();
            // ctx.lineTo(top.x, top.y);
            // ctx.stroke();
            ctx.closePath();
        }

        private drawPolygon(points: Point[], dash: number[]) {
            const ctx = this.ctx;
            if (points.length < 2) {
                return;
            }
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            ctx.setLineDash(dash);
            let start = points[0];
            let cur = points[1];
            let next = points[1];

            ctx.moveTo(start.x, start.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
            for (let i = 2; i < points.length; i++) {
                next = points[i];
                // ctx.moveTo(cur.x, cur.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
                cur = next;
            }
            // ctx.moveTo(cur.x, cur.y);
            ctx.lineTo(start.x, start.y);
            ctx.stroke();
            ctx.closePath();
        }

        private drawPath(points: Point[], dash: number[]) {
            const ctx = this.ctx;
            if (points.length < 2) {
                return;
            }
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.thickness;
            ctx.setLineDash(dash);
            let start = points[0];
            let cur = points[1];
            let next = points[1];

            ctx.moveTo(start.x, start.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
            for (let i = 2; i < points.length; i++) {
                next = points[i];
                // ctx.moveTo(cur.x, cur.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
                cur = next;
            }
            ctx.closePath();
        }

        private drawRectFoldingTypeA(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
            // this.spot1 = point;
            const ctx = this.ctx;
            ctx.font = 'bold ' + (this.fontSize * 3 / 2) + 'px Arial';
            ctx.fillText('E', point.x - this.fontSize / 2, point.y - this.textMargin);
            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            ctx.fillText('A', pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);
            const pointB = new Point(pointA.x, pointA.y + height);
            ctx.fillText('B', pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);
            const pointC = new Point(pointA.x + width, pointA.y + height);
            ctx.fillText('C', pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);
            const pointD = new Point(pointA.x + width, pointA.y);
            ctx.fillText('D', pointD.x + this.textMargin, pointD.y - this.textMargin);

            this.drawPath([pointB, pointA, point], this.dash);
            this.drawPolygon([pointB, pointC, pointD, point], []);

            // find the symmetric point
            const a = pointB.y - pointA.y;
            const b = pointA.x - point.x;
            const c = a * b;
            const x = -2 * a * c / (Math.pow(b, 2) + Math.pow(a, 2));
            const y = -2 * b * c / (Math.pow(b, 2) + Math.pow(a, 2));
            const pointF = new Point(x + pointA.x, -y + pointA.y);
            ctx.fillText('F', pointF.x + this.textMargin, pointF.y + this.fontSize / 2);
            this.drawPath([pointB, pointF, point], []);

            // find new cross point
            if (pointF.y > this.maxY) {
                const transPointE = new Point(point.x - pointB.x, pointB.y - point.y);
                const transPointF = new Point(pointF.x - pointB.x, pointB.y - pointF.y);
                const newPointX = transPointE.y * (transPointF.x  - transPointE.x) / (transPointE.y - transPointF.y) + transPointE.x + pointB.x;
                const pointG = new Point(newPointX, pointB.y);
                ctx.fillText('G', pointG.x - this.fontSize - this.textMargin, pointG.y - this.fontSize / 2);
            }
        }

        private drawRectFoldingTypeB(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
        }

        private drawRectFoldingTypeC(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
        }

        private getMousePosition = (canvas: HTMLCanvasElement, x: number, y: number) => {
            const boundingClientRect = canvas.getBoundingClientRect();
            return {
                x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
                y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height),
            };
        };

        private setRectangleBasicInfo(rect: FoldingRectangle) {
            this.minX = (this.canvasWidth - rect.width) / 2;
            this.maxX = this.canvasWidth - this.minX;
            this.minY = (this.canvasHeight - rect.height) / 2;
            this.maxY = this.canvasHeight - this.minY;
            switch (rect.type) {
                case rectTypes.TYPE_A:
                    this.drawRectFoldingTypeA(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot();
                    }, 100);
                    break;
                case rectTypes.TYPE_B:
                    this.drawRectFoldingTypeB(rect.width, rect.height, rect.points[0]);
                    break;
                case rectTypes.TYPE_C:
                    this.drawRectFoldingTypeC(rect.width, rect.height, rect.points[0]);
                    break;
            }
        }

        private updateFoldingThumbnails() {
            let thumbnails: string[] = [];
            for (let i = 0; i < this.foldingRectangles.length; i++) {
                const rect = this.foldingRectangles[i];
                this.setRectangleBasicInfo(rect);
                const data = this.canvas.toDataURL('image/png', 1 );
                thumbnails.push(data);
            }
            this.setFoldingRectThumbnailsMutation(thumbnails);
        }

        @Watch('selectedFoldingRectangle')
        private watchSelectedFoldingRectangle() {
            this.setRectangleBasicInfo(this.selectedFoldingRectangle);
        }

        private mounted() {
            const canvas: HTMLCanvasElement = document.getElementById('rectangle-canvas') as HTMLCanvasElement;
            if (!canvas || !canvas.getContext('2d')) {
                return false;
            } else {
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                this.canvas = canvas;
                this.ctx = ctx;
            }

            this.updateFoldingThumbnails();

            this.setRectangleBasicInfo(this.selectedFoldingRectangle);
            this.moveSpot();
        }
    }
</script>

<style scoped lang="less" src="./ShapeDisplayArea.less">

</style>