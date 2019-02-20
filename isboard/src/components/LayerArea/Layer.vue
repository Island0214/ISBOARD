<template>
    <div :class="['layer-wrapper', {'selected-layer':selectedStroke === stroke}]" @click="selectStroke">
        <canvas :id="'layer-canvas-' + code" width="80" height="60" class="layer-canvas"></canvas>

        <p>{{stroke.type.toLowerCase()}}</p>

        <div class="delete-button" @click="deleteStroke">
            <div></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue} from 'vue-property-decorator';
    import {Point, Stroke} from '../../store';
    import {Stroke} from '../../store';
    import * as tools from '../../base/tools';
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class LayerArea extends Vue {
        @Prop(Object) private stroke!: Stroke;
        @Prop(Number) private index!: number;
        @Getter('selectedStroke') private selectedStroke!: Stroke;
        @Mutation(mutations.SET_SELECTED_STROKE) private setSelectedStroke!: any;
        @Mutation(mutations.DELETE_STROKES) private deleteStrokes!: any;
        private ctx!: CanvasRenderingContext2D;
        private dash: number[] = [10, 10];
        private code: string = Math.random().toString(36).substr(2);

        private selectStroke() {
            this.setSelectedStroke(this.stroke);
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

        private redoTriangle(stroke: Stroke) {
            const ctx = this.ctx;
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

        private deleteStroke() {
            this.$confirm('Confirm to remove this stroke？', 'REMOVE STROKE', {
                confirmButtonText: 'CONFIRM',
                cancelButtonText: 'CANCEL',
                callback: (action) => {
                    if (action === 'confirm') {
                        this.deleteStrokes(this.stroke);
                    }
                },
            });
        }

        private mounted() {
            const canvas: HTMLCanvasElement = document.getElementById('layer-canvas-' + this.code) as HTMLCanvasElement;
            if (!canvas || !canvas.getContext('2d')) {
                return false;
            } else {
                this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                canvas.height = canvas.height;
            }

            let stroke = this.stroke;
            let points = stroke.points.map((data) => {
                return new Point(data.x / 10, data.y / 10);
            });
            let thickness = stroke.thickness / 10;
            let smallStroke = new Stroke(stroke.type, points, stroke.color, thickness >= 1 ? thickness : 1, stroke.solid);
            switch (smallStroke.type) {
                case tools.PEN:
                    this.redoPen(smallStroke);
                    break;
                case tools.LINE:
                    this.redoLine(smallStroke);
                    break;
                case tools.RECTANGLE:
                    this.redoRect(smallStroke);
                    break;
                case tools.CIRCLE:
                    this.drawOval(this.ctx, smallStroke.points[0], smallStroke.points[1], smallStroke.color, smallStroke.thickness, smallStroke.solid);
                    break;
                case tools.TRIANGLE:
                    this.redoTriangle(smallStroke);
                    break;
            }
        }

    }
</script>

<style scoped lang="less" src="./LayerArea.less">

</style>