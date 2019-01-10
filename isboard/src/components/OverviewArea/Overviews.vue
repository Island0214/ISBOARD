<template>
    <div :class="['overview-area', {'selected-blackboard': blackboard.id === curBlackboard.id}]">
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

        private mounted() {
            console.log(this.blackboard)
        }
    }
</script>

<style scoped lang="less" src="./OverviewArea.less">

</style>