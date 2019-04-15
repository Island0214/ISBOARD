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
        <!--<div class="input-wrapper">-->
            <!--<h3>题干输入</h3>-->
            <!--<el-input-->
                    <!--type="textarea"-->
                    <!--:rows="7"-->
                    <!--placeholder="请输入需要识别的题干"-->
                    <!--v-model="textarea">-->
            <!--</el-input>-->
        <!--</div>-->
        <!--<el-button style="margin: 10px 0;" class="my-button">识 别 题 干</el-button>-->
        <div class="input-wrapper">
            <h3>类型特点</h3>
            <div v-for="foldingFeatureKey in Object.keys(foldingFeatures)">
                <h4>{{foldingFeatureKey}}</h4>
                <p class="table-col" v-for="foldingFeature in foldingFeatures[foldingFeatureKey]">
                    {{ foldingFeature.toString() }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import * as questions from '../../base/question-type';
    import * as rectTypes from '../../base/rectangle-folding';
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'
    import {FoldingRectangle, FoldingFeature} from '../../store';
    import * as features from '../../base/features'
    import * as featureTypes from '../../base/feature-types'
    import * as featureConditions from '../../base/feature-conditions'

    @Component({
        components: {
        },
    })
    export default class IdentifyArea extends Vue {
        private textarea: string = '';
        private questionTypes: string[] = [questions.FOLDING, questions.UNFOLDING];
        private foldingType: string = rectTypes.TYPE_A;
        private foldingTypes: string[] = [rectTypes.TYPE_A, rectTypes.TYPE_B, rectTypes.TYPE_C, rectTypes.TYPE_D, rectTypes.TYPE_E, rectTypes.TYPE_F];
        @Getter('selectedQuestionType') private selectedQuestionType!: string;
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
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
                case rectTypes.TYPE_F:
                    return '该折叠类型，通过在矩形的一条边上取一点，将由该点分割的两条边分别进行折叠。';
            }
        }

        get foldingFeatures() {
            switch (this.selectedFoldingRectangle.type) {
                case rectTypes.TYPE_A:
                    return {
                        '通用：': [
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'ABE', 'FBE'),
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.NORMAL, featureTypes.ANGLE, 'DEF', 'ABF'),
                        ],
                        '当EF与BC不相交时：': [
                            new FoldingFeature(features.ANGLE_PLUS, featureConditions.UNCROSS, featureTypes.ANGLE, 'DEF', 'CBF'),
                        ],
                        '当EF与BC相交时：': [
                            new FoldingFeature(features.ANGLE_MINUS, featureConditions.CROSS, featureTypes.ANGLE, 'DEF', 'CBF'),
                            new FoldingFeature(features.BORDER_EQUALITY, featureConditions.CROSS, featureTypes.BORDER, 'BG', 'EG'),
                        ],
                        'E点与D点重合时变为类型3。': [],
                    };
                case rectTypes.TYPE_B:
                    return {
                        '通用：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.NORMAL, featureTypes.ANGLE, 'EFG', 'CFG'),
                        ],
                        'G点在边CD上：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.CROSS, featureTypes.ANGLE, 'EFC', 'EGD'),
                        ],
                        'G点在边AD上：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.UNCROSS, featureTypes.ANGLE, 'EFC', 'HGD'),
                        ],
                        'F点与B点重合时：': [
                            new FoldingFeature(features.CONGRUENCE, featureConditions.UNSELECTABLE, featureTypes.TRIANGLE, 'EBG', 'CBG'),
                        ],
                    };
                case rectTypes.TYPE_C:
                    return {
                        '通用：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.NORMAL, featureTypes.ANGLE, 'EFG', 'CFG'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'ABD', 'EDB'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'ABF', 'EDF'),
                        ],
                    };
                case rectTypes.TYPE_D:
                    return {
                        '通用：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.NORMAL, featureTypes.ANGLE, 'HEI', 'GFB'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.ECHELON, 'CDEF', 'GHEF'),
                        ],
                        '当GH与AD相交时：': [
                            new FoldingFeature(features.ANGLE_PLUS, featureConditions.CROSS, featureTypes.ANGLE, 'BFG', 'AIG'),
                        ],
                        '当GH与AD不相交时：': [
                            new FoldingFeature(features.ANGLE_EQUALITY, featureConditions.UNCROSS, featureTypes.ANGLE, 'BFG', 'AIG'),
                            new FoldingFeature(features.BORDER_EQUALITY, featureConditions.UNCROSS, featureTypes.BORDER, 'IE', 'IF'),
                        ],
                        'E点与D点重合时变为类型1。': [],
                    };
                case rectTypes.TYPE_E:
                    return {
                        '通用：': [
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'ABE', 'AFE'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'CEI', 'GEI'),
                            new FoldingFeature(features.SIMILARITY, featureConditions.NORMAL, featureTypes.TRIANGLE, 'HEF', 'EIG'),
                            new FoldingFeature(features.SIMILARITY, featureConditions.NORMAL, featureTypes.TRIANGLE, 'ABE', 'ECI'),
                        ],
                        '当连线为矩形中线时：': [
                            new FoldingFeature(features.CONGRUENCE, featureConditions.UNSELECTABLE, featureTypes.TRIANGLE, 'HEF', 'EIG'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.UNSELECTABLE, featureTypes.TRIANGLE, 'ABE', 'ECI'),
                        ],
                    };
                case rectTypes.TYPE_F:
                    return {
                        '通用：': [
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'BEH', 'FEH'),
                            new FoldingFeature(features.CONGRUENCE, featureConditions.NORMAL, featureTypes.TRIANGLE, 'CEI', 'GEI'),
                        ],
                        '△FEH与△GEI无重叠时：': [
                            new FoldingFeature(features.TWO_ANGLE_PLUS, featureConditions.UNCROSS, featureTypes.ANGLE, 'BEH', 'CEI', 'FEG'),
                        ],
                        '△FEH与△GEI部分重叠时：': [
                            new FoldingFeature(features.TWO_ANGLE_MINUS, featureConditions.UNCROSS, featureTypes.ANGLE, 'BEH', 'CEI', 'FEG'),
                        ],
                        'EF与EG重合时变为类型5。': [],
                    };
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