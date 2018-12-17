<template>
    <div class="blackboard-wrapper">
        <div class="canvas-wrapper" >
            <canvas id="blackboard-canvas" width="800" height="600"></canvas>
        </div>
        <div class="save-button-wrapper">
            <el-button disabled class="my-button">保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    @Component({
    })
    export default class Blackboard extends Vue {
    }
</script>

<style scoped src="./Blackboard.less" lang="less">
</style>