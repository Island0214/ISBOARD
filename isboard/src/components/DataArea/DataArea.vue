<template>
    <div class="data-area-wrapper">
        <h4>长度设置 (px)</h4>
        <div class="input-wrapper" v-for="(border, index) in displayBorders">
            <h3>边{{ border }}</h3>
            <el-input type="number" class="border-input" :min="1" :controls="false" v-model="borderLengths[index]" :precision="2" @blur="inputBlur"></el-input>
        </div>
        <div class="input-wrapper" v-for="(border, index) in disableBorders">
            <h3>边{{ border }}</h3>
            <el-input type="number" class="border-input" :min="1" :controls="false" v-model="disableBorderLengths[index]" :precision="2" :disabled="true"></el-input>
        </div>

        <h4>角度设置 (°)</h4>
        <div class="input-wrapper" v-for="(angle, index) in displayAngles">
            <h3>∠{{ angle }}</h3>
            <el-input type="number" :min=1 label="描述文字" :controls="false" v-model="anglesList[index]" :precision="2" @blur="inputBlur"></el-input>
        </div>
        <div class="input-wrapper" v-for="(angle, index) in disableAngles">
            <h3>∠{{ angle }}</h3>
            <el-input type="number" class="border-input" :min="1" :controls="false" v-model="disableAnglesList[index]" :precision="2" :disabled="true"></el-input>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Getter, Mutation} from 'vuex-class';
    import {FoldingRectangle, Node, Point} from "../../store";
    import * as rectTypes from '../../base/rectangle-folding'
    import * as mutations from '../../store/mutation-types'

    interface Border {
        name: string;
        length: number;
        lengthModel: number;
    }

    class Border implements Border {
        name: string;
        length: number;
        lengthModel: number;

        constructor(node1: Node, node2: Node) {
            this.name = node1.name + node2.name;
            const x = Math.abs(node1.point.x - node2.point.x);
            const y = Math.abs(node1.point.y - node2.point.y);
            this.length = Math.pow(x * x + y * y, 0.5);
            this.lengthModel = Math.pow(x * x + y * y, 0.5);
        }
    }

    @Component({})
    export default class DataArea extends Vue {
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
        @Getter('canvasWidth') private canvasWidth!: number;
        @Getter('canvasHeight') private canvasHeight!: number;
        @Mutation(mutations.UPDATE_RECTANGLE_SIZE) private updateRectangleSizeMutation!: any;
        @Mutation(mutations.UPDATE_SELECTED_FOLDING) private updateSelectedFoldingMutation!: any;
        private nodesTwoCombine: Node[][] = [];
        private nodesThreeCombine: Node[][] = [];
        private originBorders: any = {};
        private borderLengths: number[] = [];
        private disableBorderLengths: number[] = [];
        private allBorders: any = {};
        private allNodes: any = {};
        private allAngles: any = {};
        private nodeNames: string[] = [];
        private displayBorders: string[] = [];
        private disableBorders: string[] = [];
        private displayAngles: string[] = [];
        private disableAngles: string[] = [];
        private anglesList: number[] = [];
        private disableAnglesList: number[] = [];
        private elementType: any = {
            border: '边',
            angle: '∠'
        };

        private re: RegExp = /^[0-9]+.?[0-9]*$/;

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

        private combine(nodes: Node[], start: number, result: Node[], count: number, num: number) {
            for (let i = start; i < nodes.length + 1 - count; i++)
            {
                result[count - 1] = nodes[i];
                if (count - 1 == 0)
                {
                    if (num === 2) {
                        this.nodesTwoCombine.push([result[0], result[1]]);
                    } else if (num === 3) {
                        this.nodesThreeCombine.push([result[0], result[1], result[2]]);
                    }
                }
                else {
                    this.combine(nodes, i + 1, result, count - 1, num);
                }
            }
        }

        private updateFoldingTypeA(element: string, index: number, originLength: number) {
            let x = 0;
            const point = this.selectedFoldingRectangle.points[0];
            const pointA = this.selectedFoldingRectangle.nodes[0].point;
            if (element === this.elementType.border) {
                const border = this.borderLengths[index];
                const width = this.selectedFoldingRectangle.width;
                const height = this.selectedFoldingRectangle.height;
                switch (index) {
                    case 2:
                        if (border <= 0 || border >= width) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = this.selectedFoldingRectangle.width - border;
                            this.updateSelectedFoldingMutation({points: [new Point(pointA.x + x, point.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                    case 3:
                        if (border <= height || border >= Math.pow(width * width + height * height, 0.5)) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = Math.pow(border * border - height * height, 0.5);
                            this.updateSelectedFoldingMutation({points: [new Point(pointA.x + x, point.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                }
            } else {
                let angle = 0;
                let cur = parseFloat(this.anglesList[index] + '');
                switch (index) {
                    case 0:
                        angle = (180 - cur) / 2;
                        break;
                    case 1:
                        angle = cur;
                        break;
                    case 2:
                        angle = 90 - cur;
                        break;
                    case 3:
                        angle = 45 + cur;
                        break;
                }
                x = this.selectedFoldingRectangle.height / Math.tan(angle / 180 * Math.PI);
                if (0 < x && x < this.selectedFoldingRectangle.width) {
                    this.updateSelectedFoldingMutation({points: [new Point(pointA.x + parseFloat(x.toFixed(2)), point.y)], type:this.selectedFoldingRectangle.type});
                } else {
                    this.exceedNotification(this.elementType.angle, this.displayAngles[index]);
                }
            }

        }

        private updateFoldingTypeB(element: string, index: number, originLength: number) {
            let x = 0;
            const point = this.selectedFoldingRectangle.points[0];
            const pointA = this.selectedFoldingRectangle.nodes[0].point;
            const width = this.selectedFoldingRectangle.width;
            const height = this.selectedFoldingRectangle.height;
            if (element === this.elementType.border) {
                const border = this.borderLengths[index];
                switch (index) {
                    case 2:
                        if (border <= 0 || border > Math.pow(width * width - height * height, 0.5)) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = parseFloat(border + '');
                            this.updateSelectedFoldingMutation({points: [new Point(pointA.x + x, point.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                    case 3:
                        if (border <= height || border >= Math.pow(width * width + height * height, 0.5)) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = Math.pow(border * border - height * height, 0.5);
                            this.updateSelectedFoldingMutation({points: [new Point(pointA.x + x, point.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                }
            } else {
                let angle = 0;
                let cur = parseFloat(this.anglesList[index] + '');
                switch (index) {
                    case 0:
                        angle = 2 * cur;
                        break;
                    case 1:
                        angle = 90 - cur;
                        break;
                }
                const pointF = this.selectedFoldingRectangle.nodes[5].point;
                x = pointF.x + this.selectedFoldingRectangle.height / Math.tan(angle / 180 * Math.PI);
                if (x < pointA.x || x > pointA.x + Math.pow(width * width - height * height, 0.5)) {
                    this.exceedNotification(this.elementType.angle, this.displayAngles[index]);
                } else {
                    this.updateSelectedFoldingMutation({points: [new Point(parseFloat(x.toFixed(2)), point.y)], type:this.selectedFoldingRectangle.type});
                }
            }
        }

        private updateFoldingTypeD(element: string, index: number, originLength: number) {
            let x = 0;
            const point = this.selectedFoldingRectangle.points[0];
            const pointA = this.selectedFoldingRectangle.nodes[0].point;
            const width = this.selectedFoldingRectangle.width;
            if (element === this.elementType.border) {
                const border = parseFloat(this.borderLengths[index] + '');
                switch (index) {
                    case 2:
                        if (border <= 0 || border >= width) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = width - parseFloat(border + '');
                            this.updateSelectedFoldingMutation({points: [new Point(pointA.x + x, point.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                }
            } else {
                let angle = 0;
                let cur = parseFloat(this.anglesList[index] + '');
                switch (index) {
                    case 0:
                        angle = (180 - cur) / 2;
                        break;
                    // case 1:
                    //     angle = (90 + cur) / 2;
                    //     break;
                    case 1:
                        angle = cur;
                        break;
                    case 2:
                        angle = (180 - cur) / 2;
                        break;
                }
                const pointF = this.selectedFoldingRectangle.nodes[5].point;
                x = pointF.x + this.selectedFoldingRectangle.height / Math.tan(angle / 180 * Math.PI);
                if (x < pointA.x || x > pointA.x + this.selectedFoldingRectangle.width) {
                    this.exceedNotification(this.elementType.angle, this.displayAngles[index]);
                } else {
                    this.updateSelectedFoldingMutation({points: [new Point(parseFloat(x.toFixed(2)), point.y)], type:this.selectedFoldingRectangle.type});
                }
            }
        }

        private updateFoldingTypeE(element: string, index: number, originLength: number) {
            let x = 0;
            const pointA = this.selectedFoldingRectangle.nodes[0].point;
            const width = this.selectedFoldingRectangle.width;
            const point1 = this.selectedFoldingRectangle.points[0];
            const point2 = this.selectedFoldingRectangle.points[1];
            if (element === this.elementType.border) {
                const border = parseFloat(this.borderLengths[index] + '');
                console.log(border)
                switch (index) {
                    case 2:
                        if (border <= 0 || border >= width) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = parseFloat(border + '');
                            this.updateSelectedFoldingMutation({points: [new Point(point1.x, point1.y), new Point(pointA.x + border, point2.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                }
            } else {
                let angle = 0;
                let cur = parseFloat(this.anglesList[index] + '');
                switch (index) {
                    case 0:
                        angle = 180 - 2 * cur;
                        break;
                    case 1:
                        angle = 2 * cur;
                        break;
                }

                if (angle <= 0 || angle >= 180) {
                    this.exceedNotification(this.elementType.angle, this.displayAngles[index]);
                } else {
                    let k = Math.tan(angle * Math.PI / 180);
                    let a = this.canvasWidth / 2;
                    let b = point2.x - this.canvasWidth / 2;
                    let cross = this.getCrossPoint(k, a, b);
                    this.updateSelectedFoldingMutation({points: [new Point(this.canvasWidth / 2 + cross.x, point2.y - cross.y), new Point(point2.x, point2.y)], type:this.selectedFoldingRectangle.type});
                }
            }
        }

        private updateFoldingTypeF(element: string, index: number, originLength: number) {
            let x = 0;
            const pointA = this.selectedFoldingRectangle.nodes[0].point;
            const width = this.selectedFoldingRectangle.width;
            const point1 = this.selectedFoldingRectangle.points[0];
            const point2 = this.selectedFoldingRectangle.points[1];
            const point3 = this.selectedFoldingRectangle.points[2];
            if (element === this.elementType.border) {
                const border = parseFloat(this.borderLengths[index] + '');
                console.log(border)
                switch (index) {
                    case 2:
                        if (border <= 0 || border >= width) {
                            this.borderLengths[index] = originLength;
                            this.exceedNotification(this.elementType.border, this.displayBorders[index]);
                        } else {
                            x = parseFloat(border + '');
                            this.updateSelectedFoldingMutation({points: [new Point(point1.x, point1.y), new Point(pointA.x + border, point2.y), new Point(point3.x, point3.y)], type:this.selectedFoldingRectangle.type});
                        }
                        break;
                }
            } else {
                let angle = 0;
                let cur = parseFloat(this.anglesList[index] + '');
                if (cur <= 0 || cur >= 90) {
                    this.exceedNotification(this.elementType.angle, this.displayAngles[index]);
                } else {
                    let k;
                    let a = this.canvasWidth / 2;
                    let b = point2.x - this.canvasWidth / 2;
                    let cross;
                    switch (index) {
                        case 0:
                            angle = 180 - cur * 2;
                            k = Math.tan(angle * Math.PI / 180);
                            cross = this.getCrossPoint(k, a, b);
                            this.updateSelectedFoldingMutation({points: [new Point(this.canvasWidth / 2 + cross.x, point2.y - cross.y), new Point(point2.x, point2.y), new Point(point3.x, point3.y)], type:this.selectedFoldingRectangle.type});
                            break;
                        case 1:
                            angle = 2 * cur;
                            k = Math.tan(angle * Math.PI / 180);
                            cross = this.getCrossPoint(k, a, b);
                            this.updateSelectedFoldingMutation({points: [new Point(point1.x, point1.y), new Point(point2.x, point2.y), new Point(this.canvasWidth / 2 + cross.x, point2.y - cross.y)], type:this.selectedFoldingRectangle.type});
                            break;
                    }
                }
            }
        }

        private getCrossPoint (k: number, a: number, b:number) {
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


        private inputBlur() {
            for (let i = 0; i < this.displayBorders.length; i++) {
                let origin = parseFloat(this.originBorders[this.displayBorders[i]].toFixed(2));
                // console.log(typeof this.borderLengths[i])
                if (!this.re.test(this.borderLengths[i] + '')){
                    this.borderLengths[i] = origin;
                    return;
                }
                let cur = parseFloat(this.borderLengths[i] + '');

                if (origin !== cur) {
                    if (i <= 1) {
                        const width = parseFloat(this.borderLengths[1] + '');
                        const height = parseFloat(this.borderLengths[0] + '');
                        if (width < 200 || width > 600 || height < 100 || height > 400 || width < height) {
                            const originWidth = this.originBorders[this.displayBorders[1]];
                            const originHeight = this.originBorders[this.displayBorders[0]];
                            this.borderLengths[0] = originHeight;
                            this.borderLengths[1] = originWidth;
                            this.exceedNotification(this.elementType.border, this.displayBorders[i]);
                        } else {
                            this.updateRectangleSizeMutation(new Point(width, height));
                            let point;
                            switch (this.selectedFoldingRectangle.type) {
                                case rectTypes.TYPE_A:
                                    point = this.selectedFoldingRectangle.points[0];
                                    this.updateSelectedFoldingMutation({points: [new Point(point.x, (this.canvasHeight - height) / 2)], type:this.selectedFoldingRectangle.type});
                                    break;
                                case rectTypes.TYPE_B:
                                    point = this.selectedFoldingRectangle.points[0];
                                    this.updateSelectedFoldingMutation({points: [new Point(point.x, (this.canvasHeight - height) / 2)], type:this.selectedFoldingRectangle.type});
                                    break;
                                case rectTypes.TYPE_D:
                                    point = this.selectedFoldingRectangle.points[0];
                                    this.updateSelectedFoldingMutation({points: [new Point(point.x, (this.canvasHeight - height) / 2)], type:this.selectedFoldingRectangle.type});
                                    break;
                                case rectTypes.TYPE_E:
                                    let point1 = this.selectedFoldingRectangle.points[0];
                                    let point2 = this.selectedFoldingRectangle.points[1];
                                    this.updateSelectedFoldingMutation({points: [new Point(point1.x, point1.y), new Point(point2.x, (this.canvasHeight + height) / 2)], type:this.selectedFoldingRectangle.type});
                                    break;
                            }
                        }
                    } else {
                        switch (this.selectedFoldingRectangle.type) {
                            case rectTypes.TYPE_A:
                                this.updateFoldingTypeA(this.elementType.border, i, origin);
                                break;
                            case rectTypes.TYPE_B:
                                this.updateFoldingTypeB(this.elementType.border, i, origin);
                                break;
                            case rectTypes.TYPE_D:
                                this.updateFoldingTypeD(this.elementType.border, i, origin);
                                break;
                            case rectTypes.TYPE_E:
                                this.updateFoldingTypeE(this.elementType.border, i, origin);
                                break;
                            case rectTypes.TYPE_F:
                                this.updateFoldingTypeF(this.elementType.border, i, origin);
                                break;
                        }
                    }
                    this.calculate();
                    break;
                }
            }

            for (let i = 0; i < this.displayAngles.length; i++) {
                let origin = parseFloat(this.allAngles[this.displayAngles[i]].toFixed(2));
                // console.log(typeof this.borderLengths[i])
                if (!this.re.test(this.anglesList[i] + '')){
                    this.anglesList[i] = origin;
                    return;
                }
                let cur = parseFloat(this.anglesList[i] + '');
                if (cur !== origin) {
                    switch (this.selectedFoldingRectangle.type) {
                        case rectTypes.TYPE_A:
                            this.updateFoldingTypeA(this.elementType.angle, i, origin);
                            break;
                        case rectTypes.TYPE_B:
                            this.updateFoldingTypeB(this.elementType.angle, i, origin);
                            break;
                        case rectTypes.TYPE_D:
                            this.updateFoldingTypeD(this.elementType.angle, i, origin);
                            break;
                        case rectTypes.TYPE_E:
                            this.updateFoldingTypeE(this.elementType.angle, i, origin);
                            break;
                        case rectTypes.TYPE_F:
                            this.updateFoldingTypeF(this.elementType.angle, i, origin);
                            break;
                    }
                    this.calculate();
                    break;
                }

            }
        }

        private calculateTypeA() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3], n[3] + n[4], n[1] + n[4]];
            this.disableBorders = [];
            this.displayAngles = [n[3] + n[4] + n[5], n[1] + n[4] + n[5], n[4] + n[1] + n[5], n[2] + n[1] + n[5]];
            this.disableAngles = [];

            this.getBorderLengths([], this.displayBorders);
        }

        private calculateTypeB() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3], n[0] + n[4]];
            this.disableBorders = [n[3] + n[6], n[5] + n[6], n[2] + n[5]];
            this.displayAngles = [n[2] + n[5] + n[6]];
            this.disableAngles = [];
            if (n.length > 7) {
                this.displayAngles.push(n[6] + n[4] + n[7]);
            } else {
                this.displayAngles.push(n[3] + n[4] + n[6]);
            }

            this.getBorderLengths([], this.displayBorders);
        }

        private calculateTypeC() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3]];
            this.disableBorders = [n[1] + n[3], n[0] + n[5], n[1] + n[5]];
            this.displayAngles = [];
            this.disableAngles = [n[0] + n[1] + n[5], n[4] + n[1] + n[3], n[1] + n[5] + n[3]];

            this.getBorderLengths([], this.displayBorders);
        }

        private calculateTypeD() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3], n[3] + n[4]];
            this.disableBorders = [n[0] + n[8]];
            this.displayAngles = [n[1] + n[5] + n[6], n[2] + n[5] + n[4], n[7] + n[4] + n[8]];
            this.disableAngles = [n[0] + n[8] + n[6]];

            this.getBorderLengths([], this.displayBorders);
        }

        private calculateTypeE() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3], n[1] + n[4]];
            this.disableBorders = [n[4] + n[7], n[4] + n[8]];
            this.displayAngles = [n[1] + n[4] + n[7], n[2] + n[4] + n[8]];
            this.disableAngles = [n[7] + n[4] + n[8]];

            this.getBorderLengths([], this.displayBorders);
        }

        private calculateTypeF() {
            let n = this.nodeNames;
            this.displayBorders = [n[0] + n[1], n[0] + n[3], n[1] + n[4]];
            this.disableBorders = [n[4] + n[7], n[4] + n[8]];
            this.displayAngles = [n[1] + n[4] + n[7], n[2] + n[4] + n[8]];
            this.disableAngles = [n[5] + n[4] + n[6]];

            this.getBorderLengths([], this.displayBorders);
        }


        @Watch('displayBorders', {deep: true})
        private getBorderLengths(oldVal: string[], newVal: string[]) {
            if (!oldVal || oldVal.toString() !== newVal.toString()) {
                this.borderLengths = [];
                for (let i = 0; i < this.displayBorders.length; i++) {
                    this.borderLengths.push(parseFloat(this.allBorders[this.displayBorders[i]].toFixed(2)));
                }

                this.disableBorderLengths = [];
                for (let i = 0; i < this.disableBorders.length; i++) {
                    this.disableBorderLengths.push(parseFloat(this.allBorders[this.disableBorders[i]].toFixed(2)));
                }
            }
        }

        private calculate() {
            // console.log('calculate');
            if (this.selectedFoldingRectangle.nodes.length < 2) {
                return;
            }
            let pointB = this.selectedFoldingRectangle.nodes[1].point;
            this.nodeNames = [];
            for (let i = 0; i < this.selectedFoldingRectangle.nodes.length; i++) {
                this.nodeNames.push(this.selectedFoldingRectangle.nodes[i].name);
                let point = this.selectedFoldingRectangle.nodes[i].point;
                this.allNodes[this.selectedFoldingRectangle.nodes[i].name] = new Point(point.x - pointB.x, pointB.y - point.y);
            }
            this.combine(this.selectedFoldingRectangle.nodes, 0, [new Node('', new Point(0,0)),new Node('', new Point(0,0))], 2, 2);
            this.combine(this.selectedFoldingRectangle.nodes, 0, [new Node('', new Point(0,0)),new Node('', new Point(0,0)),new Node('', new Point(0,0))], 3, 3);

            this.allBorders = {};
            this.originBorders = {};
            for (let i = 0; i < this.nodesTwoCombine.length; i++) {
                const [node1, node2] = this.nodesTwoCombine[i];
                const border = new Border(node2, node1);
                this.allBorders[border.name] = border.length;
                this.originBorders[border.name] = border.lengthModel;
            }

            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    this.calculateTypeA();
                    break;
                case rectTypes.TYPE_B:
                    this.calculateTypeB();
                    break;
                case rectTypes.TYPE_C:
                    this.calculateTypeC();
                    break;
                case rectTypes.TYPE_D:
                    this.calculateTypeD();
                    break;
                case rectTypes.TYPE_E:
                    this.calculateTypeE();
                    break;
                case rectTypes.TYPE_F:
                    this.calculateTypeF();
                    break;
            }


            // this.getBorderLengths();
        }

        @Watch('displayAngles', {deep: true})
        private watchDisplayAnglesChange() {
            this.anglesList = [];
            this.allAngles = {};
            for (let i = 0; i < this.displayAngles.length; i++) {
                let nodes = [];
                let angle = this.displayAngles[i];
                if (angle.length !== 3) {
                    continue;
                }
                for (let j = 0; j < angle.length; j++) {
                    nodes.push(this.allNodes[angle[j]]);
                }
                this.allAngles[angle] = parseFloat(this.getAngle(nodes).toFixed(2));
                this.anglesList.push(parseFloat(this.getAngle(nodes).toFixed(2)));
            }
        }

        @Watch('disableAngles', {deep: true})
        private watchDisableAnglesChange() {
            this.disableAnglesList = [];
            // this.allAngles = {};
            for (let i = 0; i < this.disableAngles.length; i++) {
                let nodes = [];
                let angle = this.disableAngles[i];
                if (angle.length !== 3) {
                    continue;
                }
                for (let j = 0; j < angle.length; j++) {
                    nodes.push(this.allNodes[angle[j]]);
                }
                // this.allAngles[angle] = parseFloat(this.getAngle(nodes).toFixed(2));
                this.disableAnglesList.push(parseFloat(this.getAngle(nodes).toFixed(2)));
            }
        }

        @Watch('selectedFoldingRectangle', {deep: true})
        private watchSelectedFoldingRectangle(oldVal: FoldingRectangle, newVal: FoldingRectangle) {
            this.calculate();
            // console.log([oldVal.points[0].x, newVal.points[0].x])
        }

        private exceedNotification(type: string, name: string) {
            this.$notify.error({
                title: '错误',
                message: '超过' + type + name + '的设定范围！'
            });
        }

        private mounted() {
            this.calculate();
        }


    }
</script>

<style scoped lang="less" src="./DataArea.less">

</style>

