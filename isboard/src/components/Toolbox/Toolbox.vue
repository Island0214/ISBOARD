<template>
    <div>
        <div class="toolbox-wrapper">
            <div  v-for="tool in toolList" style="position: relative; display: inline-block;" @click="clickTool(tool)">
                <tool-split v-if="tool.type.toLowerCase() === 'split'"></tool-split>
                <tool v-else :type="tool.type" :name="tool.name" :class="{'button-selected':currentSelect === tool.index}"></tool>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Tool from './Tool.vue';
    import ToolSplit from './ToolSplit.vue';
    import * as types from '../../base/tool-type';
    import * as tools from '../../base/tools';

    @Component({
        components: {
            Tool,
            ToolSplit,
        },
    })
    export default class Toolbox extends Vue {
        private toolList = [{
            type: types.TOOL_CLICK,
            name: tools.UNDO,
        }, {
            type: types.TOOL_CLICK,
            name: tools.REDO,
        }, {
            type: types.SPLIT,
        }, {
            type: types.TOOL,
            name: tools.PEN,
            index: 0,
        }, {
            type: types.TOOL_SELECTOR,
            name: tools.LINE,
            index: 1,
        }, {
            type: types.TOOL_SELECTOR,
            name: tools.RECTANGLE,
            index: 2,
        }, {
            type: types.TOOL_SELECTOR,
            name: tools.CIRCLE,
            index: 3,
        }, {
            type: types.TOOL_SELECTOR,
            name: tools.TRIANGLE,
            index: 4,
        }, {
            type: types.SPLIT,
        }, {
            type: types.COLOR,
            name: tools.COLOR,
        }, {
            type: types.THICKNESS,
            name: tools.THICKNESS,
        }, {
            type: types.SPLIT,
        }, {
            type: types.TOOL,
            name: tools.ERASER,
            index: 5,
        }, {
            type: types.TOOL_CLICK,
            name: tools.TRUNCATE,
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