<template>
    <div class="banner-wrapper">
        <img src="../../assets/banner.png"/>
        <div class="login-area" v-if="!logStatus">
            <a @click="showHelp = true">Help</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="openLogInDialog('log')">Log In</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="openLogInDialog('sign')">Register</a>
        </div>
        <div class="login-area" v-else>
            <a @click="showHelp = true">Help</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a>{{ logUser.username }}</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="logout">Log Out</a>
        </div>
        <log-dialog v-model="logInStatus"></log-dialog>
        <help-dialog v-model="showHelp"></help-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import LogDialog from '../LogDialog/LogDialog.vue';
    import HelpDialog from '../HelpDialog/HelpDialog.vue';
    import {Action, Getter} from 'vuex-class';
    import {User} from '../../store';

    @Component({
        components: {
            LogDialog,
            HelpDialog,
        },
    })
    export default class Banner extends Vue {
        @Getter('logStatus') private logStatus!: boolean;
        @Getter('logUser') private logUser!: User;
        @Action('logOutAction') private logOutAction!: any;

        private logInStatus: object = {
            type: 'sign',
            status: false,
        };

        private showHelp: boolean = false;

        @Watch('logInStatus', {deep: true})
        private changeLogIn(newVal: boolean) {
        }

        private openLogInDialog(type: string) {
            this.logInStatus = {
                type,
                status: true,
            };
        }

        private logout() {
            this.logOutAction((username: string) => {
                this.$message({
                    type: 'success',
                    message: 'User: ' + username + ' has logged out.'
                })
            });
        }


    }
</script>

<style scoped src="./Banner.less" lang="less">
</style>