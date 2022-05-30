<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container examination-container">
        <el-form
            label-width="120px"
        >
            <section class="tool-form-item">
                <el-form-item :label="$t('考试名称') + '：'" class="required">
                    {{ editQuery.examName }}
                </el-form-item>
                <el-form-item :label="$t('考试编号') + '：'" class="required">
                    {{ editQuery.examCode }}
                </el-form-item>
                <el-form-item :label="$t('学分') + '：'">
                    {{ editQuery.score || 0 }}
                </el-form-item>
                <!--<el-form-item :label="$t('准考证号') + '：'">-->
                <!--<el-radio-group v-model="editQuery.enableTicket" :disabled=true>-->
                <!--<el-radio :label="false">{{$t('不支持考生使用准考证号参加考试')}}</el-radio>-->
                <!--<el-radio :label="true">{{$t('支持考生点击短链输入准考证号参加考试')}}</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('关联证书') + '：'">
                    <el-tag v-if="editQuery.certName" type="success">{{ editQuery.certName }}</el-tag>
                    <span v-else>--</span>
                </el-form-item>
                <el-form-item :label="$t('考试说明') + '：'">
                    {{ editQuery.examPlain ? editQuery.examPlain : '--' }}
                </el-form-item>
            </section>
        </el-form>
    </article>
</template>
<script>
    import {getInfo} from '@/api/exam/exam/exam';

    export default {
        name: 'ExamBasic',
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                editQuery: {}
            };
        },
        created() {
            this.getInfo();
        },
        methods: {
            // 编辑回显
            getInfo() {
                getInfo(this.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
