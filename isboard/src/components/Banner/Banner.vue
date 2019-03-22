<template>
    <div class="banner-wrapper">
        <img src="../../assets/banner.png"/>
        <!--<div class="login-area" v-if="!logStatus">-->
            <!--<a @click="showHelp = true">Help</a>-->
            <!--&nbsp;&nbsp;|&nbsp;&nbsp;-->
            <!--<a @click="openLogInDialog('log')">Log In</a>-->
            <!--&nbsp;&nbsp;|&nbsp;&nbsp;-->
            <!--<a @click="openLogInDialog('sign')">Register</a>-->
        <!--</div>-->
        <!--<div class="login-area" v-else>-->
            <!--<a @click="showHelp = true">Help</a>-->
            <!--&nbsp;&nbsp;|&nbsp;&nbsp;-->
            <!--<a>{{ logUser.username }}</a>-->
            <!--&nbsp;&nbsp;|&nbsp;&nbsp;-->
            <!--<a @click="logout">Log Out</a>-->
        <!--</div>-->
        <div class="login-area">
            <el-select v-model="questionType" placeholder="请选择题目类型">
                <el-option
                        v-for="item in questionTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </div>
        <log-dialog v-model="logInStatus"></log-dialog>
        <help-dialog v-model="showHelp"></help-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import LogDialog from '../LogDialog/LogDialog.vue';
    import HelpDialog from '../HelpDialog/HelpDialog.vue';
    import {Action, Getter, Mutation} from 'vuex-class';
    import {User} from '../../store';
    import * as questions from '../../base/question-type';
    import * as mutations from '../../store/mutation-types'

    @Component({
        components: {
            LogDialog,
            HelpDialog,
        },
    })
    export default class Banner extends Vue {
        @Getter('logStatus') private logStatus!: boolean;
        @Getter('logUser') private logUser!: User;
        @Getter('selectedQuestionType') private selectedQuestionType!: string;
        @Mutation(mutations.SET_QUESTION_TYPE) private setQuestionTypeMutation!: any;
        @Action('logOutAction') private logOutAction!: any;
        private questionType: string = '';
        private questionTypes: string[] = [questions.FOLDING, questions.UNFOLDING];
        private logInStatus: object = {
            type: 'sign',
            status: false,
        };

        @Watch('questionType')
        private watchQuestionChange() {
            this.setQuestionTypeMutation(this.questionType);
        }

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

        private mounted() {
            this.questionType = questions.FOLDING;
        }

    }
</script>

<style scoped src="./Banner.less" lang="less">
</style>