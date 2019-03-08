<template>
    <div id="home-page">
        <div class="left-wrapper">
            <banner></banner>
            <!--<overview-area></overview-area>-->
            <identify-area></identify-area>
        </div>
        <div class="center-wrapper">
            <!--<toolbox></toolbox>-->
            <!--<blackboard></blackboard>-->
            <rectangle-setting-area></rectangle-setting-area>
            <shape-display-area></shape-display-area>
        </div>
        <div class="right-wrapper">
            <!--<edit-area></edit-area>-->
            <!--<layer-area></layer-area>-->
            <data-area></data-area>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Banner from '@/components/Banner/Banner.vue';
    import Toolbox from '@/components/Toolbox/Toolbox.vue';
    import OverviewArea from '@/components/OverviewArea/OverviewArea.vue';
    import Blackboard from '@/components/Blackboard/Blackboard.vue';
    import EditArea from '@/components/EditArea/EditArea.vue';
    import LayerArea from '@/components/LayerArea/LayerArea.vue';
    import IdentifyArea from '@/components/IdentifyArea/IdentifyArea.vue';
    import RectangleSettingArea from '@/components/TypeSelectArea/TypeSelectArea.vue';
    import ShapeDisplayArea from '@/components/ShapeDisplayArea/ShapeDisplayArea.vue';
    import DataArea from '@/components/DataArea/DataArea.vue';

    @Component({
        components: {
            Banner,
            Toolbox,
            OverviewArea,
            Blackboard,
            EditArea,
            LayerArea,
            IdentifyArea,
            RectangleSettingArea,
            ShapeDisplayArea,
            DataArea,
        },
    })
    export default class Home extends Vue {
    }
</script>

<style lang="less">
    #home-page {
        position: relative;
        display: inline-block;
        width: 1400px;
        min-height: 200px;
        /*border: 1px solid #eee;*/
        margin: 0;
        .left-wrapper {
            position: relative;
            display: inline-block;
            width: 320px;
            float: left;
            margin: 0;
        }

        .center-wrapper {
            position: relative;
            display: inline-block;
            width: 860px;
            /*float: right;*/
            margin: 0;
        }

        .right-wrapper {
            position: relative;
            display: inline-block;
            width: 220px;
            float: right;
            margin: 0;
        }
    }
</style>