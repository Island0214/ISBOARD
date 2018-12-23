<template>
    <div>
        <div class="tool-wrapper">
            <div class="switch-button" v-if="type === 'tool-selector'" @click="switchType">
                <img src="../../assets/buttons/switch.png"/>
            </div>
            <button @click="selectTool" :class="'button-' + curType" v-if="type.startsWith('tool')">
                <div class="img-wrapper"></div>
            </button>

            <!-- color -->
            <el-color-picker v-model="color" v-if="type === 'color'" :predefine="predefineColors"></el-color-picker>

            <!--thickness-->
            <el-popover
                    placement="bottom"
                    width="200"
                    trigger="click"
                    v-if="type === 'thickness'" >
                <div class="block">
                    <el-slider v-model="thickness" :min="1" :max="20"></el-slider>
                </div>
                <a slot="reference"><span><a :style="thicknessHeight"></a></span></a>

            </el-popover>


            <p v-if="type !== 'split'">{{ name }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue, Watch} from 'vue-property-decorator';
    import * as types from '../../store/mutation-types';
    import {Mutation} from 'vuex-class';

    @Component({})
    export default class Tool extends Vue {
        @Prop(String) private type!: string;
        @Prop(String) private name!: string;
        @Mutation(types.SET_COLOR) private setColor!: any;
        @Mutation(types.SET_THICKNESS) private setThickness!: any;
        @Mutation(types.SET_TOOL) private setTool!: any;

        private color: string = '#759FD2';
        private curType: string = this.name;
        private thickness: number = 5;

        private predefineColors: string[] = [
            '#ff4500',
            '#ff8c00',
            '#ffd700',
            '#90ee90',
            '#00ced1',
            '#759FD2',
            '#1e90ff',
            '#c71585'];

        get thicknessHeight() {
            this.setThickness(this.thickness);
            return {
                height: this.thickness + 'px',
            };
        }

        @Watch('color', {deep: true})
        private watchColor(newVal: string) {
            this.setColor(newVal);
        }

        @Watch('curType')
        private typeChanged(newVal: string) {
            this.setTool(newVal);
        }

        private selectTool() {
            if (this.type === 'tool' || this.type === 'tool-selector') {
                this.setTool(this.curType);
            }
        }

        private switchType() {
            if (this.curType.includes('solid')) {
                this.curType = this.curType.split('-')[0];
            } else {
                this.curType += '-solid';
            }
        }


    }
</script>

<style scoped src="./Toolbox.less" lang="less">
</style>