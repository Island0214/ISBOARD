<template>
    <div class="identify-area-wrapper">
        <div class="input-wrapper">
            <h3>题目类型</h3>
            <el-select v-model="questionType" placeholder="请选择题目类型">
                <el-option
                        v-for="item in questionTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </div>
        <div class="input-wrapper">
            <h3>题干输入</h3>
            <el-input
                    type="textarea"
                    :rows="11"
                    placeholder="请输入需要识别的题干"
                    v-model="textarea">
            </el-input>
        </div>
        <el-button style="margin: 10px 0;" class="my-button">识 别 题 干</el-button>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as questions from '../../base/question-type';

    @Component({
        components: {
        },
    })
    export default class IdentifyArea extends Vue {
        private textarea: string = '';
        private questionType: string = questions.FOLDING;
        private questionTypes: string[] = [questions.FOLDING, questions.UNFOLDING];
    }
</script>

<style lang="less" scoped src="./IdentifyArea.less">

</style>