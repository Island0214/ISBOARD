<template>
    <div class="layer-area-wrapper">
        <div class="title">
            <p>Layer</p>
        </div>
        <div class="layers-wrapper">
            <layer v-for="(stroke, index) in layers" :stroke="stroke" :index="index"></layer>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Getter, Mutation} from 'vuex-class';
    import {Stroke} from '../../store';
    import Layer from './Layer.vue';
    import * as mutations from '../../store/mutation-types';

    @Component({
        components: {Layer},
    })
    export default class LayerArea extends Vue {
        private layers: Stroke[] = [];

        @Getter('currentStrokes') private currentStrokes!: Stroke[];
        @Mutation(mutations.SET_SELECTED_STROKE) private setSelectedStroke!: any;

        @Watch('currentStrokes')
        private setLayer() {
            let layersWrapper = document.getElementsByClassName('layers-wrapper')[0];
            while(layersWrapper.hasChildNodes())
            {
                layersWrapper.removeChild(layersWrapper.firstChild);
            }

            this.layers = [];
            setTimeout(() => {
                for (let i = 0; i < this.currentStrokes.length; i++) {
                    this.layers.unshift(this.currentStrokes[i])
                }
                this.setSelectedStroke(this.layers[0]);
            }, 100)

        }
    }
</script>

<style scoped lang="less" src="./LayerArea.less">

</style>