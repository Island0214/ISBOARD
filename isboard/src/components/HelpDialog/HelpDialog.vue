<template>
    <el-dialog
            title="帮助"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            :fullscreen="true"
    >


    </el-dialog>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class HelpDialog extends Vue {
        @Prop()
        @Model('change')
        private dialogVisible!: boolean;

        private username: string = '';
        private password: string = '';
        private pasVisible: boolean = false;

        private closeDialog() {
            this.$emit('change', false);
        }

    }
</script>

<style scoped lang="less" src="./HelpDialog.less">

</style>