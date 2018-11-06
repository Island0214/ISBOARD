<template>
    <div class="toolbox-wrapper">
        <tool type="truncate"></tool>
        <tool type="undo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
        <tool type="redo"></tool>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Tool from './Tool.vue';

    @Component({
        components: {
            Tool,
        },
    })
    export default class Toolbox extends Vue {
    }
</script>

<style scoped src="./Toolbox.less" lang="less">
</style>