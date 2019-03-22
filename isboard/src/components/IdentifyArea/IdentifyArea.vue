<template>
    <div class="identify-area-wrapper" v-if="selectedQuestionType === questionTypes[0]">
        <div class="input-wrapper">
            <h3>折叠类型</h3>
            <el-select v-model="foldingType" placeholder="请选择折叠类型">
                <el-option
                        v-for="item in foldingTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </div>
        <div class="input-wrapper">
            <h3>类型简介</h3>
            <p>{{ foldingIntro }}</p>
        </div>
        <div class="input-wrapper">
            <h3>题干输入</h3>
            <el-input
                    type="textarea"
                    :rows="7"
                    placeholder="请输入需要识别的题干"
                    v-model="textarea">
            </el-input>
        </div>
        <el-button style="margin: 10px 0;" class="my-button">识 别 题 干</el-button>

    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import * as questions from '../../base/question-type';
    import * as rectTypes from '../../base/rectangle-folding';
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'

    @Component({
        components: {
        },
    })
    export default class IdentifyArea extends Vue {
        private textarea: string = '';
        private questionTypes: string[] = [questions.FOLDING, questions.UNFOLDING];
        private foldingType: string = rectTypes.TYPE_A;
        private foldingTypes: string[] = [rectTypes.TYPE_A, rectTypes.TYPE_B, rectTypes.TYPE_C, rectTypes.TYPE_D, rectTypes.TYPE_E];
        @Getter('selectedQuestionType') private selectedQuestionType!: string;
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: string;
        @Mutation(mutations.SET_QUESTION_TYPE) private setQuestionTypeMutation!: any;
        @Mutation(mutations.SET_FOLDING_TYPE) private setFoldingTypeMutation!: any;

        get foldingIntro() {
            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    return '该折叠类型，通过选取矩形的一个顶点及该点对边上的随机点，将两点连线并沿着该连线折叠。';
                case rectTypes.TYPE_B:
                    return '该折叠类型，通过选取矩形的一个顶点，对矩形进行折叠，使得该顶点落到其对边上特定的位置。';
                case rectTypes.TYPE_C:
                    return '该折叠类型，通过选取矩形的一条对角线，沿着对角线将矩形进行折叠，呈现为两个全等三角形。';
                case rectTypes.TYPE_D:
                    return '该折叠类型，通过在矩形的一条对边上各取一个点，沿着两点的连线对矩形进行折叠。';
                case rectTypes.TYPE_E:
                    return '该折叠类型，通过在矩形的一条边上取一点，由该点分割的两条边分别折叠，折叠后两边落至同一直线。';
            }
        }

        @Watch('foldingType')
        private watchFoldingTypeChange() {
            this.setFoldingTypeMutation(this.foldingType);
        }

        @Watch('selectedFoldingRectangle', {deep: true})
        private watchSelectedFoldingRectangle() {
            this.foldingType = this.selectedFoldingRectangle.type;
        }

        // get disableInput() {
        //     return this.questionType === questions.UNFOLDING;
        // }

        private setQuestionType(type: string) {
            this.setQuestionTypeMutation(type);
        }

        // @Watch('questionType')
        // private watchQuestionChange() {
        //     this.setQuestionType(this.questionType);
        // }

        private mounted() {
            // this.setQuestionType(questions.FOLDING);
        }
    }
</script>

<style lang="less" scoped src="./IdentifyArea.less">

</style>