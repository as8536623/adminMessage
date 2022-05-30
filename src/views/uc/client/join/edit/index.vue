<style lang="scss" scoped>
    @import './style';

    .dialog-footer {
        display: flex;
        justify-content: center;
    }
</style>

<template>
    <article class="app-container form__page">
        <el-form
            ref="listQuery"
            :model="listQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            :disabled="readonly"
        >
            <el-form-item :label="$t('编号') + '：'">
                <el-input v-model.trim="listQuery.code" :placeholder="$t('编号')" :max-length="50" readonly/>
            </el-form-item>
            <el-form-item :label="$t('企业名称') + '：'" prop="name">
                <el-input v-model.trim="listQuery.name" :placeholder="$t('企业名称')" :max-length="50"/>
            </el-form-item>

            <el-form-item :label="$t('appKey') + '：'" prop="appKey">
                <el-input
                    v-model.trim="listQuery.appKey"
                    :placeholder="$t('appKey')"
                    :max-length="10"
                />
            </el-form-item>
            <el-form-item :label="$t('appSecret') + '：'" prop="appSecret">
                <el-input
                    v-model.trim="listQuery.appSecret"
                    :placeholder="$t('appSecret')"
                    :max-length="50"
                />
            </el-form-item>
            <el-form-item :label="$t('url') + '：'" prop="url">
                <el-input
                    v-model.trim="listQuery.url"
                    :placeholder="$t('url')"
                    :max-length="50"
                />
            </el-form-item>
            <el-form-item :label="$t('备注') + '：'" prop="remarks">
                <el-input
                    v-model.trim="listQuery.remarks"
                    type="textarea"
                    :placeholder="$t('备注')"
                    :rows="6"
                    :max-length="500"
                    clearable
                />
            </el-form-item>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </section>
        </el-form>
    </article>
</template>

<script>
    /**
     * todo
     * 1. 编辑
     */
    import {getCode} from '@/api/teacher/teacher';
    import checkPermission from '@/utils/permission';
    import {regionData} from 'element-china-area-data';
    import {insertJoinCourse, updateJoinCourse, getJoinCourse} from '@/api/course';

    export default {
        name: 'PersonEdit',
        components: {

        },
        data() {
            return {
                regionData,
                industryList: null,
                readonly: false,
                industry: [], // 行业
                addressNum: [], // 省市区
                listQuery: {
                    code: '', // 编号
                    name: '', // 姓名
                    appKey: '', // 联系人
                    appSecret: '', // 联系电话
                    url:'',
                    remarks: '',
                    status: 'DISABLED'// 备注
                },
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入工号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入姓名'),
                            trigger: 'blur'
                        }
                    ],
                    appKey: [
                        {
                            required: true,
                            message: this.$t('请输入AppKey'),
                            trigger: 'blur'
                        }
                    ],
                    appSecret: [
                        {
                            required: true,
                            message: this.$t('请输入AppSecret'),
                            trigger: 'blur'
                        }
                    ]
                },
                dialogVisible: false
            };
        },
        async mounted() {
            const {id, readonly} = this.$route.query;
            if (id) {
                this.getUserAllInfo(id);
            } else {
                this.getCode();
            }
            this.readonly = readonly;
        },
        methods: {
            checkPermission,
            // 获取code
            getCode() {
                getCode().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.listQuery.code = result.data;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取编号异常'));
                    }
                });
            },
            cancel() {
                history.go(-1);
            },
            getUserAllInfo(id) {
                const params = {
                    id
                };
                getJoinCourse(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const data = result.data;
                        this.listQuery = Object.assign(
                            {},
                            this.listQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取用户信息出错'));
                    }
                });
            },
            sure() {
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        const params = Object.assign({}, this.listQuery);
                        if (this.listQuery.id){
                            updateJoinCourse(params).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    history.go(-1);
                                } else {
                                    this.$errorMsg(
                                        this.$t(result.msg || '保存失败')
                                    );
                                }
                            });
                        } else {
                            insertJoinCourse(params).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    history.go(-1);
                                } else {
                                    this.$errorMsg(
                                        this.$t(result.msg || '保存失败')
                                    );
                                }
                            });
                        }

                    }
                });
            },
            showPersonSelectDialog() {
                this.dialogVisible = true;
            },
            personSelectDialogToggle(type) {
                switch (type) {
                    case 'CONFIRM':
                        const active = this.$refs.personSelect.active;
                        if (active && active.id) {
                            this.listQuery.userId = [active];
                        }
                        this.dialogVisible = false;
                        break;
                    case 'CANCEL':
                        this.dialogVisible = false;
                        break;
                }
            },
            deletePersonTag() {
                this.listQuery.userId = [];
            }
        }
    };
</script>
