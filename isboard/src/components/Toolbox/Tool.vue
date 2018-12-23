<template>
    <div>
        <div class="tool-wrapper">
            <div class="switch-button" v-if="type === 'TOOL_SELECTOR'" @click="switchType">
                <img src="../../assets/buttons/switch.png"/>
            </div>
            <button @click="selectTool" :class="'button-' + curType" v-if="type.startsWith('TOOL')">
                <div class="img-wrapper"></div>
            </button>

            <!-- color -->
            <el-color-picker v-model="color" v-if="type === 'COLOR'" :predefine="predefineColors"></el-color-picker>

            <!--thickness-->
            <el-popover
                    placement="bottom"
                    width="200"
                    trigger="click"
                    v-if="type === 'THICKNESS'" >
                <div class="block">
                    <el-slider v-model="thickness" :min="1" :max="20"></el-slider>
                </div>
                <a slot="reference"><span><a :style="thicknessHeight"></a></span></a>

            </el-popover>


            <p v-if="type !== 'split'">{{ name.toLowerCase() }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue, Watch} from 'vue-property-decorator';
    import * as mutations from '../../store/mutation-types';
    import {Mutation} from 'vuex-class';
    import * as types from '../../base/tool-type'
    import * as tools from '../../base/tools'

    @Component({})
    export default class Tool extends Vue {
        @Prop(String) private type!: string;
        @Prop(String) private name!: string;
        @Mutation(mutations.SET_COLOR) private setColor!: any;
        @Mutation(mutations.SET_THICKNESS) private setThickness!: any;
        @Mutation(mutations.SET_TOOL) private setTool!: any;
        @Mutation(mutations.SET_CLEAR) private setClear!: any;

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
            if (this.type === types.TOOL || this.type === types.TOOL_SELECTOR) {
                this.setTool(this.curType);
            }

            if (this.name === tools.TRUNCATE) {
                this.$alert('确定要清空当前黑板吗？', '清空黑板', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.setClear(true);
                        this.$message({
                            type: 'info',
                            message: '成功清除当前黑板！'
                        });
                    }
                });
            }
        }

        private switchType() {
            if (this.curType.toUpperCase().includes('SOLID')) {
                this.curType = this.curType.split('_')[0];
            } else {
                this.curType += '_SOLID';
            }
        }


    }
</script>

<style scoped src="./Toolbox.less" lang="less">
</style>