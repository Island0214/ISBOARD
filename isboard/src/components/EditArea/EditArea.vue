<template>
    <div class="edit-area-wrapper">
        <div class="title">
            <p>Animation Setting</p>
        </div>
        <div class="edit-wrapper">
            <div class="input-wrapper">
                <p>Animation</p>
                <el-select v-model="currentAnimation" placeholder="请选择">
                    <el-option
                            v-for="item in option.animations"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="input-wrapper">
                <p>X</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="x" :precision="1" :step="0.1" :max="800" :min="0"></el-input-number>
            </div>
            <div class="input-wrapper">
                <p>Y</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="y" :precision="1" :step="0.1" :max="600" :min="0"></el-input-number>
            </div>
            <div class="input-wrapper">
                <p>Count</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="count" :precision="0" :step="1" :max="10" :min="1" :disabled="true"></el-input-number>
            </div>
            <div class="buttons-wrapper">
                <el-button class="my-button my-button-small">RESET</el-button>
                <el-button class="my-button my-button-small">SAVE</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue, Watch} from 'vue-property-decorator';
    import * as animations from '../../base/animation-type';
    import * as tools from '../../base/tools';
    import {Getter} from 'vuex-class';
    import {Animation, Stroke} from '../../store';

    @Component({})
    export default class EditArea extends Vue {
        private x: number = 1;
        private y: number = 1;
        private count: number = 1;
        @Getter('selectedStroke') private selectedStroke!: Stroke;
        @Getter('selectedAnimation') private selectedAnimation!: Animation;

        private options = [{
            tool: tools.PEN,
            animations: [animations.NULL, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.LINE,
            animations: [animations.NULL, animations.LINEAR_MOVEMENT, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.CIRCLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.RECTANGLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.TRIANGLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }];

        private option: {tool: string, animations: string[]} = {tool: '', animations: []};
        private currentAnimation: string = '';
        // @Prop()
        // @Model('change')
        // private dialogVisible!: boolean;
        //
        // private username: string = '';
        // private password: string = '';
        // private pasVisible: boolean = false;
        //
        // private closeDialog() {
        //     this.$emit('change', false);
        // }
        @Watch('selectedStroke', {deep: true})
        private changeStroke() {
            console.log(this.selectedAnimation)
            this.currentAnimation = this.selectedAnimation.type;
            for (let i = 0; i < this.options.length; i++) {
                // console.log(this.options[i].tool)
                if (this.options[i].tool === this.selectedStroke.type) {
                    this.option = this.options[i];
                    break;
                }
            }
        }

    }
</script>

<style scoped lang="less" src="./EditArea.less">

</style>