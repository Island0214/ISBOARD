<template>
    <div>
        <div class="tool-wrapper">
            <div class="switch-button" v-if="type === 'tool-selector'" @click="switchType">
                <img src="../../assets/buttons/switch.png"/>
            </div>
            <button @click="clickButton" :class="'button-' + curType" v-if="type.startsWith('tool')">
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
                <!--<a slot="reference"></a>-->
                <!--<a slot="reference">click 激活</a>-->
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
    @Component({})
    export default class Tool extends Vue {
        @Prop(String) private type!: string;
        @Prop(String) private name!: string;

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

        get thicknessHeight () {
            return {
                height: this.thickness + 'px',
            };
        }

        @Watch('color', {deep: true})
        private watchCount(newVal: string) {
        }

        private switchType() {
            if (this.curType.includes('solid')) {
                this.curType = this.curType.split('-')[0];
            } else {
                this.curType += '-solid';
            }
        }

        private clickButton() {
            // alert(this.type)
        }
        private mounted() {
            // alert(this.type)
        }
    }
</script>

<style scoped src="./Toolbox.less" lang="less">
</style>