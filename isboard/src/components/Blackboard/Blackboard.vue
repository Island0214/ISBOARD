<template>
    <div class="blackboard-wrapper">
        <div class="canvas-wrapper" >
            <canvas id="blackboard-canvas" width="800" height="600"></canvas>
        </div>
        <div class="save-button-wrapper">
            <el-button disabled class="my-button">保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';
    @Component({
    })
    export default class Blackboard extends Vue {
        private drawing: boolean = false;
        private theCanvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('tool') private tool!: string;

        private getMousePosition = (canvas: HTMLCanvasElement, x: number, y: number) => {
            const boundingClientRect = canvas.getBoundingClientRect();
            return {
                x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
                y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height),
            };
        }

        @Watch('tool')
        private toolChanged(newVal: string) {
            this.clear();
            switch (newVal) {
                case 'pen':
                    this.toolPen();
            }
        }

        private toolPen() {
            const that = this;
            const theCanvas = this.theCanvas;
            const ctx = this.ctx;
            theCanvas.onmousedown = (e) => {
                that.drawing = true;

                const { x, y } = that.getMousePosition(theCanvas, e.clientX, e.clientY);
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.thickness;
                ctx.moveTo(x, y);
                theCanvas.onmousemove = (event) => {
                    if (that.drawing) {
                        const { x, y } = this.getMousePosition(theCanvas, event.clientX, event.clientY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                };
            };

            theCanvas.onmouseup = () => {
                that.drawing = false;
                ctx.closePath();
            };
        }

        private clear() {
            let theCanvas = this.theCanvas;
            theCanvas.onmouseup = () => {};
            theCanvas.onmousedown = () => {};
            theCanvas.onmousemove = () => {};
        }

        private mounted() {
            const theCanvas: HTMLCanvasElement = document.getElementById('blackboard-canvas') as HTMLCanvasElement;
            if (!theCanvas || !theCanvas.getContext('2d')) {
                return false;
            } else {
                const ctx = theCanvas.getContext('2d') as CanvasRenderingContext2D;
                this.theCanvas = theCanvas;
                this.ctx = ctx;
                this.toolPen();
            }
        }
    }
</script>

<style scoped src="./Blackboard.less" lang="less">
</style>