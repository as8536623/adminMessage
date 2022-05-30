<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <el-dialog
        append-to-body
        :title="$t(title)"
        :visible.sync="dialogVisible"
        width="920px"
        top="5vh"
    >
        <veln-person-select ref="person" :multi="true"/>
        <div>
            <div class="vps__btn__line">
                <el-button @click="hide">取消</el-button>
                <el-button type="primary" @click="personSelect">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import VelnPersonSelect from '@/components/VelnPersonSelect';

    export default {
        name: 'PersonSelector',
        components: {
            VelnPersonSelect
        },
        props: {
            title: {
                type: String,
                default: '选择人员'
            }
        },
        data() {
            return {
                dialogVisible: false
            };
        },
        mounted() {
        },
        methods: {
            show() {
                this.dialogVisible = true;
            },
            hide() {
                this.dialogVisible = false;
                this.$emit('on-close');
            },
            personSelect() {
                const $person = this.$refs.person;
                const list = $person.getActive();
                this.$emit('on-sure', list);
                this.hide();
            }
        }
    };
</script>
