<template>
    <div class="shape-display-area-wrapper">
        <div :class="['canvas-wrapper']">
            <div :class="['spot-wrapper']" :style="spot1Css" id="move-spot-1" v-if="showSpot1"></div>
            <div :class="['spot-wrapper']" :style="spot2Css" id="move-spot-2" v-if="showSpot2"></div>
            <div :class="['spot-wrapper']" :style="spot3Css" id="move-spot-3" v-if="showSpot3"></div>
            <canvas id="line-canvas-1" class="line-canvas" :width="canvasWidth" :height="canvasHeight" v-if="showSpot2"></canvas>
            <canvas id="line-canvas-2" class="line-canvas" :width="canvasWidth" :height="canvasHeight" v-if="showSpot3"></canvas>
            <canvas id="rectangle-canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
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
        private spot2: Point = new Point(400, 50);
        private spot3: Point = new Point(300, 50);
        private minX: number = 150;
        private maxX: number = 650;
        private minY: number = 150;
        private maxY: number = 450;
        private allPoints: Node[]= [];
        private rectWidth: number = 800;
        private rectHeight: number = 600;

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

        get spot3Css() {
            return {
                marginLeft: this.spot3.x - this.thickness * 1.25 + 'px',
                marginTop: this.spot3.y - this.thickness * 1.25 + 'px',
                width: this.thickness * 2.5 + 'px',
                height: this.thickness * 2.5 + 'px',
            }
        }

        get showSpot1() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_A
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_B
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_D
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_E
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_F;
        }

        get showSpot2() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_E
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_F;
        }

        get showSpot3() {
            return this.selectedFoldingRectangle.type === rectTypes.TYPE_F;
        }

        private moveSpot1() {
            const moveSpot1 = document.getElementById('move-spot-1');
            if (moveSpot1 === null) {
                return;
            }
            moveSpot1.onmousedown = (e) => {
                document.onmousemove = (event) => {
                    const {x, y} = this.getMousePosition(this.canvas, event.clientX, event.clientY);
                    if (this.minX < x && x < this.maxX) {
                        this.spot1.x = x;
                        this.watchSpot2Change();
                        this.watchSpot3Change();
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

        private moveSpot2() {
            const moveSpot2 = document.getElementById('move-spot-2');
            if (moveSpot2 === null) {
                return;
            }
            moveSpot2.onmousedown = (e) => {
                document.onmousemove = (event) => {
                    const {x, y} = this.getMousePosition(this.canvas, event.clientX, event.clientY);
                    if (0 < x && x < this.canvasWidth) {
                        this.spot2.x = x;
                        let radius = this.canvasWidth / 2;
                        let relativeX = x - radius;
                        this.spot2.y = this.maxY - Math.pow(radius * radius - relativeX * relativeX, 0.5);
                    }
                };
            };

            moveSpot2.onmouseup = () => {
                document.onmousemove = null;
                this.updateCurrentFolding();
            };
        }

        private moveSpot3() {
            const moveSpot3 = document.getElementById('move-spot-3');
            if (moveSpot3 === null) {
                return;
            }
            moveSpot3.onmousedown = (e) => {
                document.onmousemove = (event) => {
                    const {x, y} = this.getMousePosition(this.canvas, event.clientX, event.clientY);
                    if (0 < x && x < this.canvasWidth) {
                        this.spot3.x = x;
                        let radius = this.canvasWidth / 2;
                        let relativeX = x - radius;
                        this.spot3.y = this.maxY - Math.pow(radius * radius - relativeX * relativeX, 0.5);
                    }
                };
            };

            moveSpot3.onmouseup = () => {
                document.onmousemove = null;
                this.updateCurrentFolding();
            };
        }

        @Watch('spot2', {deep: true})
        private watchSpot2Change() {
            const canvas: HTMLCanvasElement = document.getElementById('line-canvas-1') as HTMLCanvasElement;
            if (!canvas || !canvas.getContext('2d')) {
                return false;
            } else {
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                canvas.height = this.canvasHeight;
                ctx.moveTo(this.spot2.x, this.spot2.y);

                ctx.lineTo(this.spot1.x, this.spot1.y);
                ctx.setLineDash(this.dash);
                ctx.stroke();
            }
        }

        @Watch('spot3', {deep: true})
        private watchSpot3Change() {
            const canvas: HTMLCanvasElement = document.getElementById('line-canvas-2') as HTMLCanvasElement;
            if (!canvas || !canvas.getContext('2d')) {
                return false;
            } else {
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                canvas.height = this.canvasHeight;
                ctx.moveTo(this.spot3.x, this.spot3.y);

                ctx.lineTo(this.spot1.x, this.spot1.y);
                ctx.setLineDash(this.dash);
                ctx.stroke();
            }
        }

        private updateCurrentFolding() {
            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    this.updateSelectedFoldingMutation({points: [new Point(this.spot1.x, this.minY)], type: this.selectedFoldingRectangle.type});
                    break;
                case rectTypes.TYPE_B:
                    this.updateSelectedFoldingMutation({points: [new Point(this.spot1.x, this.minY)], type: this.selectedFoldingRectangle.type});
                    break;
                case rectTypes.TYPE_C:
                    // this.updateSelectedFoldingMutation({points: [new Point(this.spot1.x, this.minY)], type: this.selectedFoldingRectangle.type});
                    break;
                case rectTypes.TYPE_D:
                    this.updateSelectedFoldingMutation({points: [new Point(this.spot1.x, this.minY)], type: this.selectedFoldingRectangle.type});
                    break;
                case rectTypes.TYPE_E:
                    this.updateSelectedFoldingMutation({points: [new Point(this.spot2.x, this.spot2.y), new Point(this.spot1.x, this.maxY)], type: this.selectedFoldingRectangle.type});
                    break;
                case rectTypes.TYPE_F:
                    this.updateSelectedFoldingMutation({points: [new Point(this.spot2.x, this.spot2.y), new Point(this.spot1.x, this.maxY), new Point(this.spot3.x, this.spot3.y)], type: this.selectedFoldingRectangle.type});
                    break;
            }
            this.updateFoldingThumbnails();
            this.setRectangleBasicInfo(this.selectedFoldingRectangle);
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
            this.minX = this.maxX - width / 2 + 1;

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

            if (pointG.y > this.minY) {
                const tmpK = (pointG.y - pointH.y) / (pointH.x - pointG.x);
                const x = pointH.x + (pointH.y - pointA.y) / tmpK;
                const pointI = new Point(x,  pointA.y);
                this.addNewPoint('I', pointI, pointI.x - this.fontSize / 2, pointI.y - this.textMargin);
                this.drawPath([pointI, pointA, pointB, pointF], []);
                this.drawPath([pointI, pointE], this.dash);
                this.drawPolygon([pointG, pointF, pointE, pointH], []);
            } else if (pointG.y === this.minY) {
                this.drawPath([pointG, pointA, pointB, pointF], []);
                this.drawPolygon([pointG, pointF, pointE, pointH], []);
            } else {
                const tmpK = (pointG.y - pointF.y) / (pointF.x - pointG.x);
                const x = pointF.x + (pointF.y - pointA.y) / tmpK;
                const pointI = new Point(x,  pointA.y);
                this.addNewPoint('I', pointI, pointI.x - this.fontSize / 2, pointI.y + this.fontSize + this.textMargin);
                this.drawPath([pointI, pointA, pointB, pointF], []);
                this.drawPath([pointI, pointE], this.dash);
                this.drawPolygon([pointG, pointF, pointE, pointH], []);
            }

            this.drawPolygon([pointE, pointF, pointC, pointD], this.dash);
            this.setNodesMutation(this.allPoints);
        }

        private drawRectFoldingTypeE(width: number, height: number, point1: Point, point2: Point) {
            this.canvas.height = this.canvasHeight;
            this.allPoints = [];
            const ctx = this.ctx;

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);

            const pointE = new Point(point1.x, point1.y);
            this.addNewPoint('E', new Point(pointE.x, pointE.y), pointE.x, pointE.y + this.fontSize + this.textMargin);

            const center = new Point(this.canvasWidth / 2, this.maxY);
            ctx.arc(center.x, center.y, this.canvasWidth / 2, Math.PI, 2 * Math.PI);
            ctx.setLineDash(this.dash);
            ctx.stroke();

            let BE = point1.x - this.minX;
            const tmpO = new Point(point2.x - point1.x, point1.y - point2.y);
            const EO = Math.pow(Math.pow(point2.x - point1.x, 2) + Math.pow(point1.y - point2.y, 2), 0.5);

            const tmpF = new Point(tmpO.x * BE / EO, tmpO.y * BE / EO);
            const pointF = new Point(point1.x + tmpF.x, this.maxY - tmpF.y);
            this.addNewPoint('F', pointF, pointF.x - this.fontSize - this.textMargin, pointF.y - this.textMargin);

            let CE = this.maxX - point1.x;
            const tmpG = new Point(tmpO.x * CE / EO, tmpO.y * CE / EO);
            const pointG = new Point(point1.x + tmpG.x, this.maxY - tmpG.y);
            this.addNewPoint('G', pointG, pointG.x + this.textMargin, pointG.y - this.textMargin);

            const kBF = (pointB.y - pointF.y) / (pointF.x - pointB.x);
            let pointH = new Point(this.minX, this.maxY + (this.minX - point1.x) / kBF);
            if (pointH.y >= this.minY) {
                this.addNewPoint('H', pointH, pointH.x - this.fontSize - this.textMargin, pointH.y);
                this.drawPath([pointE, pointH], []);
                this.drawPath([pointH, pointF], []);
                this.drawPath([pointE, pointF], []);
            } else {
                pointH = new Point(point1.x - kBF * (this.maxY - this.minY), this.minY);
                this.addNewPoint('H', pointH, pointH.x - this.textMargin * 2, pointH.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kBF, new Point(0, 0), new Point(pointA.x - point1.x, point1.y - pointA.y));
                const pointJ = new Point(point1.x + x, point1.y - y);
                this.drawPath([pointE, pointH], []);
                this.drawPolygon([pointH, pointJ, pointF, pointE], []);
            }


            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let pointI = new Point(this.maxX, this.maxY + (this.maxX - point1.x) / kCG);
            if (pointI.y >= this.minY) {
                this.addNewPoint('I', pointI, pointI.x + this.textMargin, pointI.y);
                this.drawPath([pointE, pointI], []);
                this.drawPath([pointG, pointI], []);
                this.drawPath([pointE, pointG], []);
            } else {
                pointI = new Point(point1.x - kCG * (this.maxY - this.minY), this.minY);
                this.addNewPoint('I', pointI, pointI.x - this.textMargin * 2, pointI.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kCG, new Point(0, 0), new Point(pointD.x - point1.x, point1.y - pointD.y));
                const pointK = new Point(point1.x + x, point1.y - y);
                this.drawPolygon([pointE, pointI, pointK, pointG], []);
            }

            if (pointH.y > this.minY && pointI.y > this.minY) {
                this.drawPath([pointH, pointA, pointD, pointI], []);
            } else if (pointH.y <= this.minY && pointI.y >= this.minY) {
                this.drawPath([pointH, pointD, pointI], []);
            } else if (pointH.y >= this.minY && pointI.y <= this.minY) {
                this.drawPath([pointH, pointA, pointI], []);
            }

            this.drawPolygon([pointA, pointB, pointC, pointD], this.dash);

            this.setNodesMutation(this.allPoints);
        }

        private drawRectFoldingTypeF(width: number, height: number, point1: Point, point2: Point, point3: Point) {
            this.canvas.height = this.canvasHeight;
            this.allPoints = [];
            const ctx = this.ctx;

            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            this.addNewPoint('A', pointA, pointA.x - this.fontSize - this.textMargin, pointA.y - this.textMargin);

            const pointB = new Point(pointA.x, pointA.y + height);
            this.addNewPoint('B', pointB, pointB.x - this.fontSize - this.textMargin, pointB.y + this.fontSize + this.textMargin);

            const pointC = new Point(pointA.x + width, pointA.y + height);
            this.addNewPoint('C', pointC, pointC.x + this.textMargin, pointC.y + this.fontSize + this.textMargin);

            const pointD = new Point(pointA.x + width, pointA.y);
            this.addNewPoint('D', pointD, pointD.x + this.textMargin, pointD.y - this.textMargin);

            const pointE = new Point(point1.x, point1.y);
            this.addNewPoint('E', new Point(pointE.x, pointE.y), pointE.x, pointE.y + this.fontSize + this.textMargin);

            const center = new Point(this.canvasWidth / 2, this.maxY);
            ctx.arc(center.x, center.y, this.canvasWidth / 2, Math.PI, 2 * Math.PI);
            ctx.setLineDash(this.dash);
            ctx.stroke();

            let BE = point1.x - this.minX;
            const tmpO1 = new Point(point2.x - point1.x, point1.y - point2.y);
            const EO1 = Math.pow(Math.pow(point2.x - point1.x, 2) + Math.pow(point1.y - point2.y, 2), 0.5);

            const tmpF = new Point(tmpO1.x * BE / EO1, tmpO1.y * BE / EO1);
            const pointF = new Point(point1.x + tmpF.x, this.maxY - tmpF.y);
            this.addNewPoint('F', pointF, pointF.x - this.fontSize - this.textMargin, pointF.y - this.textMargin);


            let CE = this.maxX - point1.x;
            const tmpO2 = new Point(point3.x - point1.x, point1.y - point3.y);
            const EO2 = Math.pow(Math.pow(point3.x - point1.x, 2) + Math.pow(point1.y - point3.y, 2), 0.5);

            const tmpG = new Point(tmpO2.x * CE / EO2, tmpO2.y * CE / EO2);
            const pointG = new Point(point1.x + tmpG.x, this.maxY - tmpG.y);
            this.addNewPoint('G', pointG, pointG.x + this.textMargin, pointG.y - this.textMargin);

            const kBF = (pointB.y - pointF.y) / (pointF.x - pointB.x);
            let pointH = new Point(this.minX, this.maxY + (this.minX - point1.x) / kBF);
            if (pointH.y >= this.minY) {
                this.addNewPoint('H', pointH, pointH.x - this.fontSize - this.textMargin, pointH.y);
                this.drawPath([pointE, pointH], []);
                this.drawPath([pointH, pointF], []);
                this.drawPath([pointE, pointF], []);
            } else {
                pointH = new Point(point1.x - kBF * (this.maxY - this.minY), this.minY);
                this.addNewPoint('H', pointH, pointH.x - this.textMargin * 2, pointH.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kBF, new Point(0, 0), new Point(pointA.x - point1.x, point1.y - pointA.y));
                const pointJ = new Point(point1.x + x, point1.y - y);
                this.drawPath([pointE, pointH], []);
                this.drawPolygon([pointH, pointJ, pointF, pointE], []);
            }


            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let pointI = new Point(this.maxX, this.maxY + (this.maxX - point1.x) / kCG);
            if (pointI.y >= this.minY) {
                this.addNewPoint('I', pointI, pointI.x + this.textMargin, pointI.y);
                this.drawPath([pointE, pointI], []);
                this.drawPath([pointG, pointI], []);
                this.drawPath([pointE, pointG], []);
            } else {
                pointI = new Point(point1.x - kCG * (this.maxY - this.minY), this.minY);
                this.addNewPoint('I', pointI, pointI.x - this.textMargin * 2, pointI.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kCG, new Point(0, 0), new Point(pointD.x - point1.x, point1.y - pointD.y));
                const pointK = new Point(point1.x + x, point1.y - y);
                this.drawPolygon([pointE, pointI, pointK, pointG], []);
            }

            if (pointH.y > this.minY && pointI.y > this.minY) {
                this.drawPath([pointH, pointA, pointD, pointI], []);
            } else if (pointH.y <= this.minY && pointI.y >= this.minY) {
                this.drawPath([pointH, pointD, pointI], []);
            } else if (pointH.y >= this.minY && pointI.y <= this.minY) {
                this.drawPath([pointH, pointA, pointI], []);
            }

            this.drawPolygon([pointA, pointB, pointC, pointD], this.dash);

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
            this.rectWidth = rect.width;
            this.rectHeight = rect.height;
            switch (rect.type) {
                case rectTypes.TYPE_A:
                    this.drawRectFoldingTypeA(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot1();
                    }, 100);
                    break;
                case rectTypes.TYPE_B:
                    this.drawRectFoldingTypeB(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot1();
                    }, 100);
                    break;
                case rectTypes.TYPE_C:
                    this.drawRectFoldingTypeC(rect.width, rect.height);
                    break;
                case rectTypes.TYPE_D:
                    this.drawRectFoldingTypeD(rect.width, rect.height, rect.points[0]);
                    setTimeout(() => {
                        this.moveSpot1();
                    }, 100);
                    break;
                case rectTypes.TYPE_E:
                    if (rect.points.length === 0) {
                        this.spot2.x = this.canvasWidth / 2;
                        this.spot2.y = this.maxY - this.canvasWidth / 2;
                        this.updateSelectedFoldingMutation({points: [new Point(this.spot2.x, this.spot2.y), new Point( (this.canvasWidth / 2 + this.minX) / 2, this.maxY)], type: rect.type});
                        this.updateFoldingThumbnails();
                    } else {
                        this.drawRectFoldingTypeE(rect.width, rect.height, rect.points[1], rect.points[0]);
                        setTimeout(() => {
                            this.moveSpot1();
                            this.moveSpot2();
                            this.watchSpot2Change();
                        }, 100);
                    }
                    break;
                case rectTypes.TYPE_F:
                    if (rect.points.length === 0) {
                        this.spot2.x = this.canvasWidth / 2;
                        this.spot2.y = this.maxY - this.canvasWidth / 2;
                        this.spot3.x = this.canvasWidth * 3 / 4;
                        let radius = this.canvasWidth / 2;
                        let relativeX = this.spot2.x - radius;
                        this.spot2.y = this.maxY - Math.pow(radius * radius - relativeX * relativeX, 0.5);
                        relativeX = this.spot3.x - radius;
                        this.spot3.y = this.maxY - Math.pow(radius * radius - relativeX * relativeX, 0.5);
                        this.updateSelectedFoldingMutation({points: [new Point(this.spot2.x, this.spot2.y), new Point(this.canvasWidth / 2, this.maxY), new Point(this.spot3.x, this.spot3.y)], type: rect.type});
                        this.updateFoldingThumbnails();
                    } else {
                        this.drawRectFoldingTypeF(rect.width, rect.height, rect.points[1], rect.points[0], rect.points[2]);
                        setTimeout(() => {
                            this.moveSpot1();
                            this.moveSpot2();
                            this.moveSpot3();
                            this.watchSpot2Change();
                            this.watchSpot3Change();
                        }, 100);
                    }
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
                    if (this.selectedFoldingRectangle.type !== rectTypes.TYPE_E) {
                        this.spot1 = new Point(point.x, point.y);
                    } else {
                        this.spot1 = new Point(points[1].x, points[1].y);
                        this.spot2 = new Point(points[0].x, points[0].y);
                    }
                }
                this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                return;
            }
            if (point && (point.x !== this.spot1.x || point.y !== this.spot1.y) && this.selectedFoldingRectangle.type !== rectTypes.TYPE_E && this.selectedFoldingRectangle.type !== rectTypes.TYPE_F) {
                this.spot1 = new Point(point.x, point.y);
                this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                return;
            }
            if (point && this.selectedFoldingRectangle.type === rectTypes.TYPE_E) {
                if (point.x !== this.spot2.x || point.y !== this.spot2.y) {
                    this.spot2 = new Point(point.x, point.y);
                    this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                }
                point = points[1];
                if (point.x !== this.spot1.x || point.y !== this.spot1.y) {
                    this.spot1 = new Point(point.x, point.y);
                    this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                }
                return;
            }
            if (point && this.selectedFoldingRectangle.type === rectTypes.TYPE_F) {
                if (point.x !== this.spot2.x || point.y !== this.spot2.y) {
                    this.spot2 = new Point(point.x, point.y);
                    this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                }
                point = points[1];
                if (point.x !== this.spot1.x || point.y !== this.spot1.y) {
                    this.spot1 = new Point(point.x, point.y);
                    this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                }
                point = points[2];
                if (point.x !== this.spot3.x || point.y !== this.spot3.y) {
                    this.spot3 = new Point(point.x, point.y);
                    this.setRectangleBasicInfo(this.selectedFoldingRectangle);
                }
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
        }
    }
</script>

<style scoped lang="less" src="./ShapeDisplayArea.less">

</style>