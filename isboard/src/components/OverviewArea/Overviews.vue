<template>
    <div :class="['overview-area', {'selected-blackboard': blackboard.id === curBlackboard.id}]">
        <div class="delete-button" @click="deleteBlackboard">
            <img src="../../assets/buttons/delete.png"/>
        </div>
        <div class="img-wrapper" @click="changeBlackboard">
            <img :src="blackboard.thumbnail" v-if="blackboard.thumbnail !== ''"/>
        </div>
        <!--<img v-else>-->
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue} from 'vue-property-decorator';
    import {Blackboard, Stroke, User} from '../../store';
    import {Action, Getter, Mutation} from 'vuex-class';
    import * as mutations from '../../store/mutation-types'

    @Component({})
    export default class Overviews extends Vue {
        @Prop() private blackboard!: Blackboard;
        @Getter('blackboard') private curBlackboard!: Blackboard;
        @Getter('logUser') private logUser!: User;
        @Getter('currentStrokes') private currentStrokes!: Stroke[];
        @Mutation(mutations.CHANGE_CANVAS) private changeCanvas!: any;
        @Mutation(mutations.SET_SAVE_CURRENT_CANVAS) private setSaveCurrentCanvas!: any;
        @Action('removeBlackboardAction') private removeBlackboardAction!: any;

        private deleteBlackboard() {
            this.$confirm('Confirm to remove this blackboard？', 'REMOVE BLACKBOARD', {
                confirmButtonText: 'CONFIRM',
                cancelButtonText: 'CANCEL',
                callback: (action) => {
                    if (action === 'confirm') {
                        this.removeBlackboardAction({
                            user: this.logUser.id,
                            blackboardID: this.blackboard.id,
                            onSuccess: () => {
                                this.$message({
                                    type: 'success',
                                    message: 'Remove blackboard successfully！',
                                });
                            },
                            onError: (message: string) => {
                                this.$message({
                                    type: 'error',
                                    message: message,
                                });
                            }
                        })
                        // this.$message({
                        //     type: 'success',
                        //     message: 'Truncate successfully！',
                        // });
                    }
                },
            });
        }

        private changeBlackboard() {
            if (this.currentStrokes.toString() !== this.curBlackboard.strokes.toString()) {
                this.$confirm('Do you want to save your current strokes?\nIf not, you current strokes will be discarded.', 'SAVE STROKES', {
                    confirmButtonText: 'SAVE',
                    cancelButtonText: 'CANCEL',
                    distinguishCancelAndClose: true,
                    callback: (action) => {
                        if (action === 'confirm') {
                            this.setSaveCurrentCanvas({status: true, tarBlackboard: this.blackboard});
                        }
                        if (action === 'cancel') {
                            this.changeCanvas(this.blackboard);
                        }
                    },
                })
            } else {
                this.changeCanvas(this.blackboard);
            }
        }
    }
</script>

<style scoped lang="less" src="./OverviewArea.less">

</style>