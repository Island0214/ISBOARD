<template>
    <div class="shape-display-area-wrapper">
        <div :class="['canvas-wrapper']">
            <div :class="['spot-wrapper']" :style="spot1Css" id="move-spot-1" v-if="showSpot1"></div>
            <!--<div :class="['spot-wrapper']" :style="spot2Css" id="move-spot-2" v-if="showSpot2"></div>-->
            <canvas id="rectangle-canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
            <!--<canvas id="setting-canvas" width="800" height="600" v-show="showSettingCanvas"></canvas>-->
            <!--<canvas id="blackboard-canvas" width="800" height="600"></canvas>-->
            <!--<canvas id="drawing-canvas" width="800" height="600" v-show="showDrawingCanvas"></canvas>-->
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {FoldingRectangle, Point, Node} from '../../store';
    import {Getter, Mutation} from 'vuex-class';
    import * as rectTypes from '../../base/rectangle-folding'
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class ShapeDisplayArea extends Vue {
        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private dash: number[] = [5, 5];
        private fontSize: number = 24;
        private textMargin: number = 10;
        private spot1: Point = new Point(450, 150);
        private spot2: Point = {x: 300, y: 450};
        private minX: number = 150;
        private maxX: number = 650;
        private minY: number = 150;
        private maxY: number = 450;
        private allPoints: Node[]= [];

        @Getter('canvasWidth') private canvasWidth!: number;
        @Getter('canvasHeight') private canvasHeight!: number;
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('foldingRectangles') private foldingRectangles!: FoldingRectangle[];
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
        @Mutation(mutations.SET_FOLDING_RECT_THUMBNAILS) private setFoldingRectThumbnailsMutation!: any;
        @Mutation(mutations.SET_NODES) private setNodesMutation!: any;
        @Mutation(mutations.UPDATE_SELECTED_FOLDING) private updateSelectedFoldingMutation!: any;
        get spot1Css() {
            return {
                marginLeft: this.spot1.x - this.thickness * 1.25 + 'px',
                marginTop: this.spot1.y - this.thickness * 1.25 + 'px',
                width: this.thickness * 2.5 + 'px',
                height: this.thickness * 2.5 + 'px',
            }
        }

        get spot2Css() {
            return {
                marginLeft: this.spot2.x - this.thickness * 1.25 + 'px',
                marginTop: this.spot2.y - this.thickness * 1.25 + 'px',
                width: this.thickness * 2.5 + 'px',
                height: this.thickness * 2.5 + 'px',
            }
        }

        get showSpot1() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_A
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_B
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_D;
        }

        get showSpot2() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_D;
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
                this.updateCurrentFolding();
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                this.updateCurrentFolding();
            };
        }

        private updateCurrentFolding() {
            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    // this.updateSelectedFoldingMutation([new Point(this.spot1.x, this.minY)]);
                    break;
            }
            this.updateFoldingThumbnails();
            this.setRectangleBasicInfo(this.selectedFoldingRectangle);
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
            ctx.lineTo(points[1].x, points[1].y);
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

        private addNewPoint(name: string, point: Point, positionX: number, positionY: number) {
            const ctx = this.ctx;
            ctx.font = 'bold ' + (this.fontSize * 3 / 2) + 'px Arial';
            this.allPoints.push(new Node(name, point));
            ctx.fillText(name, positionX, positionY);
        }

        private drawRectFoldingTypeA(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
            this.allPoints = [];

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);

            this.addNewPoint('E', point, point.x - this.fontSize / 2, point.y - this.textMargin);

            // find the symmetric point
            const a = pointB.y - pointA.y;
            const b = pointA.x - point.x;
            const c = a * b;
            const x = -2 * a * c / (Math.pow(b, 2) + Math.pow(a, 2));
            const y = -2 * b * c / (Math.pow(b, 2) + Math.pow(a, 2));
            const pointF = new Point(x + pointA.x, -y + pointA.y);
            this.addNewPoint('F', pointF, pointF.x + this.textMargin, pointF.y + this.fontSize / 2);

            // draw shape
            this.drawPath([pointB, pointA, point], this.dash);
            this.drawPolygon([pointB, pointC, pointD, point], []);
            this.drawPath([pointB, pointF, point], []);

            // find new cross point
            if (pointF.y > this.maxY) {
                const transPointE = new Point(point.x - pointB.x, pointB.y - point.y);
                const transPointF = new Point(pointF.x - pointB.x, pointB.y - pointF.y);
                const newPointX = transPointE.y * (transPointF.x  - transPointE.x) / (transPointE.y - transPointF.y) + transPointE.x + pointB.x;
                const pointG = new Point(newPointX, pointB.y);
                this.addNewPoint('G', pointG, pointG.x - this.fontSize - this.textMargin, pointG.y - this.fontSize / 2);
            }
            this.setNodesMutation(this.allPoints);
        }

        private drawRectFoldingTypeB(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
            this.maxX = this.minX + Math.pow(width * width - height * height, 0.5);
            this.allPoints = [];

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);

            this.addNewPoint('E', point, point.x - this.fontSize / 2, point.y - this.textMargin);

            // find the symmetric line
            const k = (point.x - pointC.x) / (point.y - pointC.y);
            const middle = new Point((point.x + pointC.x) / 2 - pointA.x, pointB.y - (point.y + pointC.y) / 2);
            const pointF = new Point(pointB.x + middle.x - middle.y / k, pointB.y);
            this.addNewPoint('F', pointF, pointF.x + this.fontSize / 2, pointF.y + this.fontSize + this.textMargin);

            let pointG;
            const tempHeight = k * (pointC.x - pointA.x - middle.x) + middle.y;
            if (tempHeight < height) {
                pointG = new Point(pointC.x, pointC.y - tempHeight);
                this.addNewPoint('G', pointG, pointG.x + this.textMargin, pointG.y);

                this.drawPolygon([pointA, pointB, pointF, pointG, pointD], []);
                this.drawPath([pointF, point, pointG], []);
                this.drawPath([pointF, pointC, pointG], this.dash);
            } else if (tempHeight === height) {
                this.drawPolygon([pointA, pointB, pointF, pointD], []);
                this.drawPath([pointF, point, pointD], []);
                this.drawPath([pointF, pointC, pointD], this.dash);
                pointG = new Point(pointD.x, pointD.y);
                this.addNewPoint('G', pointG, pointD.x + this.textMargin, pointD.y - this.textMargin);
            } else {
                pointG = new Point((height - middle.y) / k + middle.x + pointA.x, pointD.y);
                this.addNewPoint('G', pointG, pointG.x, pointG.y - this.textMargin);

                // find the symmetric point
                const [x, y] = this.findSymmetricPoint(k, middle, new Point(pointD.x - pointA.x, pointC.y - pointD.y));
                const pointH = new Point(x + pointA.x, - y + height + pointD.y);
                this.addNewPoint('H', pointH, pointH.x + this.textMargin, pointH.y + this.fontSize / 2);

                this.drawPath([point, pointG], this.dash);
                this.drawPolygon([pointA, pointB, pointF, point, pointA], []);
                this.drawPath([pointF, pointG, pointH, point], []);
                this.drawPath([pointF, pointC, pointD, pointG], this.dash);
            }

            this.setNodesMutation(this.allPoints);
        }

        private drawRectFoldingTypeC(width: number, height: number) {
            this.canvas.height = this.canvasHeight;
            this.allPoints = [];

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);


            // find the symmetric point
            const k = (pointB.y - pointD.y) / (pointD.x - pointB.x);
            const [x, y] = this.findSymmetricPoint(k, new Point(0, 0), new Point(pointC.x - pointA.x, pointC.y - pointB.y));
            const pointE = new Point(x + pointA.x, - y + height + pointD.y);
            this.addNewPoint('E', pointE, pointE.x - this.textMargin, pointE.y - this.fontSize / 2);

            // find the cross point
            const pointF = new Point(pointA.x + (pointB.y - pointA.y) * x / y, pointA.y);
            this.addNewPoint('F', pointF, pointF.x - this.fontSize, pointF.y - this.textMargin);

            this.drawPath([pointB, pointC, pointD], this.dash);
            this.drawPath([pointB, pointE, pointD], []);
            this.drawPath([pointB, pointD], []);
            this.drawPath([pointB, pointA, pointF], []);
            this.drawPath([pointD, pointF], this.dash);

            this.setNodesMutation(this.allPoints);
        }

        private drawRectFoldingTypeD(width: number, height: number, point: Point) {
            this.canvas.height = this.canvasHeight;
            this.allPoints = [];
            this.minX = this.maxX - width / 2;

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);

            const pointE = point;
            this.addNewPoint('E', pointE, pointE.x - this.textMargin, pointE.y - this.fontSize / 2);

            const pointF = new Point((pointB.x + pointC.x) / 2, pointB.y);
            this.addNewPoint('F', pointF, pointF.x, pointF.y + this.fontSize + this.textMargin);

            const k = (pointF.y - pointE.y) / (pointE.x - pointF.x);
            const [x0, y0] = this.findSymmetricPoint(k, new Point(pointF.x - pointB.x, pointF.y - pointB.y), new Point(pointC.x - pointB.x, pointC.y - pointB.y));
            const pointG = new Point(x0 + pointA.x,  pointC.y - y0);
            this.addNewPoint('G', pointG, pointG.x - this.fontSize - this.textMargin, pointG.y + this.fontSize);

            const [x1, y1] = this.findSymmetricPoint(k, new Point(pointF.x - pointB.x, pointF.y - pointB.y), new Point(pointD.x - pointB.x, pointB.y - pointD.y));
            const pointH = new Point(x1 + pointA.x,  pointC.y - y1);
            this.addNewPoint('H', pointH, pointH.x - this.fontSize, pointH.y - this.textMargin);

            const tmpK = (pointG.y - pointH.y) / (pointH.x - pointG.x);
            const x = pointH.x + (pointH.y - pointA.y) / tmpK;
            const pointI = new Point(x,  pointA.y);
            this.addNewPoint('I', pointI, pointI.x - this.fontSize / 2, pointI.y - this.textMargin);

            this.drawPath([pointI, pointA, pointB, pointF], []);
            this.drawPath([pointI, pointE], this.dash);
            this.drawPolygon([pointG, pointF, pointE, pointH], []);
            this.drawPolygon([pointE, pointF, pointC, pointD], this.dash);
            this.setNodesMutation(this.allPoints);

        }

        private findSymmetricPoint(k: number, point: Point, origin: Point) {
            const a = k;
            const b = -1;
            const c = point.y - k * point.x;
            const x0 = origin.x;
            const y0 = origin.y;
            const x = ((b * b - a * a) * x0 - 2 * a * b * y0 - 2 * a * c) / (a * a + b * b);
            const y = ((- b * b + a * a) * y0 - 2 * a * b * x0 - 2 * b * c) / (a * a + b * b);
            return [x, y];

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
                    this.spot1.y = this.minY;
                    this.updateSelectedFoldingMutation([new Point(this.spot1.x, this.minY)]);
                    this.drawRectFoldingTypeA(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot();
                    }, 100);
                    break;
                case rectTypes.TYPE_B:
                    this.drawRectFoldingTypeB(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot();
                    }, 100);
                    break;
                case rectTypes.TYPE_C:
                    this.drawRectFoldingTypeC(rect.width, rect.height);
                    break;
                case rectTypes.TYPE_D:
                    this.drawRectFoldingTypeD(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot();
                    }, 100);
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

        @Watch('selectedFoldingRectangle', {deep: true})
        private watchSelectedFoldingRectangle(oldVal: FoldingRectangle, newVal: FoldingRectangle) {
            let points = this.selectedFoldingRectangle.points;
            let point = points[0];

            if (oldVal.type !== newVal.type) {
                if (point) {
                    this.spot1 = point;
                }
                this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                return;
            }
            if (point && oldVal.type === newVal.type && (point.x !== this.spot1.x || point.y !== this.spot1.y)) {
                this.spot1 = new Point(points[0].x, points[0].y);
                this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                return;
            }
            if (oldVal.width !== newVal.width || oldVal.height !== newVal.height) {
                this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                return;
            }
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