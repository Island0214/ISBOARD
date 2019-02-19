<template>
    <div class="layer-area-wrapper">
        <div class="title">
            <p>Layer</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Model, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class LayerArea extends Vue {
        // @Prop()
        // @Model('change')
        // private dialogVisible!: boolean;
        //
        // private username: string = '';
        // private password: string = '';
        // private pasVisible: boolean = false;
        //
        // private closeDialog() {
        //     this.$emit('change', false);
        // }

    }
</script>

<style scoped lang="less" src="./LayerArea.less">

</style>