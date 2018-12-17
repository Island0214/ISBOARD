<template>
    <div class="banner-wrapper">
        <img src="../../assets/banner.png"/>
        <div class="login-area">
            <a @click="openLogInDialog('sign')">Sign Up</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a @click="openLogInDialog('log')">Log In</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a>Help</a>
        </div>
        <log-dialog v-model="logInStatus"></log-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import LogDialog from '../LogDialog/LogDialog.vue';

    @Component({
        components: {LogDialog},
    })
    export default class Banner extends Vue {
        private logInStatus: object = {
            status: false,
            type: 'sign',
        };

        @Watch('logInStatus', {deep: true})
        private changeLogIn(newVal: boolean) {
            console.log(newVal)
        }

        private openLogInDialog(type: string) {
            this.logInStatus.type = type;
            this.logInStatus.status = true;
        }


    }
</script>

<style scoped src="./Banner.less" lang="less">
</style>