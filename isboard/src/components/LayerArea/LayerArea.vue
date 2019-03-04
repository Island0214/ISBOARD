<template>
    <div :class="layerWrapperType">
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
    import * as animations from '../../base/animation-type';

    @Component({
        components: {Layer},
    })
    export default class LayerArea extends Vue {
        private layers: Stroke[] = [];
        private layerWrapperType: string = 'layer-area-wrapper-large';

        @Getter('currentStrokes') private currentStrokes!: Stroke[];
        @Getter('tempAnimationType') private tempAnimationType!: Stroke[];
        @Mutation(mutations.SET_SELECTED_STROKE) private setSelectedStroke!: any;

        @Watch('currentStrokes')
        private setLayer() {
            let layersWrapper = document.getElementsByClassName('layers-wrapper')[0];
            while(layersWrapper.hasChildNodes())
            {
                if (layersWrapper.firstChild) {
                    let firstChild = layersWrapper.firstChild as Node;
                    layersWrapper.removeChild(firstChild);
                }
            }

            this.layers = [];
            setTimeout(() => {
                for (let i = 0; i < this.currentStrokes.length; i++) {
                    this.layers.unshift(this.currentStrokes[i])
                }
                this.setSelectedStroke(this.layers[0]);
            }, 100)
        }

        @Watch('tempAnimationType')
        private changeType() {
            // console.log(this.tempAnimationType)
            switch (this.tempAnimationType) {
                case animations.NULL:
                    this.layerWrapperType = 'layer-area-wrapper-large';
                    break;
                case animations.SHAKING:
                    this.layerWrapperType = 'layer-area-wrapper-large';
                    break;
                case animations.ZOOMING:
                    this.layerWrapperType = 'layer-area-wrapper-large';
                    break;
                case animations.PANNING:
                    this.layerWrapperType = 'layer-area-wrapper-small';
                    break;
                case animations.CENTER_ROTATION:
                    this.layerWrapperType = 'layer-area-wrapper-large';
                    break;
                case animations.LINEAR_MOVEMENT:
                    this.layerWrapperType = 'layer-area-wrapper-medium';
                    break;
                case animations.POINT_ROTATION:
                    this.layerWrapperType = 'layer-area-wrapper-small';
                    break;
            }
        }
    }
</script>

<style scoped lang="less" src="./LayerArea.less">

</style>