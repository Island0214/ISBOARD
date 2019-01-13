<template>
    <div class="overview-area-wrapper">
        <el-button style="margin: 10px 0;" class="my-button" @click="createBlackboard" :disabled="disableCreate">C R E A T E +</el-button>

        <div class="split-line">
            <p>Saved Blackboard</p>
        </div>

        <div class="overviews-area" v-if="logStatus">
            <overviews v-for="(blackboard, index) in blackboards" :key="'blackboard-' + index" :blackboard="blackboard"></overviews>
        </div>
        <div class="overviews-area" v-else>
            <p>You can create new blackboard and save strokes after you log in.</p>
        </div>

        <div class="notification-area">
            <p>*UP TO 5 BLACKBOARDS</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Overviews from './Overviews.vue';
    import {Action, Getter, Mutation} from 'vuex-class';
    import {Blackboard, Stroke, User} from '../../store';
    import * as mutations from '../../store/mutation-types'

    @Component({
        components: {
            Overviews,
        },
    })
    export default class OverviewArea extends Vue {
        @Getter('blackboards') private blackboards!: Blackboard[];
        @Getter('logStatus') private logStatus!: boolean;
        @Getter('logUser') private logUser!: User;
        @Getter('blackboard') private curBlackboard!: Blackboard;
        @Getter('currentStrokes') private currentStrokes!: Stroke[];
        @Mutation(mutations.SET_SAVE_CURRENT_CANVAS) private setSaveCurrentCanvas!: any;
        @Action('createBlackboardAction') private createBlackboardAction!: any;
        @Action('findBlackboardByUserAction') private findBlackboardByUserAction!: any;

        @Watch('logStatus')
        private getBlackboards(newVal: boolean) {
            if (newVal) {
                this.findBlackboardByUserAction({
                    user: this.logUser.id,
                    onError: (message: string) => {
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: message,
                        })
                    }
                });
            }
        }

        get disableCreate() {
            return !this.logStatus;
        }

        private newOverview() {
            this.createBlackboardAction({
                user: this.logUser.id,
                onSuccess: () => {
                },
                onError: (message: string) => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: message,
                    })
                }
            });
        }

        private createBlackboard() {
            if (this.currentStrokes.toString() !== this.curBlackboard.strokes.toString()) {
                this.$confirm('Do you want to save your current strokes?\nIf not, you current strokes will be discarded.', 'SAVE STROKES', {
                    confirmButtonText: 'SAVE',
                    cancelButtonText: 'CANCEL',
                    distinguishCancelAndClose: true,
                    callback: (action) => {
                        if (action === 'confirm') {
                            this.setSaveCurrentCanvas({status: true, tarBlackboard: this.curBlackboard});
                            this.newOverview()
                        }
                        if (action === 'cancel') {
                            this.newOverview()
                        }
                    },
                })
            } else {
                this.newOverview()
            }
        }
    }
</script>

<style scoped src="./OverviewArea.less" lang="less">
</style>