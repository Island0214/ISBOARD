<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action} from 'vuex-class';

    @Component({})
    export default class App extends Vue {
        @Action('autoLoginAction') private autoLoginAction!: any;

        private mounted() {
            const id = sessionStorage.id;
            if (id !== undefined) {
                this.autoLoginAction(id);
            }
        }
    }
</script>

<style lang="less">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin: 0;
    }
</style>
