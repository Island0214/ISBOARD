<template>
    <div class="type-select-area-wrapper">
        <div :class="['single-type-wrapper', {'selected-blackboard': rect === selectedFoldingType}]" v-for="rect in foldingRectangles" @click="selectFoldingType(rect)">
            <img :src="rect.thumbnail"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import * as rectTypes from '../../base/rectangle-folding'
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'
    import {FoldingRectangle} from '../../store';

    @Component({})
    export default class TypeSelectArea extends Vue {
        private rectangleFoldings: string[] = [rectTypes.TYPE_A, rectTypes.TYPE_B, rectTypes.TYPE_C, rectTypes.TYPE_D, rectTypes.TYPE_E];

        @Getter('selectedFoldingType') private selectedFoldingType!: string;
        @Getter('foldingRectangles') private foldingRectangles!: string;
        @Mutation(mutations.SET_FOLDING_TYPE) private setFoldingTypeMutation!: any;

        // @Watch()

        private selectFoldingType(rect: FoldingRectangle) {
            this.setFoldingTypeMutation(rect.type);
        }

    }
</script>

<style scoped lang="less" src="./TypeSelectArea.less">

</style>