<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container form__page">
        <el-form
            ref="listQuery"
            :model="listQuery"
            label-width="120px"
            :inline-message="true"
            :rules="rules"
            :disabled="readonly"
        >
            <el-form-item :label="$t('学校名称') + '：'" prop="name">
                <el-input v-model.trim="listQuery.name" :placeholder="$t('学校名称')" :max-length="50"/>
            </el-form-item>
            <el-form-item :label="$t('学校类型') + '：'" prop="type">
                <el-select v-model="listQuery.type" :placeholder="$t('学校类型')">
                    <el-option
                        v-for="item in SCHOOL_TYPE_ENUM.getAllValues()"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('有效期') + '：'" prop="period">
                <el-date-picker
                    v-model="listQuery.period"
                    class="normal"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-form-item>
            <el-form-item :label="$t('校长') + '：'" prop="masterName">
                <el-input
                    v-model.trim="listQuery.masterName"
                    :placeholder="$t('校长')"
                    :max-length="20"
                    clearable
                    @focus="showPersonSelect"
                />
            </el-form-item>
            <el-form-item :label="$t('省市区') + '：'" prop="provinceCode">
                <el-cascader
                    v-model="listQuery.provinceCode"
                    :options="regionData"
                />
            </el-form-item>
            <el-form-item :label="$t('详细地址') + '：'" prop="address">
                <el-input v-model.trim="listQuery.address" :placeholder="$t('详细地址')" :max-length="200"/>
            </el-form-item>
            <el-form-item :label="$t('学校LOGO') + '：'" class="course__upload__line" prop="logo">
                <div class="course__upload__sec logo" @click="showFileSelect">
                    <img
                        v-if="listQuery.logo"
                        class="course__cover"
                        :src="listQuery.logo"
                        :alt="$t('LOGO')"
                    >
                    <svg-icon
                        v-if="!listQuery.logo"
                        icon-class="plus"
                        class-name="course__upload__plus"
                    />
                </div>
                <span class="course__upload__tips">{{ $t('图片大小不能超过2M，建议尺寸300*300px') }}</span>
            </el-form-item>
            <el-form-item>
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </el-form-item>
        </el-form>
        <!--校长选择-->
        <master-select ref="masterSelect" @on-sure="personSelect"/>
        <el-dialog
            v-if="fileDialogVisible"
            :key="fileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
            @close="fileDialogClose"
        >
            <veln-file-select
                app-code="veln-stu"
                fun-code="STU_COVER"
                :multi-select="false"
                :type-arr="['IMAGE']"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>

<script>
    import moment from 'moment';
    import {regionData} from 'element-china-area-data';
    import {SCHOOL_TYPE_ENUM} from '@/enum';
    import {get, insertOrg, updateOrg} from '@/api/school';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import MasterSelect from '@/components/School/MasterSelect';

    export default {
        name: 'SchoolEdit',
        components: {
            VelnFileSelect,
            MasterSelect
        },
        data() {
            return {
                regionData,
                SCHOOL_TYPE_ENUM,
                listQuery: {
                    name: '', // 学校名称
                    type: '', // 学校类型
                    period: [], // 有效期
                    startAt: '', // 有效期开始
                    endAt: '', // 有效期结束
                    masterId: '', // 校长ID
                    masterName: '', // 校长名称
                    provinceCode: null, // 省市区code
                    province: '', // 省市区code
                    address: '', // 详细地址
                    logo: '' // logo
                },
                rules: {
                    name: [{required: true, message: this.$t('请选择部门')}],
                    type: [{required: true, message: this.$t('请选择学校类型')}],
                    period: [{required: true, message: this.$t('请选择有效期')}],
                    masterName: [{required: true, message: this.$t('请选择校长')}],
                    provinceCode: [{required: true, message: this.$t('请选择省市区')}]
                },
                fileDialogKey: null,
                fileDialogVisible: false,
                personDialogVisible: false, // 上级选择
                readonly: false
            };
        },
        mounted() {
            const {id, readonly} = this.$route.query;
            if (readonly) {
                this.readonly = readonly.toString() === 'true';
            }
            if (id) {
                this.id = id;
                this.getInfoById();
            }
        },
        methods: {
            getInfoById() {
                get(this.id).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        const params = result.data;
                        const {startAt, endAt, province, master} = params;
                        params.period = [startAt, endAt];
                        params.masterId = master.id;
                        params.masterName = master.name;
                        params.provinceCode = [`${province.slice(0, 2)}0000`, `${province.slice(0, 4)}00`, province];
                        console.log(params);
                        this.listQuery = params;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            personSelect(result) {
                this.listQuery.masterId = result.id;
                this.listQuery.masterName = result.name;
                this.personDialogVisible = false;
            },
            showPersonSelect() {
                this.$refs.masterSelect.show();
            },
            cancel() {
                history.go(-1);
            },
            sure() {
                // if (this.$store.getters.ajaxIng) {
                //     return;
                // }
                // this.$store.dispatch('setAjaxIng', true);
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        this.listQuery.startAt = moment(this.listQuery.period[0]).format('YYYY-MM-DD');
                        this.listQuery.endAt = moment(this.listQuery.period[1]).format('YYYY-MM-DD');
                        this.listQuery.province = this.listQuery.provinceCode.pop();
                        if (this.id) {
                            this.listQuery.id = this.id;
                            updateOrg(this.listQuery).then(re => {
                                const result = re.data;
                                if (result && result.success) {
                                    history.go(-1);
                                } else {
                                    this.$errorMsg(this.$t(result.msg || '新增校区失败'));
                                }
                            });
                            return;
                        }
                        insertOrg(this.listQuery).then(re => {
                            const result = re.data;
                            if (result && result.success) {
                                history.go(-1);
                            } else {
                                this.$errorMsg(this.$t(result.msg || '新增校区失败'));
                            }
                        });
                    }
                });
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect() {
                this.fileDialogVisible = true;
            },
            onSure(files) {
                this.listQuery.logo = files[0].viewUrl;
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            }
        }
    };
</script>
