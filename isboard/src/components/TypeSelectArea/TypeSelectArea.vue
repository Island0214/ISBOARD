<template>
    <div class="type-select-area-wrapper">
        <div :class="['single-type-wrapper', {'selected-blackboard': rect === selectedFoldingRectangle}]" v-for="rect in foldingRectangles" @click="selectFoldingType(rect)">
            <img :src="rect.thumbnail"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as rectTypes from '../../base/rectangle-folding'
    import {Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'
    import {FoldingRectangle} from '../../store';

    @Component({})
    export default class TypeSelectArea extends Vue {
        @Getter('selectedFoldingType') private selectedFoldingType!: string;
        @Getter('foldingRectangles') private foldingRectangles!: FoldingRectangle[];
        @Getter('selectedFoldingRectangle') private selectedFoldingRectangle!: FoldingRectangle;
        @Mutation(mutations.SET_FOLDING_TYPE) private setFoldingTypeMutation!: any;


        private selectFoldingType(rect: FoldingRectangle) {
            this.setFoldingTypeMutation(rect.type);
        }
    }
</script>

<style scoped lang="less" src="./TypeSelectArea.less">

</style>