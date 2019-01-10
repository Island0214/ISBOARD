<template>
    <div :class="['overview-area', {'selected-blackboard': blackboard.id === curBlackboard.id}]">
        <div class="delete-button" @click="deleteBlackboard">
            <img src="../../assets/buttons/delete.png"/>
        </div>
        <img :src="blackboard.thumbnail" v-if="blackboard.thumbnail !== ''"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Blackboard} from '../../store';
    import {Getter} from 'vuex-class';

    @Component({})
    export default class Overviews extends Vue {
        @Prop() private blackboard!: Blackboard;
        @Getter('blackboard') private curBlackboard!: Blackboard;

        private deleteBlackboard() {
            this.$confirm('Confirm to delete this blackboard？', 'DELETE BLACKBOARD', {
                confirmButtonText: 'CONFIRM',
                cancelButtonText: 'CANCEL',
                callback: (action) => {
                    if (action === 'confirm') {
                        this.$message({
                            type: 'success',
                            message: 'Truncate successfully！',
                        });
                    }
                },
            });
        }
    }
</script>

<style scoped lang="less" src="./OverviewArea.less">

</style>