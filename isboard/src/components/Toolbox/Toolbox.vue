<template>
    <div>
        <div class="toolbox-wrapper">
            <div  v-for="tool in toolList" style="position: relative; display: inline-block;" @click="clickTool(tool)">
                <tool-split v-if="tool.type === 'split'"></tool-split>
                <tool v-else :type="tool.type" :name="tool.name" :class="{'button-selected':currentSelect === tool.index}"></tool>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Tool from './Tool.vue';
    import ToolSplit from './ToolSplit.vue';

    @Component({
        components: {
            Tool,
            ToolSplit,
        },
    })
    export default class Toolbox extends Vue {
        private toolList = [{
            type: 'tool-click',
            name: 'undo',
        }, {
            type: 'tool-click',
            name: 'redo',
        }, {
            type: 'split',
        }, {
            type: 'tool',
            name: 'pen',
            index: 0,
        }, {
            type: 'tool-selector',
            name: 'line',
            index: 1,
        }, {
            type: 'tool-selector',
            name: 'rectangle',
            index: 2,
        }, {
            type: 'tool-selector',
            name: 'circle',
            index: 3,
        }, {
            type: 'tool-selector',
            name: 'triangle',
            index: 4,
        }, {
            type: 'split',
        }, {
            type: 'color',
            name: 'color',
        }, {
            type: 'thickness',
            name: 'thickness',
        }, {
            type: 'split',
        }, {
            type: 'tool',
            name: 'eraser',
            index: 5,
        }, {
            type: 'tool-click',
            name: 'truncate',
        }];

        private currentSelect: number = 0;
        private currentTool: string = 'pen';

        private clickTool(tool: any) {
            if (tool.index !== undefined) {
                this.currentSelect = tool.index;
                this.currentTool = tool.name;
            }
        }
    }
</script>

<style scoped src="./Toolbox.less" lang="less">
</style>