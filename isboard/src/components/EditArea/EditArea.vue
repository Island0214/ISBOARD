<template>
    <div :class="editWrapperType">
        <div class="title">
            <p>Animation Setting</p>
        </div>
        <div class="edit-wrapper">
            <div class="disable-wrapper" v-if="disableSetting"></div>
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
            <div class="input-wrapper" v-if="showXY">
                <p>X</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="x" :precision="1" :step="0.1" :max="800" :min="0"></el-input-number>
            </div>
            <div class="input-wrapper" v-if="showXY">
                <p>Y</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="y" :precision="1" :step="0.1" :max="600" :min="0"></el-input-number>
            </div>
            <div class="input-wrapper" v-if="showCount">
                <p>路径上复制个数</p>
                <!--<el-input></el-input>-->
                <el-input-number v-model="count" :precision="0" :step="1" :max="10" :min="1"></el-input-number>
            </div>
            <div class="input-wrapper">
                <p>Speed</p>
                <el-slider
                        v-model="speed"
                        :step="1"
                        show-stops
                        :min="1"
                        :max="10"
                >
                </el-slider>
                <!--<el-input-number v-model="speed" :precision="1" :step="0.1" :max="600" :min="0"></el-input-number>-->
            </div>
            <div class="buttons-wrapper">
                <el-button class="my-button my-button-small">RESET</el-button>
                <el-button class="my-button my-button-small" @click="saveCurrentAnimation">SAVE</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue, Watch} from 'vue-property-decorator';
    import * as animations from '../../base/animation-type';
    import * as tools from '../../base/tools';
    import {Action, Getter, Mutation} from 'vuex-class';
    import {Animation, Blackboard, Stroke, User} from '../../store';
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class EditArea extends Vue {
        private x: number = 0;
        private y: number = 0;
        private speed: number = 5;
        private count: number = 1;
        @Getter('selectedStroke') private selectedStroke!: Stroke;
        @Getter('selectedAnimation') private selectedAnimation!: Animation;
        @Getter('tool') private tool!: string;
        @Getter('logUser') private logUser!: User;
        @Getter('blackboard') private blackboard!: Blackboard;

        @Mutation(mutations.SET_TEMP_ANIMATION) private setTempAnimation!: any;
        @Mutation(mutations.SET_CURRENT_ANIMATION) private setCurrentAnimationMutation!: any;
        @Mutation(mutations.SAVE_ANIMATION) private saveAnimation!: any;
        @Action('saveBlackboardAction') private saveBlackboardAction!: any;

        private options = [{
            tool: tools.PEN,
            animations: [animations.NULL, animations.PANNING, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.LINE,
            animations: [animations.NULL, animations.PANNING, animations.LINEAR_MOVEMENT, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.CIRCLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.LINEAR_MOVEMENT, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.RECTANGLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.LINEAR_MOVEMENT, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }, {
            tool: tools.TRIANGLE,
            animations: [animations.NULL, animations.PANNING, animations.ZOOMING, animations.SHAKING, animations.LINEAR_MOVEMENT, animations.CENTER_ROTATION, animations.POINT_ROTATION],
        }];

        private option: { tool: string, animations: string[] } = {tool: '', animations: []};
        private currentAnimation: string = '';
        private editWrapperType: string = 'edit-area-wrapper-small';

        get disableSetting() {
            return this.tool !== tools.SETTING;
        }

        get showXY() {
            if (this.currentAnimation === animations.POINT_ROTATION || this.currentAnimation === animations.PANNING) {
                return true;
            } else {
                return false;
            }
        }

        get showCount() {
            if (this.currentAnimation === animations.POINT_ROTATION || this.currentAnimation === animations.PANNING || this.currentAnimation === animations.LINEAR_MOVEMENT) {
                return true;
            } else {
                return false;
            }
        }

        private saveCurrentAnimation() {
            this.saveAnimation();
            this.saveBlackboardAction({
                user: this.logUser.id,
                canvas: this.blackboard.thumbnail,
                onError: (message: string) => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: message,
                    })
                }
            })
        }

        private setCurrentAnimation() {
            this.setCurrentAnimationMutation({
                type: this.currentAnimation,
                x: this.x,
                y: this.y,
                speed: this.speed,
                count: this.count,
            })
        }

        @Watch('x')
        private changeX() {
            this.setCurrentAnimation();
        }

        @Watch('speed')
        private changeSpeed() {
            this.setCurrentAnimation();
        }

        @Watch('y')
        private changeY() {
            this.setCurrentAnimation();
        }

        @Watch('selectedStroke', {deep: true})
        private changeStroke() {
            this.currentAnimation = this.selectedAnimation.type;
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].tool === this.selectedStroke.type) {
                    this.option = this.options[i];
                    break;
                }
            }
            this.x = this.selectedAnimation.x;
            this.y = this.selectedAnimation.y;
            this.speed = this.selectedAnimation.speed;
            this.count = this.selectedAnimation.count;
        }

        @Watch('currentAnimation')
        private changeAnimation() {
            this.setCurrentAnimation();
            this.setTempAnimation(this.currentAnimation);
            switch (this.currentAnimation) {
                case animations.NULL:
                    this.editWrapperType = 'edit-area-wrapper-small';
                    break;
                case animations.SHAKING:
                    this.editWrapperType = 'edit-area-wrapper-small';
                    break;
                case animations.ZOOMING:
                    this.editWrapperType = 'edit-area-wrapper-small';
                    break;
                case animations.PANNING:
                    this.editWrapperType = 'edit-area-wrapper-large';
                    break;
                case animations.CENTER_ROTATION:
                    this.editWrapperType = 'edit-area-wrapper-small';
                    break;
                case animations.LINEAR_MOVEMENT:
                    this.editWrapperType = 'edit-area-wrapper-medium';
                    break;
                case animations.POINT_ROTATION:
                    this.editWrapperType = 'edit-area-wrapper-large';
                    break;
            }
        }
    }
</script>

<style scoped lang="less" src="./EditArea.less">

</style>