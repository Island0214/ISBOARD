<template>
    <div class="overview-area-wrapper">
        <el-button style="margin: 10px 0;" class="my-button" @click="createBlackboard">C R E A T E +</el-button>

        <div class="split-line">
            <p>Saved Blackboard</p>
        </div>

        <div class="overviews-area">
            <overviews v-for="(blackboard, index) in blackboards" :key="'blackboard-' + index" :blackboard="blackboard"></overviews>
        </div>

        <div class="notification-area">
            <p>*UP TO 5 BLACKBOARDS</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Overviews from './Overviews.vue';
    import {Getter} from 'vuex-class';
    import {Blackboard} from '../../store';

    @Component({
        components: {
            Overviews,
        },
    })
    export default class OverviewArea extends Vue {
        @Getter('blackboards') private blackboards!: Blackboard[];

        private createBlackboard() {

        }
    }
</script>

<style scoped src="./OverviewArea.less" lang="less">
</style>