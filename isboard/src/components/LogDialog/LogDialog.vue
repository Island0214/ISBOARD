<template>
    <el-dialog
            :title="dialogVisible.type === 'log'? 'Log In': 'Sign Up'"
            :visible.sync="dialogVisible.status"
            width="400px"
            height="500px"
            :before-close="closeDialog"
    >
        <p>USERNAME</p>
        <el-input class="my-input" v-model="username"></el-input>
        <p>PASSWORD</p>
        <el-input class="my-input" v-model="password" type="password" v-if="!pasVisible"></el-input>
        <el-input class="my-input" v-model="password" v-else></el-input>
        <div class="eye-wrapper" v-if="dialogVisible.type === 'sign'">
            <span @mouseenter="pasVisible = true" @mouseleave="pasVisible = false"></span>
        </div>

        <el-checkbox v-if="dialogVisible.type === 'log'" v-model="remember">Remember me</el-checkbox>
        <div v-else style="height: 49px;"></div>

        <span slot="footer" class="dialog-footer" v-if="dialogVisible.type === 'log'">
            <el-button type="primary" @click="logIn" class="my-button">Log In</el-button>
            <p>Don't have an account? <span @click="changeType('sign')">Sign Up</span></p>
        </span>
        <span slot="footer" class="dialog-footer" v-else>
            <el-button type="primary" @click="closeDialog" class="my-button">Sign Up</el-button>
            <p>Already have an account? <span @click="changeType('log')">Log In</span></p>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import {Component, Emit, Model, Prop, Vue} from 'vue-property-decorator';
    import {UserLoginPayload} from '../../store';
    import {Action, Getter, State} from 'vuex-class';

    @Component({})
    export default class LogDialog extends Vue {
        @Prop()
        @Model('change')
        private dialogVisible!: {type: string, statue: boolean};

        private username: string = '';
        private password: string = '';
        private remember: boolean = false;
        private pasVisible: boolean = false;

        @Getter('logUser') private logUser!: string;
        @Action('logInAction') private logInAction!: any;

        @Emit('change')
        private closeDialog() {
            return {
                type: this.dialogVisible.type,
                status: false,
            };
        }

        @Emit('change')
        private changeType(type: string) {
            return {
                type,
                status: true,
            };
        }

        private logIn() {
            const userLoginPayload: UserLoginPayload = {
                username: this.username,
                password: this.password,
                remember: this.remember,
            };
            this.logInAction(userLoginPayload);
        }
    }
</script>

<style scoped lang="less" src="./LogDialog.less">

</style>