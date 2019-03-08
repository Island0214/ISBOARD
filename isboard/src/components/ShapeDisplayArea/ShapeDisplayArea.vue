<template>
    <div class="shape-display-area-wrapper">
        <div :class="['canvas-wrapper']">
            <canvas id="rectangle-canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
            <!--<canvas id="setting-canvas" width="800" height="600" v-show="showSettingCanvas"></canvas>-->
            <!--<canvas id="blackboard-canvas" width="800" height="600"></canvas>-->
            <!--<canvas id="drawing-canvas" width="800" height="600" v-show="showDrawingCanvas"></canvas>-->
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Point} from '../../store';
    import {Getter} from "vuex-class";

    @Component({})
    export default class ShapeDisplayArea extends Vue {
        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private canvasWidth: number = 800;
        private canvasHeight: number = 600;
        private dash: number[] = [5, 5];
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;

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

        private drawRectFoldingTypeA(width: number = 500, height: number = 300, point: Point = new Point(350, 150)) {
            const pointA = new Point((this.canvasWidth - width) / 2, (this.canvasHeight - height) / 2);
            const pointB = new Point(pointA.x, pointA.y + height);
            const pointC = new Point(pointA.x + width, pointA.y + height);
            const pointD = new Point(pointA.x + width, pointA.y);
            this.drawPath([pointB, pointA, point], this.dash);
            this.drawPolygon([pointB, pointC, pointD, point], []);

            // find the symmetric point
            const a = pointB.y - pointA.y;
            const b = pointA.x - point.x;
            const c = a * b;
            console.log([a, b, c]);
            const x = -2 * a * c / (Math.pow(b, 2) + Math.pow(a, 2));
            const y = -2 * b * c / (Math.pow(b, 2) + Math.pow(a, 2));
            console.log([x, y]);
            const pointE = new Point(x + pointA.x, -y + pointA.y);
            this.drawPath([pointB, pointE, point], []);
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

            this.drawRectFoldingTypeA();
        }
    }
</script>

<style scoped lang="less" src="./ShapeDisplayArea.less">

</style>