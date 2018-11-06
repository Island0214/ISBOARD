<template>
    <div id="home-page">
        <div class="left-wrapper">
            <banner></banner>
            <overview-area></overview-area>
        </div>
        <div class="right-wrapper">
            <toolbox></toolbox>
            <blackboard></blackboard>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Banner from '@/components/Banner/Banner.vue';
    import Toolbox from '@/components/Toolbox/Toolbox.vue';
    import OverviewArea from '@/components/OverviewArea/OverviewArea.vue';
    import Blackboard from '@/components/Blackboard/Blackboard.vue';

    @Component({
        components: {
            Banner,
            Toolbox,
            OverviewArea,
            Blackboard,
        },
    })
    export default class Home extends Vue {
    }
</script>

<style lang="less">
    #home-page {
        position: relative;
        display: inline-block;
        width: 1180px;
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

        .right-wrapper {
            position: relative;
            display: inline-block;
            width: 860px;
            float: right;
            margin: 0;
        }
    }
</style>