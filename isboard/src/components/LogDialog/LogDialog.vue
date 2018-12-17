<template>
    <el-dialog
            :title="dialogVisible.type === 'log'? 'Log In': 'Sign Up'"
            :visible.sync="dialogVisible.status"
            width="400px"
            height="500px"
            :before-close="closeDialog"
    >
        <p>USERNAME</p>
        <el-input v-model="username"></el-input>
        <p>PASSWORD</p>
        <el-input v-model="password" type="password" v-if="!pasVisible"></el-input>
        <el-input v-model="password" v-else></el-input>
        <div class="eye-wrapper" v-if="dialogVisible.type === 'sign'">
            <span @mouseenter="pasVisible = true" @mouseleave="pasVisible = false"></span>
        </div>

        <el-checkbox v-if="dialogVisible.type === 'log'">Remember me</el-checkbox>
        <div v-else style="height: 49px;"></div>

        <span slot="footer" class="dialog-footer" v-if="dialogVisible.type === 'log'">
            <el-button type="primary" @click="closeDialog">Log In</el-button>
            <p>Don't have an account? <span @click="changeType('sign')">Sign Up</span></p>
        </span>
        <span slot="footer" class="dialog-footer" v-else>
            <el-button type="primary" @click="closeDialog">Sign Up</el-button>
            <p>Already have an account? <span @click="changeType('log')">Log In</span></p>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class LogDialog extends Vue {
        @Prop()
        @Model('change')
        private dialogVisible!: {type: string, statue: boolean};

        private username: string = '';
        private password: string = '';
        private pasVisible: boolean = false;

        private closeDialog() {
            this.$emit('change', {
                type: 'log',
                status: false,
            });
        }

        private changeType(type: string) {
            const tar = type;
            this.$emit('change', {
                type: tar,
                status: true,
            });
        }
    }
</script>

<style scoped lang="less" src="./LogDialog.less">

</style>