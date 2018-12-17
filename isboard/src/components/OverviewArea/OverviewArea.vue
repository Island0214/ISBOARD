<template>
    <div class="overview-area-wrapper">
        <el-button style="margin: 10px 0;" class="my-button">新建黑板</el-button>

        <div class="split-line">
            <p>已保存黑板</p>
        </div>

        <div class="overviews-area">
            <overviews></overviews>
            <!--<overviews></overviews>-->
            <!--<overviews></overviews>-->
        </div>

        <div class="notification-area">
            <p>*最多可保存五个黑板</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Overviews from './Overviews.vue';

    @Component({
        components: {
            Overviews,
        },
    })
    export default class OverviewArea extends Vue {
    }
</script>

<style scoped src="./OverviewArea.less" lang="less">
</style>