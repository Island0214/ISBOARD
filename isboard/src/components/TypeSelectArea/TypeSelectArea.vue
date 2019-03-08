<template>
    <div class="type-select-area-wrapper">
        <div :class="['single-type-wrapper', {'selected-blackboard': rect === selectedFoldingType}]" v-for="rect in rectangleFoldings" @click="selectFoldingType(rect)">

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as rectTypes from '../../base/rectangle-folding'
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class TypeSelectArea extends Vue {
        private rectangleFoldings: string[] = [rectTypes.TYPE_A, rectTypes.TYPE_B, rectTypes.TYPE_C, rectTypes.TYPE_D, rectTypes.TYPE_E];

        @Getter('selectedFoldingType') private selectedFoldingType!: string;
        @Mutation(mutations.SET_FOLDING_TYPE) private setFoldingTypeMutation!: any;

        private selectFoldingType(type: string) {
            this.setFoldingTypeMutation(type);
        }

    }
</script>

<style scoped lang="less" src="./TypeSelectArea.less">

</style>