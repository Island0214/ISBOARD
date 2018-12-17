<template>
    <div class="banner-wrapper">
        <img src="../../assets/banner.png"/>
        <div class="login-area">
            <a @click="openLogInDialog('sign')">Sign Up</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="openLogInDialog('log')">Log In</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="showHelp = true">Help</a>
        </div>
        <log-dialog v-model="logInStatus"></log-dialog>
        <help-dialog v-model="showHelp"></help-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import LogDialog from '../LogDialog/LogDialog.vue';
    import HelpDialog from '../HelpDialog/HelpDialog.vue';

    @Component({
        components: {
            LogDialog,
            HelpDialog,
        },
    })
    export default class Banner extends Vue {
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
                type: {type},
                status: true,
            };
        }


    }
</script>

<style scoped src="./Banner.less" lang="less">
</style>