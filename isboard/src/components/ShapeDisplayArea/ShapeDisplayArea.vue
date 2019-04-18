<template>
    <div class="shape-display-area-wrapper">
        <div :class="['canvas-wrapper']">
            <div :class="['spot-wrapper']" :style="spot1Css" id="move-spot-1" v-if="showSpot1"></div>
            <div :class="['spot-wrapper']" :style="spot2Css" id="move-spot-2" v-if="showSpot2"></div>
            <div :class="['spot-wrapper']" :style="spot3Css" id="move-spot-3" v-if="showSpot3"></div>
            <canvas id="feature-canvas" class="line-canvas" :width="canvasWidth" :height="canvasHeight"
                    v-show="showFeature"></canvas>
            <canvas id="animation-canvas" class="line-canvas" :width="canvasWidth" :height="canvasHeight"
                    v-show="showAnimation"></canvas>

            <canvas id="line-canvas-1" class="line-canvas" :width="canvasWidth" :height="canvasHeight"
                    v-show="showSpot2"></canvas>
            <canvas id="line-canvas-2" class="line-canvas" :width="canvasWidth" :height="canvasHeight"
                    v-show="showSpot3"></canvas>
            <canvas id="rectangle-canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
        </div>
        <div class="button-wrapper">
            <el-button class="my-button" @click="showFoldingProcess()">展 示 折 叠 过 程</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {FoldingRectangle, Point, Node, FoldingFeature} from '../../store';
    import {Getter, Mutation} from 'vuex-class';
    import * as rectTypes from '../../base/rectangle-folding'
    import * as mutations from '../../store/mutation-types'
    import * as features from '../../base/features'
    import * as featureTypes from '../../base/feature-types'
    import * as featureConditions from '../../base/feature-conditions'

    @Component({})
    export default class ShapeDisplayArea extends Vue {
        private canvas!: HTMLCanvasElement;
        private ctx!: CanvasRenderingContext2D;
        private animationCanvas!: HTMLCanvasElement;
        private animationCtx!: CanvasRenderingContext2D;
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
        private allPoints: Node[] = [];
        private rectWidth: number = 800;
        private rectHeight: number = 600;
        private showAnimation: boolean = false;
        private animationSpeed: number = 10;
        private maxSpot2X: number = 650;
        private minSpot3X: number = 650;

        @Getter('canvasWidth') private canvasWidth!: number;
        @Getter('canvasHeight') private canvasHeight!: number;
        @Getter('color') private color!: string;
        @Getter('thick') private thickness!: number;
        @Getter('foldingRectangles') private foldingRectangles!: FoldingRectangle[];
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
        @Getter('selectedFeature') private selectedFeature!: FoldingFeature;
        @Mutation(mutations.SET_FOLDING_RECT_THUMBNAILS) private setFoldingRectThumbnailsMutation!: any;
        @Mutation(mutations.SET_NODES) private setNodesMutation!: any;
        @Mutation(mutations.SET_FOLDING_TYPE) private setFoldingTypeMutation!: any;
        @Mutation(mutations.UPDATE_SELECTED_FOLDING) private updateSelectedFoldingMutation!: any;
        @Mutation(mutations.SET_FOLDING_FEATURE) private setFoldingFeature!: any;

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
            return !this.showAnimation && (this.selectedFoldingRectangle.type === rectTypes.TYPE_A
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_B
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_D
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_E
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_F);
        }

        get showSpot2() {
            return !this.showAnimation && (this.selectedFoldingRectangle.type === rectTypes.TYPE_E
                || this.selectedFoldingRectangle.type === rectTypes.TYPE_F);
        }

        get showSpot3() {
            return !this.showAnimation && (this.selectedFoldingRectangle.type === rectTypes.TYPE_F);
        }

        get showFeature() {
            if (this.selectedFeature !== undefined) {
                return true;
            }
            return false;
        }

        private moveSpot1() {
            const moveSpot1 = document.getElementById('move-spot-1');
            if (moveSpot1 === null) {
                return;
            }
            moveSpot1.onmousedown = (e) => {
                document.onmousemove = (event) => {
                    const {x, y} = this.getMousePosition(this.canvas, event.clientX, event.clientY);
                    let min = this.minX;
                    if (this.selectedFoldingRectangle.type === rectTypes.TYPE_E || this.selectedFoldingRectangle.type === rectTypes.TYPE_F) {
                        min = this.canvasWidth / 2;
                    }
                    if (min < x && x < this.maxX) {
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
                    let max = this.canvasWidth;
                    if (this.selectedFoldingRectangle.type === rectTypes.TYPE_F) {
                        max = this.maxSpot2X;
                    }
                    if (0 < x && x < max) {
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
                    let min = 0;
                    if (this.selectedFoldingRectangle.type === rectTypes.TYPE_F) {
                        min = this.minSpot3X;
                    }
                    if (min < x && x < this.canvasWidth) {
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

        private getAnimationCtx() {
            const animationCanvas: HTMLCanvasElement = document.getElementById('animation-canvas') as HTMLCanvasElement;
            if (!animationCanvas || !animationCanvas.getContext('2d')) {
                return false;
            } else {
                const animationCtx = animationCanvas.getContext('2d') as CanvasRenderingContext2D;
                this.animationCanvas = animationCanvas;
                this.animationCtx = animationCtx;
            }
        }

        private showFoldingProcessTypeA() {
            if (this.allPoints.length < 6) {
                this.showAnimation = false;
                return;
            }
            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;
            const pointF = this.allPoints[5].point;

            const kAF = (pointA.y - pointF.y) / (pointF.x - pointA.x);

            const start = pointA.x;
            let y = pointB.y - pointA.y;
            let tmpF;
            for (let i = pointA.x; i <= pointF.x; i++) {
                setTimeout(() => {
                    this.animationCanvas.height = this.canvasHeight;

                    y = pointB.y - pointA.y + kAF * (i - start);
                    tmpF = new Point(i, pointB.y - y);

                    this.drawPath([pointB, pointA, pointE], this.dash, this.animationCtx);
                    this.drawPolygon([pointB, pointC, pointD, pointE], [], this.animationCtx);
                    this.drawPath([pointB, tmpF, pointE], [], this.animationCtx);

                    if (i === parseInt(pointF.x + '')) {
                        this.showAnimation = false;
                    }
                }, (i - start) * this.animationSpeed);
            }
        }

        private showFoldingProcessTypeB() {
            if (this.allPoints.length < 7) {
                this.showAnimation = false;
                return;
            }
            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;
            const pointF = this.allPoints[5].point;
            const pointG = this.allPoints[6].point;

            const kCE = (pointC.y - pointE.y) / (pointE.x - pointC.x);
            const start = pointC.x;
            const end = pointE.x;
            let xCE = pointC.x - pointB.x;
            let yCE = pointC.y;
            let tmpE;
            if (this.allPoints.length === 7) {
                for (let i = start; i >= end; i--) {
                    setTimeout(() => {
                        this.animationCanvas.height = this.canvasHeight;

                        yCE = kCE * (i - pointB.x - xCE);

                        tmpE = new Point(i, pointB.y - yCE);
                        this.drawPolygon([pointA, pointB, pointF, pointG, pointD], [], this.animationCtx);
                        this.drawPath([pointF, tmpE, pointG], [], this.animationCtx);
                        this.drawPath([pointF, pointC, pointG], this.dash, this.animationCtx);
                        if (i === end) {
                            this.showAnimation = false;
                        }
                    }, (start - i) * this.animationSpeed);
                }
            } else {
                const pointH = this.allPoints[7].point;
                const kDH = (pointD.y - pointH.y) / (pointH.x - pointD.x);
                let yDH = pointC.y;
                let tmpH;
                for (let i = start; i >= end; i--) {
                    setTimeout(() => {
                        this.animationCanvas.height = this.canvasHeight;

                        yCE = kCE * (i - pointB.x - xCE);
                        tmpE = new Point(i, pointB.y - yCE);

                        let ratio = (pointD.x - pointG.x) / (pointC.x - pointF.x);
                        let tmpX = pointG.x + (i - pointF.x) * ratio;
                        yDH = kDH * (tmpX - pointD.x) + (pointB.y - pointD.y);
                        tmpH = new Point(tmpX, pointB.y - yDH);


                        this.drawPath([pointE, pointG], this.dash, this.animationCtx);
                        this.drawPath([pointE, pointA, pointB, pointF], [], this.animationCtx);
                        this.drawPath([pointF, pointC, pointD, pointG], this.dash, this.animationCtx);
                        this.drawPath([pointF, tmpE], [], this.animationCtx);
                        this.drawPath([tmpE, tmpH], [], this.animationCtx);
                        this.drawPath([tmpH, pointG], [], this.animationCtx);
                        this.drawPath([pointG, pointF], [], this.animationCtx);

                        let kHE = (tmpH.y - tmpE.y) / (tmpE.x - tmpH.x);
                        let crossX = (tmpE.x - pointB.x) + (tmpE.y - pointA.y) / kHE;
                        if (crossX < pointG.x - pointA.x) {
                            let cross = new Point(pointA.x + crossX, pointA.y);
                            this.drawPath([cross, pointE], [], this.animationCtx);
                        } else {
                            this.drawPath([pointE, pointG], [], this.animationCtx);
                        }

                        if (i === end) {
                            this.showAnimation = false;
                        }
                    }, (start - i) * this.animationSpeed);
                }
            }
        }

        private showFoldingProcessTypeC() {
            if (this.allPoints.length < 6) {
                this.showAnimation = false;
                return;
            }

            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;

            const kCE = (pointC.y - pointE.y) / (pointE.x - pointC.x);
            const start = pointC.x;
            const end = pointE.x;
            let xCE = pointC.x - pointB.x;
            let yCE = pointC.y;
            let tmpE;
            for (let i = start; i >= end; i--) {
                setTimeout(() => {
                    this.animationCanvas.height = this.canvasHeight;

                    yCE = kCE * (i - pointB.x - xCE);

                    tmpE = new Point(i, pointB.y - yCE);
                    if (tmpE.y > pointA.y) {
                        this.drawPath([pointB, pointA, pointD], [], this.animationCtx);
                        this.drawPath([pointB, tmpE, pointD], [], this.animationCtx);
                        this.drawPath([pointD, pointB], [], this.animationCtx);
                        this.drawPolygon([pointB, pointC, pointD], this.dash, this.animationCtx);
                    } else {
                        let kBE = (pointB.y - tmpE.y) / (tmpE.x - pointB.x);

                        let tmpF = new Point(pointA.x + (pointB.y - pointA.y) / kBE, pointA.y);
                        this.drawPath([pointB, pointA, tmpF], [], this.animationCtx);
                        this.drawPath([pointD, tmpF], this.dash, this.animationCtx);
                        this.drawPath([pointB, tmpE, pointD], [], this.animationCtx);
                        this.drawPath([pointD, pointB], [], this.animationCtx);
                        this.drawPolygon([pointB, pointC, pointD], this.dash, this.animationCtx);
                    }
                    if (i === end) {
                        this.showAnimation = false;
                    }
                }, (start - i) * this.animationSpeed);
            }

        }

        private showFoldingProcessTypeD() {
            if (this.allPoints.length < 8) {
                this.showAnimation = false;
                return;
            }

            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;
            const pointF = this.allPoints[5].point;
            const pointG = this.allPoints[6].point;
            const pointH = this.allPoints[7].point;

            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            const start = pointC.x;
            const end = pointG.x;
            let xCG = pointC.x - pointB.x;
            let yCG = pointC.y;
            let tmpG;

            const kDH = (pointD.y - pointH.y) / (pointH.x - pointD.x);
            let yDH = pointC.y;
            let tmpH;
            for (let i = start; i >= end; i--) {
                setTimeout(() => {
                    this.animationCanvas.height = this.canvasHeight;

                    yCG = kCG * (i - pointB.x - xCG);
                    tmpG = new Point(i, pointB.y - yCG);

                    let ratio = (pointD.x - pointE.x) / (pointC.x - pointF.x);
                    let tmpX = pointE.x + (i - pointF.x) * ratio;
                    yDH = kDH * (tmpX - pointD.x) + (pointB.y - pointD.y);
                    tmpH = new Point(tmpX, pointB.y - yDH);


                    this.drawPath([pointF, pointC, pointD, pointA], this.dash, this.animationCtx);
                    this.drawPath([pointF, pointE], [], this.animationCtx);
                    this.drawPath([pointF, tmpG], [], this.animationCtx);
                    this.drawPath([tmpG, tmpH], [], this.animationCtx);
                    this.drawPath([tmpH, pointE], [], this.animationCtx);

                    if (tmpG.y >= pointA.y) {
                        let kGH = (tmpH.y - tmpG.y) / (tmpG.x - tmpH.x);
                        let crossX = (tmpG.x - pointB.x) + (tmpG.y - pointA.y) / kGH;
                        if (crossX >= pointG.x - pointA.x && crossX <= pointE.x - pointA.x) {
                            let cross = new Point(pointA.x + crossX, pointA.y);
                            this.drawPath([cross, pointA, pointB, pointF], [], this.animationCtx);
                        } else {
                            this.drawPath([pointE, pointA, pointB, pointF], [], this.animationCtx);
                        }
                    } else {
                        let kGF = (pointF.y - tmpG.y) / (tmpG.x - pointF.x);
                        let crossX = (tmpG.x - pointB.x) + (tmpG.y - pointA.y) / kGF;
                        if (crossX >= pointG.x - pointA.x && crossX <= pointF.x - pointA.x) {
                            let cross = new Point(pointA.x + crossX, pointA.y);
                            this.drawPath([cross, pointA, pointB, pointF], [], this.animationCtx);
                        } else {
                            this.drawPath([pointE, pointA, pointB, pointF], [], this.animationCtx);
                        }
                    }

                    if (i === end) {
                        this.showAnimation = false;
                    }
                }, (start - i) * this.animationSpeed);
            }
        }

        private showFoldingProcessTypeE() {
            if (this.allPoints.length < 9) {
                this.showAnimation = false;
                return;
            }

            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;
            const pointF = this.allPoints[5].point;
            const pointG = this.allPoints[6].point;
            const pointH = this.allPoints[7].point;
            const pointI = this.allPoints[8].point;
            const pointJ = this.allPoints[9].point;
            const pointK = this.allPoints[10].point;

            let speedRatio = (pointF.x - pointB.x) / (pointC.x - pointG.x);

            let speed = this.animationSpeed * 4;
            if (speedRatio <= 1) {
                speed *= speedRatio;
            } else {
                speed /= speedRatio;
            }

            const kBF = (pointB.y - pointF.y) / (pointF.x - pointB.x);
            const start = pointA.x;
            const end = pointF.x;

            let y = pointB.y - pointA.y;
            let tmpF;
            let tmpJ = new Point(0, 0);

            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let tmpG;
            let tmpK = new Point(0, 0);
            for (let i = start; i <= end; i++) {
                setTimeout(() => {
                    this.animationCanvas.height = this.canvasHeight;

                    // left part
                    y = kBF * (i - start);
                    tmpF = new Point(i, pointB.y - y);
                    this.drawPolygon([pointA, pointB, pointC, pointD,], this.dash, this.animationCtx);
                    if (pointJ.x < 0) {
                        this.drawPath([pointH, tmpF], [], this.animationCtx);
                        this.drawPath([tmpF, pointE], [], this.animationCtx);
                        this.drawPath([pointH, pointE], [], this.animationCtx);
                    } else {
                        let ratio = (pointH.x - pointA.x) / (pointE.x - pointB.x);
                        let tmpX = pointA.x + (tmpF.x - pointB.x) * ratio;
                        let tmpY = pointA.y - (tmpX - pointA.x) * kBF;
                        tmpJ = new Point(tmpX, tmpY);
                        this.drawPath([pointH, tmpJ], [], this.animationCtx);
                        this.drawPath([tmpJ, tmpF], [], this.animationCtx);
                        this.drawPath([tmpF, pointE], [], this.animationCtx);
                        this.drawPath([pointH, pointE], [], this.animationCtx);
                    }

                    let x = pointC.x - (i - start) * (pointC.x - pointG.x) / (pointF.x - pointB.x);
                    y = pointC.x - (i - start) * (pointC.x - pointG.x) / (pointF.x - pointB.x);
                    tmpG = new Point(x, pointB.y - kCG * (x - pointC.x));

                    if (pointK.x < 0) {
                        this.drawPath([pointI, tmpG], [], this.animationCtx);
                        this.drawPath([tmpG, pointE], [], this.animationCtx);
                        this.drawPath([pointI, pointE], [], this.animationCtx);
                    } else {
                        let ratio = (pointD.x - pointI.x) / (pointC.x - pointE.x);
                        let tmpX = pointI.x + (tmpG.x - pointE.x) * ratio;
                        let tmpY = pointI.y - (tmpX - pointD.x) * kCG;
                        tmpK = new Point(tmpX, tmpY);
                        this.drawPath([pointI, tmpK], [], this.animationCtx);
                        this.drawPath([tmpK, tmpG], [], this.animationCtx);
                        this.drawPath([tmpG, pointE], [], this.animationCtx);
                        this.drawPath([pointI, pointE], [], this.animationCtx);
                    }

                    let cross1;
                    let cross2;
                    let cross3;
                    let cross4;
                    let crossX;
                    let crossY;
                    let kJF = (tmpJ.y - tmpF.y) / (tmpF.x - tmpJ.x);
                    let kEF = (pointE.y - tmpF.y) / (tmpF.x - pointE.x);

                    // JF cross AD
                    crossX = (tmpJ.x - pointA.x) + (tmpJ.y - pointA.y) / kJF;
                    cross1 = new Point(pointA.x + crossX, this.minY);

                    // JF cross CD
                    crossY = kJF * (this.maxX - tmpJ.x) + (this.maxY - tmpJ.y);
                    cross2 = new Point(this.maxX, this.maxY - crossY);

                    // EF cross AD
                    crossX = (pointE.x - pointA.x) + (pointE.y - pointA.y) / kEF;
                    cross3 = new Point(pointA.x + crossX, this.minY);

                    // EF cross CD
                    crossY = kEF * (this.maxX - pointE.x);
                    cross4 = new Point(this.maxX, this.maxY - crossY);

                    if (pointH.x === this.minX && pointH.y > this.minY && pointI.y > this.minY && pointI.x === this.maxX) {
                        if (tmpF.y < this.minY) {
                            let kHF = (pointH.y - tmpF.y) / (tmpF.x - pointH.x);
                            crossX = (pointH.x - pointA.x) + (pointH.y - pointA.y) / kHF;
                            let cross5 = new Point(pointA.x + crossX, this.minY);

                            this.drawPath([pointH, pointA, cross5], [], this.animationCtx);
                            this.drawPath([cross3, pointD, pointI], [], this.animationCtx);
                        } else {
                            this.drawPath([pointH, pointA, pointD, pointI], [], this.animationCtx);
                        }
                    } else if (pointH.x >= this.minX && pointH.y === this.minY && pointI.y >= this.minY && pointI.x === this.maxX) {
                        // right triangle
                        if (cross1.x < pointH.x && cross4.y > pointI.y) {
                            this.drawPath([pointH, pointD, pointI], [], this.animationCtx);
                        }
                        if (cross1.x >= pointH.x && this.betweenInterval(cross1)) {
                            this.drawPath([cross1, pointD, pointI], [], this.animationCtx);
                        }
                        if (this.betweenInterval(cross1) && this.betweenInterval(cross4)) {
                            if (this.betweenInterval(cross4) && cross2.y < pointI.y) {
                                this.drawPath([cross1, pointD, cross2], [], this.animationCtx);
                                this.drawPath([cross4, pointI], [], this.animationCtx);
                            }
                        }

                        if (!this.betweenInterval(cross1) && !this.betweenInterval(cross2)) {
                            if (this.betweenInterval(cross3)) {
                                this.drawPath([cross3, pointD, pointI], [], this.animationCtx);
                            } else {
                                this.drawPath([cross4, pointI], [], this.animationCtx);
                            }
                        }

                    } else if (pointH.x === this.minX && pointH.y >= this.minY && pointI.y === this.minY && pointI.x <= this.maxX) {
                        // left triangle
                        let kKG = (tmpK.y - tmpG.y) / (tmpG.x - tmpK.x);
                        let crossX = (tmpK.x - pointA.x) + (tmpK.y - pointA.y) / kKG;
                        cross1 = new Point(pointA.x + crossX, this.minY);
                        if (cross1.x <= pointI.x) {
                            this.drawPath([cross1, pointA, pointH], [], this.animationCtx);
                        } else {
                            this.drawPath([pointI, pointA, pointH], [], this.animationCtx);
                        }
                    }
                    if (i === parseInt(end + '')) {
                        this.showAnimation = false;
                    }
                }, (i - start) * speed);
            }

        }

        private showFoldingProcessTypeF() {
            if (this.allPoints.length < 9) {
                this.showAnimation = false;
                return;
            }
            const pointA = this.allPoints[0].point;
            const pointB = this.allPoints[1].point;
            const pointC = this.allPoints[2].point;
            const pointD = this.allPoints[3].point;
            const pointE = this.allPoints[4].point;
            const pointF = this.allPoints[5].point;
            const pointG = this.allPoints[6].point;
            const pointH = this.allPoints[7].point;
            const pointI = this.allPoints[8].point;
            const pointJ = this.allPoints[9].point;
            const pointK = this.allPoints[10].point;

            let speedRatio = (pointF.x - pointB.x) / (pointC.x - pointG.x);

            let speed = this.animationSpeed * 4;
            if (speedRatio <= 1) {
                speed *= speedRatio;
            } else {
                speed /= speedRatio;
            }

            const kBF = (pointB.y - pointF.y) / (pointF.x - pointB.x);
            const start = pointA.x;
            const end = pointF.x;

            let y = pointB.y - pointA.y;
            let tmpF;
            let tmpJ = new Point(0, 0);

            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let tmpG;
            let tmpK = new Point(0, 0);
            for (let i = start; i <= end; i++) {
                setTimeout(() => {
                    this.animationCanvas.height = this.canvasHeight;

                    // left part
                    y = kBF * (i - start);
                    tmpF = new Point(i, pointB.y - y);
                    this.drawPolygon([pointA, pointB, pointC, pointD,], this.dash, this.animationCtx);
                    if (pointJ.x < 0) {
                        this.drawPath([pointH, tmpF], [], this.animationCtx);
                        this.drawPath([tmpF, pointE], [], this.animationCtx);
                        this.drawPath([pointH, pointE], [], this.animationCtx);
                    } else {
                        let ratio = (pointH.x - pointA.x) / (pointE.x - pointB.x);
                        let tmpX = pointA.x + (tmpF.x - pointB.x) * ratio;
                        let tmpY = pointA.y - (tmpX - pointA.x) * kBF;
                        tmpJ = new Point(tmpX, tmpY);
                        this.drawPath([pointH, tmpJ], [], this.animationCtx);
                        this.drawPath([tmpJ, tmpF], [], this.animationCtx);
                        this.drawPath([tmpF, pointE], [], this.animationCtx);
                        this.drawPath([pointH, pointE], [], this.animationCtx);
                    }

                    let x = pointC.x - (i - start) * (pointC.x - pointG.x) / (pointF.x - pointB.x);
                    y = pointC.x - (i - start) * (pointC.x - pointG.x) / (pointF.x - pointB.x);
                    tmpG = new Point(x, pointB.y - kCG * (x - pointC.x));

                    if (pointK.x < 0) {
                        this.drawPath([pointI, tmpG], [], this.animationCtx);
                        this.drawPath([tmpG, pointE], [], this.animationCtx);
                        this.drawPath([pointI, pointE], [], this.animationCtx);
                    } else {
                        let ratio = (pointD.x - pointI.x) / (pointC.x - pointE.x);
                        let tmpX = pointI.x + (tmpG.x - pointE.x) * ratio;
                        let tmpY = pointI.y - (tmpX - pointD.x) * kCG;
                        tmpK = new Point(tmpX, tmpY);
                        this.drawPath([pointI, tmpK], [], this.animationCtx);
                        this.drawPath([tmpK, tmpG], [], this.animationCtx);
                        this.drawPath([tmpG, pointE], [], this.animationCtx);
                        this.drawPath([pointI, pointE], [], this.animationCtx);
                    }

                    let cross1;
                    let cross2;
                    let cross3;
                    let cross4;
                    let crossX;
                    let crossY;
                    let kJF = (tmpJ.y - tmpF.y) / (tmpF.x - tmpJ.x);
                    let kEF = (pointE.y - tmpF.y) / (tmpF.x - pointE.x);

                    // JF cross AD
                    crossX = (tmpJ.x - pointA.x) + (tmpJ.y - pointA.y) / kJF;
                    cross1 = new Point(pointA.x + crossX, this.minY);

                    // JF cross CD
                    crossY = kJF * (this.maxX - tmpJ.x) + (this.maxY - tmpJ.y);
                    cross2 = new Point(this.maxX, this.maxY - crossY);

                    // EF cross AD
                    crossX = (pointE.x - pointA.x) + (pointE.y - pointA.y) / kEF;
                    cross3 = new Point(pointA.x + crossX, this.minY);

                    // EF cross CD
                    crossY = kEF * (this.maxX - pointE.x);
                    cross4 = new Point(this.maxX, this.maxY - crossY);

                    if (pointH.x === this.minX && pointH.y > this.minY && pointI.y > this.minY && pointI.x === this.maxX) {
                        if (tmpF.y < this.minY) {
                            let kHF = (pointH.y - pointF.y) / (pointF.x - pointH.x);
                            crossX = (pointH.x - pointA.x) + (pointH.y - pointA.y) / kHF;
                            let cross5 = new Point(pointA.x + crossX, this.minY);

                            this.drawPath([pointH, pointA, cross5], [], this.animationCtx);
                            this.drawPath([cross3, pointD, pointI], [], this.animationCtx);
                        } else {
                            this.drawPath([pointH, pointA, pointD, pointI], [], this.animationCtx);
                        }
                    } else if (pointH.x >= this.minX && pointH.y === this.minY && pointI.y >= this.minY && pointI.x === this.maxX) {
                        // right triangle
                        if (this.betweenInterval(cross1) && this.betweenInterval(cross2)) {
                            if (this.betweenInterval(cross4) && cross2.y <= pointI.y) {
                                this.drawPath([cross1, pointD, cross2], [], this.animationCtx);
                                this.drawPath([cross4, pointI], [], this.animationCtx);
                            } else {
                                this.drawPath([cross1, pointD, pointI], [], this.animationCtx);
                            }
                        } else if (!this.betweenInterval(cross1) && !this.betweenInterval(cross2)) {
                            if (this.betweenInterval(cross3)) {
                                this.drawPath([cross3, pointD, pointI], [], this.animationCtx);
                            } else {
                                this.drawPath([cross4, pointI], [], this.animationCtx);
                            }
                        } else {
                            this.drawPath([pointH, pointD, pointI], [], this.animationCtx);
                        }
                    } else if (pointH.x === this.minX && pointH.y >= this.minY && pointI.y === this.minY && pointI.x <= this.maxX) {
                        // left triangle
                        let kKG = (tmpK.y - tmpG.y) / (tmpG.x - tmpK.x);
                        let crossX = (tmpK.x - pointA.x) + (tmpK.y - pointA.y) / kKG;
                        cross1 = new Point(pointA.x + crossX, this.minY);
                        if (cross1.x <= pointI.x) {
                            this.drawPath([cross1, pointA, pointH], [], this.animationCtx);
                        } else {
                            this.drawPath([pointI, pointA, pointH], [], this.animationCtx);
                        }
                    } else {
                        // no triangle
                        let kGK = (tmpG.y - tmpK.y) / (tmpK.x - tmpG.x);
                        crossX = (tmpG.x - pointA.x) + (tmpG.y - pointA.y) / kGK;
                        let cross5 = new Point(pointA.x + crossX, this.minY);
                        if (cross1.x >= pointH.x && cross5.x <= pointI.x) {
                            this.drawPath([cross1, cross5], [], this.animationCtx);
                        } else {
                            this.drawPath([pointH, pointI], [], this.animationCtx);
                        }
                    }


                    this.drawPolygon([pointA, pointB, pointC, pointD], this.dash, this.animationCtx);

                    if (i === parseInt(end + '')) {
                        this.showAnimation = false;
                    }
                }, (i - start) * speed);
            }
        }

        private showFoldingProcess() {
            this.showAnimation = true;
            this.getAnimationCtx();

            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    this.showFoldingProcessTypeA();
                    break;
                case rectTypes.TYPE_B:
                    this.showFoldingProcessTypeB();
                    break;
                case rectTypes.TYPE_C:
                    this.showFoldingProcessTypeC();
                    break;
                case rectTypes.TYPE_D:
                    this.showFoldingProcessTypeD();
                    break;
                case rectTypes.TYPE_E:
                    this.showFoldingProcessTypeE();
                    break;
                case rectTypes.TYPE_F:
                    this.showFoldingProcessTypeF();
                    break;
            }
        }

        private updateCurrentFolding() {
            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    this.updateSelectedFoldingMutation({
                        points: [new Point(this.spot1.x, this.minY)],
                        type: this.selectedFoldingRectangle.type
                    });
                    break;
                case rectTypes.TYPE_B:
                    this.updateSelectedFoldingMutation({
                        points: [new Point(this.spot1.x, this.minY)],
                        type: this.selectedFoldingRectangle.type
                    });
                    break;
                case rectTypes.TYPE_C:
                    break;
                case rectTypes.TYPE_D:
                    this.updateSelectedFoldingMutation({
                        points: [new Point(this.spot1.x, this.minY)],
                        type: this.selectedFoldingRectangle.type
                    });
                    break;
                case rectTypes.TYPE_E:
                    this.updateSelectedFoldingMutation({
                        points: [new Point(this.spot2.x, this.spot2.y), new Point(this.spot1.x, this.maxY)],
                        type: this.selectedFoldingRectangle.type
                    });
                    break;
                case rectTypes.TYPE_F:
                    this.updateSelectedFoldingMutation({
                        points: [new Point(this.spot2.x, this.spot2.y), new Point(this.spot1.x, this.maxY), new Point(this.spot3.x, this.spot3.y)],
                        type: this.selectedFoldingRectangle.type
                    });
                    break;
            }
            this.updateFoldingThumbnails();
            this.setRectangleBasicInfo(this.selectedFoldingRectangle);
        }

        private drawPolygon(points: Point[], dash: number[], context: CanvasRenderingContext2D = this.ctx) {
            const ctx = context;
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

        private drawPath(points: Point[], dash: number[], context: CanvasRenderingContext2D = this.ctx) {
            const ctx = context;
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
                const newPointX = transPointE.y * (transPointF.x - transPointE.x) / (transPointE.y - transPointF.y) + transPointE.x + pointB.x;
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
                const pointH = new Point(x + pointA.x, -y + height + pointD.y);
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
            const pointE = new Point(x + pointA.x, -y + height + pointD.y);
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
            const pointG = new Point(x0 + pointA.x, pointC.y - y0);
            this.addNewPoint('G', pointG, pointG.x - this.fontSize - this.textMargin, pointG.y + this.fontSize);

            const [x1, y1] = this.findSymmetricPoint(k, new Point(pointF.x - pointB.x, pointF.y - pointB.y), new Point(pointD.x - pointB.x, pointB.y - pointD.y));
            const pointH = new Point(x1 + pointA.x, pointC.y - y1);
            this.addNewPoint('H', pointH, pointH.x - this.fontSize, pointH.y - this.textMargin);

            if (pointG.y > this.minY) {
                const tmpK = (pointG.y - pointH.y) / (pointH.x - pointG.x);
                const x = pointH.x + (pointH.y - pointA.y) / tmpK;
                const pointI = new Point(x, pointA.y);
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
                const pointI = new Point(x, pointA.y);
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
            let pointJ = new Point(-1, -1);
            if (pointH.y >= this.minY) {
                this.addNewPoint('H', pointH, pointH.x - this.fontSize - this.textMargin, pointH.y);
                this.drawPath([pointE, pointH], []);
                this.drawPath([pointH, pointF], []);
                this.drawPath([pointE, pointF], []);
            } else {
                pointH = new Point(point1.x - kBF * (this.maxY - this.minY), this.minY);
                this.addNewPoint('H', pointH, pointH.x - this.textMargin * 2, pointH.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kBF, new Point(0, 0), new Point(pointA.x - point1.x, point1.y - pointA.y));
                pointJ = new Point(point1.x + x, point1.y - y);
                this.drawPath([pointE, pointH], []);
                this.drawPolygon([pointH, pointJ, pointF, pointE], []);
            }


            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let pointI = new Point(this.maxX, this.maxY + (this.maxX - point1.x) / kCG);
            let pointK = new Point(-1, -1);
            if (pointI.y >= this.minY) {
                this.addNewPoint('I', pointI, pointI.x + this.textMargin, pointI.y);
                this.drawPath([pointE, pointI], []);
                this.drawPath([pointG, pointI], []);
                this.drawPath([pointE, pointG], []);
            } else {
                pointI = new Point(point1.x - kCG * (this.maxY - this.minY), this.minY);
                this.addNewPoint('I', pointI, pointI.x - this.textMargin * 2, pointI.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kCG, new Point(0, 0), new Point(pointD.x - point1.x, point1.y - pointD.y));
                pointK = new Point(point1.x + x, point1.y - y);
                this.drawPolygon([pointE, pointI, pointK, pointG], []);
            }


            let cross1;
            let cross2;
            let cross3;
            let cross4;
            let crossX;
            let crossY;
            let kJF = (pointJ.y - pointF.y) / (pointF.x - pointJ.x);
            let kEF = (pointE.y - pointF.y) / (pointF.x - pointE.x);

            // JF cross AD
            crossX = (pointJ.x - pointA.x) + (pointJ.y - pointA.y) / kJF;
            cross1 = new Point(pointA.x + crossX, this.minY);

            // JF cross CD
            crossY = kJF * (this.maxX - pointJ.x) + (this.maxY - pointJ.y);
            cross2 = new Point(this.maxX, this.maxY - crossY);

            // EF cross AD
            crossX = (pointE.x - pointA.x) + (pointE.y - pointA.y) / kEF;
            cross3 = new Point(pointA.x + crossX, this.minY);

            // EF cross CD
            crossY = kEF * (this.maxX - pointE.x);
            cross4 = new Point(this.maxX, this.maxY - crossY);

            if (pointH.x === this.minX && pointH.y > this.minY && pointI.y > this.minY && pointI.x === this.maxX) {
                if (pointF.y < this.minY) {
                    let kHF = (pointH.y - pointF.y) / (pointF.x - pointH.x);
                    crossX = (pointH.x - pointA.x) + (pointH.y - pointA.y) / kHF;
                    let cross5 = new Point(pointA.x + crossX, this.minY);

                    this.drawPath([pointH, pointA, cross5], []);
                    this.drawPath([cross3, pointD, pointI], []);
                } else {
                    this.drawPath([pointH, pointA, pointD, pointI], []);
                }
            } else if (pointH.x >= this.minX && pointH.y === this.minY && pointI.y >= this.minY && pointI.x === this.maxX) {
                // right triangle
                if (this.betweenInterval(cross1) && this.betweenInterval(cross2)) {
                    if (this.betweenInterval(cross4)) {
                        this.drawPath([cross1, pointD, cross2], []);
                        this.drawPath([cross4, pointI], []);
                    } else {
                        this.drawPath([cross1, pointD, pointI], []);
                    }
                }

                if (!this.betweenInterval(cross1) && !this.betweenInterval(cross2)) {
                    if (this.betweenInterval(cross3)) {
                        this.drawPath([cross3, pointD, pointI], []);
                    } else {
                        this.drawPath([cross4, pointI], []);
                    }
                }


            } else if (pointH.x === this.minX && pointH.y >= this.minY && pointI.y === this.minY && pointI.x <= this.maxX) {
                // left triangle
                let kKG = (pointK.y - pointG.y) / (pointG.x - pointK.x);
                let crossX = (pointK.x - pointA.x) + (pointK.y - pointA.y) / kKG;
                cross1 = new Point(pointA.x + crossX, this.minY);
                this.drawPath([cross1, pointA, pointH], []);
            }

            this.drawPolygon([pointA, pointB, pointC, pointD], this.dash);

            this.allPoints.push(new Node('J', pointJ));
            this.allPoints.push(new Node('K', pointK));
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
            let pointJ = new Point(-1, -1);
            if (pointH.y >= this.minY) {
                this.addNewPoint('H', pointH, pointH.x - this.fontSize - this.textMargin, pointH.y);
                this.drawPath([pointE, pointH], []);
                this.drawPath([pointH, pointF], []);
                this.drawPath([pointE, pointF], []);
            } else {
                pointH = new Point(point1.x - kBF * (this.maxY - this.minY), this.minY);
                this.addNewPoint('H', pointH, pointH.x - this.textMargin * 2, pointH.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kBF, new Point(0, 0), new Point(pointA.x - point1.x, point1.y - pointA.y));
                pointJ = new Point(point1.x + x, point1.y - y);
                this.drawPath([pointE, pointH], []);
                this.drawPolygon([pointH, pointJ, pointF, pointE], []);
            }


            const kCG = (pointC.y - pointG.y) / (pointG.x - pointC.x);
            let pointI = new Point(this.maxX, this.maxY + (this.maxX - point1.x) / kCG);
            let pointK = new Point(-1, -1);
            if (pointI.y >= this.minY) {
                this.addNewPoint('I', pointI, pointI.x + this.textMargin, pointI.y);
                this.drawPath([pointE, pointI], []);
                this.drawPath([pointG, pointI], []);
                this.drawPath([pointE, pointG], []);
            } else {
                pointI = new Point(point1.x - kCG * (this.maxY - this.minY), this.minY);
                this.addNewPoint('I', pointI, pointI.x - this.textMargin * 2, pointI.y - this.fontSize / 2);
                let [x, y] = this.findSymmetricPoint(-1 / kCG, new Point(0, 0), new Point(pointD.x - point1.x, point1.y - pointD.y));
                pointK = new Point(point1.x + x, point1.y - y);
                this.drawPolygon([pointE, pointI, pointK, pointG], []);
            }

            let cross1;
            let cross2;
            let cross3;
            let cross4;
            let crossX;
            let crossY;
            let kJF = (pointJ.y - pointF.y) / (pointF.x - pointJ.x);
            let kEF = (pointE.y - pointF.y) / (pointF.x - pointE.x);

            // JF cross AD
            crossX = (pointJ.x - pointA.x) + (pointJ.y - pointA.y) / kJF;
            cross1 = new Point(pointA.x + crossX, this.minY);

            // JF cross CD
            crossY = kJF * (this.maxX - pointJ.x) + (this.maxY - pointJ.y);
            cross2 = new Point(this.maxX, this.maxY - crossY);

            // EF cross AD
            crossX = (pointE.x - pointA.x) + (pointE.y - pointA.y) / kEF;
            cross3 = new Point(pointA.x + crossX, this.minY);

            // EF cross CD
            crossY = kEF * (this.maxX - pointE.x);
            cross4 = new Point(this.maxX, this.maxY - crossY);

            if (pointH.x === this.minX && pointH.y > this.minY && pointI.y > this.minY && pointI.x === this.maxX) {
                if (pointF.y < this.minY) {
                    let kHF = (pointH.y - pointF.y) / (pointF.x - pointH.x);
                    crossX = (pointH.x - pointA.x) + (pointH.y - pointA.y) / kHF;
                    let cross5 = new Point(pointA.x + crossX, this.minY);

                    this.drawPath([pointH, pointA, cross5], []);
                    this.drawPath([cross3, pointD, pointI], []);
                } else {
                    this.drawPath([pointH, pointA, pointD, pointI], []);
                }
            } else if (pointH.x >= this.minX && pointH.y === this.minY && pointI.y >= this.minY && pointI.x === this.maxX) {
                // right triangle
                if (this.betweenInterval(cross1) && this.betweenInterval(cross2)) {
                    if (this.betweenInterval(cross4) && cross2.y <= pointI.y) {
                        this.drawPath([cross1, pointD, cross2], []);
                        this.drawPath([cross4, pointI], []);
                    } else {
                        this.drawPath([cross1, pointD, pointI], []);
                    }
                }

                if (!this.betweenInterval(cross1) && !this.betweenInterval(cross2)) {
                    if (this.betweenInterval(cross3)) {
                        this.drawPath([cross3, pointD, pointI], []);
                    } else {
                        this.drawPath([cross4, pointI], []);
                    }
                }
            } else if (pointH.x === this.minX && pointH.y >= this.minY && pointI.y === this.minY && pointI.x <= this.maxX) {
                // left triangle
                let kKG = (pointK.y - pointG.y) / (pointG.x - pointK.x);
                let crossX = (pointK.x - pointA.x) + (pointK.y - pointA.y) / kKG;
                cross1 = new Point(pointA.x + crossX, this.minY);
                this.drawPath([cross1, pointA, pointH], []);
            } else {
                // no triangle
                let kGK = (pointG.y - pointK.y) / (pointK.x - pointG.x);
                crossX = (pointG.x - pointA.x) + (pointG.y - pointA.y) / kGK;
                let cross5 = new Point(pointA.x + crossX, this.minY);
                this.drawPath([cross1, cross5], []);
            }


            this.drawPolygon([pointA, pointB, pointC, pointD], this.dash);
            this.allPoints.push(new Node('J', pointJ));
            this.allPoints.push(new Node('K', pointK));
            this.setNodesMutation(this.allPoints);

            // set Spots Intervals
            let kEH = (pointE.y - pointH.y) / (pointH.x - pointE.x);
            let a = this.canvasWidth / 2;
            let b = pointE.x - a;
            let minSpot3 = this.getCrossPoint(kEH, a, b);
            this.minSpot3X = a + minSpot3.x;

            let angle = this.getAngle([pointB, pointE, pointG]);
            if (angle < 90) {
                angle = 180 - 2 * angle;
                let targetEF = Math.tan(angle * Math.PI / 180);
                let maxSpot2 = this.getCrossPoint(targetEF, a, b);
                this.maxSpot2X = a + maxSpot2.x;
            } else {
                this.maxSpot2X = this.canvasWidth;
            }
        }

        private betweenInterval(cross: Point) {
            return (cross.x > this.minX && cross.x < this.maxX) || (cross.y > this.minY && cross.y < this.maxY);
        }

        private findSymmetricPoint(k: number, point: Point, origin: Point) {
            const a = k;
            const b = -1;
            const c = point.y - k * point.x;
            const x0 = origin.x;
            const y0 = origin.y;
            const x = ((b * b - a * a) * x0 - 2 * a * b * y0 - 2 * a * c) / (a * a + b * b);
            const y = ((-b * b + a * a) * y0 - 2 * a * b * x0 - 2 * b * c) / (a * a + b * b);
            return [x, y];

        }

        private getMousePosition = (canvas: HTMLCanvasElement, x: number, y: number) => {
            const boundingClientRect = canvas.getBoundingClientRect();
            return {
                x: x - boundingClientRect.left * (canvas.width / boundingClientRect.width),
                y: y - boundingClientRect.top * (canvas.height / boundingClientRect.height),
            };
        };

        private setTypeBSpecialCase() {
            let [pointA] = this.getNodesByName(['A']);
            let width = this.selectedFoldingRectangle.width;
            let height = this.selectedFoldingRectangle.height;
            this.spot1.x = pointA.x + Math.pow(width * width - height * height, 0.5);
            this.updateCurrentFolding();
        }

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
                    let [pointF] = this.getNodesByName(['F']);
                    if (pointF.x < this.minX) {
                        this.setTypeBSpecialCase()
                    }
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
                    // this.minX = this.canvasWidth / 2;
                    if (rect.points.length === 0) {
                        this.spot2.x = this.canvasWidth / 2;
                        this.spot2.y = this.maxY - this.canvasWidth / 2;
                        this.updateSelectedFoldingMutation({
                            points: [new Point(this.spot2.x, this.spot2.y), new Point((this.canvasWidth + this.minX) / 2, this.maxY)],
                            type: rect.type
                        });
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
                        this.updateSelectedFoldingMutation({
                            points: [new Point(this.spot2.x, this.spot2.y), new Point(this.canvasWidth / 2, this.maxY), new Point(this.spot3.x, this.spot3.y)],
                            type: rect.type
                        });
                        // this.updateFoldingThumbnails();
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
                const data = this.canvas.toDataURL('image/png', 1);
                thumbnails.push(data);
            }
            this.setFoldingRectThumbnailsMutation(thumbnails);
        }

        @Watch('selectedFoldingRectangle', {deep: true})
        private watchSelectedFoldingRectangle(oldVal: FoldingRectangle, newVal: FoldingRectangle) {
            this.setFoldingFeature(undefined);
            let points = this.selectedFoldingRectangle.points;
            let point = points[0];
            if (oldVal.type !== newVal.type) {
                if (point) {
                    if (this.selectedFoldingRectangle.type !== rectTypes.TYPE_E && this.selectedFoldingRectangle.type !== rectTypes.TYPE_F) {
                        this.spot1 = new Point(point.x, point.y);
                    } else if (this.selectedFoldingRectangle.type === rectTypes.TYPE_E) {
                        this.spot1 = new Point(points[1].x, points[1].y);
                        this.spot2 = new Point(points[0].x, points[0].y);
                    } else {
                        this.spot1 = new Point(points[1].x, points[1].y);
                        this.spot2 = new Point(points[0].x, points[0].y);
                        this.spot3 = new Point(points[2].x, points[2].y);
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

        private getNodesByName(nodeNames: string[]) {
            let nodes: any = {};
            for (let i = 0; i < this.allPoints.length; i++) {
                nodes[this.allPoints[i].name] = this.allPoints[i].point;
            }
            let result = [];
            for (let i = 0; i < nodeNames.length; i++) {
                result.push(nodes[nodeNames[i]]);
            }
            return result;
        }

        private invalidateTypeA() {
            let [pointF, pointC] = this.getNodesByName(['F', 'C']);
            let cross = false;
            if (pointF.y > pointC.y) {
                cross = true;
            }
            switch (this.selectedFeature.condition) {
                case featureConditions.CROSS:
                    return cross;
                case featureConditions.UNCROSS:
                    return !cross;
            }
            return true;
        }

        private invalidateTypeB() {
            let [pointD, pointG] = this.getNodesByName(['D', 'G']);
            let cross = false;
            if (pointG.x === pointD.x) {
                cross = true;
            }
            switch (this.selectedFeature.condition) {
                case featureConditions.CROSS:
                    return cross;
                case featureConditions.UNCROSS:
                    return !cross;
                case featureConditions.COINCIDENCE:
                    this.setTypeBSpecialCase();
                    return true;
            }
            return true;
        }

        private invalidateTypeC() {
            return true;
        }

        private invalidateTypeD() {
            let [pointG, pointD] = this.getNodesByName(['G', 'D']);
            let cross = false;
            if (pointG.y >= pointD.y) {
                cross = true;
            }
            switch (this.selectedFeature.condition) {
                case featureConditions.CROSS:
                    return cross;
                case featureConditions.UNCROSS:
                    return !cross;
            }
            return true;
        }

        private invalidateTypeE() {
            switch (this.selectedFeature.condition) {
                case featureConditions.UNSELECTABLE:
                    this.spot1.x = this.canvasWidth / 2;
                    this.spot2.x = this.canvasWidth / 2;
                    this.updateCurrentFolding();
                    break;
            }
            return true;
        }

        private invalidateTypeF() {
            let [pointF, pointG] = this.getNodesByName(['F', 'G']);
            let cross = false;
            if (pointF.x > pointG.x) {
                cross = true;
            }
            switch (this.selectedFeature.condition) {
                case featureConditions.CROSS:
                    return cross;
                case featureConditions.UNCROSS:
                    return !cross;
            }
            return true;
        }

        @Watch('selectedFeature', {deep: true})
        private watchSelectedFoldingFeature() {
            console.log(this.selectedFeature);
            if (this.selectedFeature === undefined || this.selectedFeature.foldingType !== this.selectedFoldingRectangle.type) {
                return;
            }
            let invalidate = false;
            switch (this.selectedFeature.foldingType) {
                case rectTypes.TYPE_A:
                    invalidate = this.invalidateTypeA();
                    break;
                case rectTypes.TYPE_B:
                    invalidate = this.invalidateTypeB();
                    break;
                case rectTypes.TYPE_C:
                    invalidate = this.invalidateTypeC();
                    break;
                case rectTypes.TYPE_D:
                    invalidate = this.invalidateTypeD();
                    break;
                case rectTypes.TYPE_E:
                    invalidate = this.invalidateTypeE();
                    break;
                case rectTypes.TYPE_F:
                    invalidate = this.invalidateTypeF();
                    break;
            }

            if (!invalidate) {
                this.setFoldingFeature(undefined);
                this.$notify.error({
                    title: '错误',
                    message: '当前折叠图形不符合所选特点需要满足的前提条件。'
                });
            }
        }

        private getCrossPoint(k: number, a: number, b: number) {
            const tmp1 = b * k * k / (1 + k * k);
            const tmp2 = Math.pow(a * a - b * b * k * k + a * a * k * k, 0.5) / (1 + k * k);
            let x;
            if (k < 0) {
                x = Math.min(tmp1 - tmp2, tmp1 + tmp2);
            } else {
                x = Math.max(tmp1 - tmp2, tmp1 + tmp2);
            }

            const y = Math.pow(a * a - x * x, 0.5);
            return new Point(x, y);
        }

        private getAngle(points: Point[]) {
            const [point1, point2, point3] = points;
            const x1 = point1.x - point2.x;
            const x2 = point3.x - point2.x;
            const y1 = point1.y - point2.y;
            const y2 = point3.y - point2.y;
            const dot = x1 * x2 + y1 * y2;
            const det = x1 * y2 - y1 * x2;
            const angle = Math.atan2(det, dot) / Math.PI * 180;
            return Math.min((angle + 360) % 360, 360 - (angle + 360) % 360);
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
        }
    }
</script>

<style scoped lang="less" src="./ShapeDisplayArea.less">

</style>