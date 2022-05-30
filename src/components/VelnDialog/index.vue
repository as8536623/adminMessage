<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="veln__dynamic__group">
        <el-dialog
            :title="$t(dialogTitle)"
            :visible.sync="dialogVisible"
            :width="diaWidth"
            append-to-body
        >
            <div v-if="selectCourseShow" class="bitchInfo">
                <span>已经选择了</span>
                <span>{{ newSelectCourseNum }}</span>
                <span>门课程，请设置收费标准</span>
            </div>
            <div class="chargeLevelContent">
                <span>收费标准：</span>
                <el-input-number
                    v-model="newChargeLevel"
                    controls-position="right"
                    :precision="precision"
                    :min="0"
                    @change="handleChargeChange"
                />
                <span>元/课时</span>
            </div>
            <div class="dialog__btn__line">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    export default {
        name: 'VelnDialog',
        components: {},
        props: {
            dialogTitle: {
                type: String,
                default: ''
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            chargeLevel: {
                type: Number,
                default: 0
            },
            precision: {
                type: Number,
                default: 2
            },
            diaWidth: {
                type: String,
                default: '350px'
            },
            selectCourseNum: {
                type: Number,
                default: 0
            },
            selectCourseShow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                newChargeLevel: this.chargeLevel,
                newDialogVisible: false,
                newSelectCourseNum: 0
            };
        },
        watch: {
            dialogVisible: {
                handler(v) {
                    this.newDialogVisible = v;
                }
            },
            chargeLevel: {
                handler(v) {
                    this.newChargeLevel = v;
                }
            },
            selectCourseNum: {
                handler(v) {
                    this.newSelectCourseNum = v;
                }
            }
        },
        methods: {
            handleChargeChange(value) {
                this.$emit('change', value);
            },
            cancel() {
                this.newDialogVisible = false;
                this.$emit('cancel', this.newDialogVisible);
            },
            sure() {
                this.newDialogVisible = false;
                this.$emit('sure', this.newDialogVisible, this.selectCourseShow);
            }
        }
    };
</script>
