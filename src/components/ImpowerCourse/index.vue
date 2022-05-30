<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container container__padding">
        <el-dialog
            v-if="dialogVisible"
            top="5vh"
            append-to-body
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="1200px"
            @close="hide"
        >
            <section class="dialog__form__container course-selector" :class="{'not-edit': !isEdit}">
                <el-form ref="form" class="dialog-search" :model="listQuery" label-width="100px">
                    <el-form-item :label="$t('关键词') + '：'">
                        <el-input v-model="listQuery.name" :placeholder="$t('输入课程编号/名称搜索')"/>
                    </el-form-item>
                    <el-form-item :label="$t('课程类型') + '：'">
                        <el-select v-model="listQuery.type" :placeholder="$t('请选择课程类型')">
                            <el-option :label="$t('全部')" value=""/>
                            <el-option
                                v-for="item in COURSE_TYPE_ENUM.getAllValues()"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('相关学科') + '：'">
                        <subject-cascader
                            v-model="subject"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('适用层级') + '：'">
                        <el-select
                            v-model="listQuery.level"
                            :placeholder="$t('请选择')"
                        >
                            <el-option
                                v-for="(item, index) in TIER_ENUM.getAllValues()"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('适用行业') + '：'">
                        <industry-cascader
                            v-model="trade"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('适用职业') + '：'">
                        <job-cascader
                            v-model="profession"
                        />
                    </el-form-item>
                    <!--                <el-form-item v-if="isEdit" :label="$t('发布时间')">-->
                    <!--                    <el-date-picker-->
                    <!--                        v-model="date"-->
                    <!--                        type="daterange"-->
                    <!--                        align="right"-->
                    <!--                        unlink-panels-->
                    <!--                        range-separator="至"-->
                    <!--                        start-placeholder="开始日期"-->
                    <!--                        end-placeholder="结束日期"-->
                    <!--                        :picker-options="pickerOptions"-->
                    <!--                    />-->
                    <!--                </el-form-item>-->
                    <el-form-item v-if="!isEdit" :label="$t('截止日期')">
                        <el-date-picker
                            v-model="listQuery.endAt"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :placeholder="$t('截止日期')"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('课程类别') + '：'">
                        <!--:props="{ checkStrictly: false, value: 'id', label: 'name', children: 'child', expandTrigger: 'hover'}" -->
                        <el-cascader
                            v-model="listQuery.categoryId"
                            filterable
                            :options="courseCategoryList"
                            :props="{checkStrictly: true, value: 'id', label: 'name', children: 'child', expandTrigger: 'hover'}"
                            size="medium"
                            placeholder="请选择"
                            :show-all-levels="false"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item v-if="isSqkcsl" :label="$t('是否授权') + '：'">
                        <el-select
                            v-model="listQuery.authFlag"
                            class="course__type__select"
                            size="mini"
                            placeholder="请选择"
                            @change="handleCheckChange()"
                        >
                            <el-option
                                v-for="item in displayOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">{{ $t('搜索') }}</el-button>
                        <el-button type="primary" @click="exportExcel">{{ $t('导出') }}</el-button>
                        <el-button type="primary" @click="exportExcelUrl">{{ $t('导出带地址') }}</el-button>
                    </el-form-item>
                </el-form>
                <qgu-table
                    v-if="tableColumns"
                    ref="table"
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="listLoading"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    @select-all="selectAll"
                    @select="select"
                />
            </section>
            <div v-if="isEdit" class="auth-line">
                <span>共选择{{ multiSelectionIds.length }}门课程，授权账号数</span>
                <div class="auth__number">
                    <el-input-number
                        v-model="number"
                        :min="0"
                        :max="999999"
                        :step="100"
                        :precision="0"
                        :controls="false"
                        :placeholder="$t('授权账号数量')"
                    />
                </div>
                <span>个，</span>
                <!-- <div class="setChargingStandard">
                    <span class="chargingLeft">设置基础收费标准</span>
                    <el-input-number
                        v-model="chargeLevel"
                        :min="0"
                        :max="999999"
                        :precision="2"
                        :step="100"
                        :controls="false"
                    />
                    <span class="chargingright">元/课时，</span>
                </div>-->
                <span>使用截止日期</span>
                <el-date-picker
                    v-model="abortDate"
                    value-format="yyyy-MM-dd"
                    class="small"
                    type="date"
                    :placeholder="$t('截止日期')"
                />
            </div>
            <div v-if="isEdit" class="dialog__btn__line">
                <el-button @click="hide">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="innerVisible"
            append-to-body
            :title="$t(`同步${syncDialogTitle}课程`)"
            :visible.sync="innerVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <section class="sync__select">
                <el-select
                    v-model="syncJobOptionsValue"
                    placeholder="请选择职业"
                    @focus="getSyncOptions('TYPE_JOB')"
                >
                    <el-option
                        v-for="item in syncJobOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
                <el-select
                    v-model="syncCopyrightOptionsValue"
                    filterable
                    placeholder="请选择版权"
                    style="margin-left: 10px"
                    @focus="getSyncOptions('TYPE_COPYRIGHT')"
                >
                    <el-option
                        v-for="item in syncCopyrightOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </section>
            <span slot="footer" class="sync_dialog-footer">
                <el-button @click="syncDialogCancel">取 消</el-button>
                <el-button type="primary" @click="syncDialogConfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import {getCoursePage, pageCourseInfo} from '@/api/customer/course';
    import {getExportExcelFileId, getExportCourseExcelFileId, getExportCourseUrlExcelFileId} from '@/api/client/client';
    import {getColumns} from './config';
    import {COURSE_TYPE_ENUM, TIER_ENUM} from '@/enum';
    import {pickerOptions} from '@/utils';
    import moment from 'moment';
    import IndustryCascader from '@/components/Common/IndustryCascader';
    import JobCascader from '@/components/Common/JobCascader';
    import SubjectCascader from '@/components/Common/SubjectCascader';
    import {transformCommonToCode} from '@/utils/common';
    import {getToken} from '@/utils/auth';
    import {getCategory} from '@/api/courseCategory';
    import {syncCenterCourse, getSyncJobOptions, getSyncCopyrightOptions} from '@/api/course/course/courseCategory';

    export default {
        name: 'ImpowerCourse',
        components: {
            IndustryCascader,
            JobCascader,
            SubjectCascader
        },
        props: {
            title: {
                type: String,
                default: '授权课程'
            },
            authIds: {
                type: Array,
                default() {
                    return [];
                }
            },
            selectedIds: {
                type: Array,
                default() {
                    return [];
                }
            },
            isEdit: {
                type: Boolean,
                default: true
            },
            code: {
                type: String,
                default: ''
            },
            isSqkcsl: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const defaultQueryObj = {
                name: '',
                pageNum: 1,
                pageSize: 10,
                customerId: '',
                useCount: 0,
                endAt: '',
                level: '', // 层级 code
                subjectCode: '', // 所属学科 code
                tradeCode: '', // 行业 code
                professionCode: '', // 职业 Code
                publishStart: '', // 出版时间-开始
                publishEnd: '', // 出版时间-结束
                categoryId: '', // 课程类别
                type: '', // 课程类型
                authFlag: ''// 是否授权
            };

            return {
                TIER_ENUM,
                tableColumns: null,
                COURSE_TYPE_ENUM,
                pickerOptions,
                dialogVisible: false,
                subject: [], // 所属学科
                trade: [], // 行业
                profession: [], // 职业
                listQuery: Object.assign({}, defaultQueryObj),
                list: [],
                total: 0,
                date: [],
                multiSelectionIds: [],
                listLoading: false,
                number: 0,
                chargeLevel: 0,
                abortDate: '',
                funCode: 'COURSE_CATEGORY',
                courseCategoryList: [],
                // 职业列表
                syncJobOptions: [],
                syncCopyrightOptions: [],
                syncCopyrightOptionsValue: '',
                syncJobOptionsValue: '',
                syncDialogCourseId: '',
                courseSelectSync: '',
                syncCode: '',
                innerVisible: false,
                displayOptions: [
                    {
                        value: 'ALL',
                        label: '全部'
                    },
                    {
                        value: 'GRANTED',
                        label: '已授权'
                    },
                    {
                        value: 'NOT_GRANT',
                        label: '未授权'
                    }
                ]
            };
        },
        watch: {
            selectedIds: {
                handler(v) {
                    this.multiSelectionIds = v;
                },
                immediate: true
            },
            isEdit: {
                handler(v) {
                    this.tableColumns = getColumns(v);
                },
                immediate: true
            },
            authIds: {
                handler() {
                    this.listQuery.customerId = this.authIds[0];
                },
                immediate: true,
                deep: true
            },
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            }
        },
        mounted() {
            this.getCategoryTree();
        },
        beforeDestroy() {
            this.$store.commit('SET_SELECTED_IDS', []);
        },
        methods: {
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            show() {
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.getList({
                        pageNum: 1
                    });
                });
            },
            hide() {
                this.dialogVisible = false;
                this.multiSelectionIds = [];
                this.number = 0;
                this.chargeLevel = 0;
                this.abortDate = '';
                this.listQuery = {
                    name: '',
                    pageNum: 1,
                    pageSize: 10,
                    endAt: '',
                    level: '', // 层级 code
                    subjectCode: '', // 所属学科 code
                    tradeCode: '', // 行业 code
                    professionCode: '', // 职业 Code
                    customerId: '',
                    publishStart: '', // 出版时间-开始
                    publishEnd: '', // 出版时间-结束
                    type: '' // 课程类型
                };
                this.subject = []; // 所属学科
                this.trade = []; // 行业
                this.profession = []; // 职业
            },
            listCourse(params) {
                pageCourseInfo(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                        setTimeout(() => {
                            this.renderRow(this.list);
                        }, 300);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getSelectCourse(params) {
                this.tableColumns = getColumns(false);
                getCoursePage(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                        this.syncCode = this.list[0].syncCode;
                        if (this.syncCode) {
                            this.tableColumns.push({
                                field: 'opt',
                                text: this.$t('操作'),
                                fixed: 'right',
                                minWidth: 50,
                                render: (h, param) => {
                                    const optArr = [];
                                    const syncBtn = h('QguButton', {
                                        props: {
                                            toolTip: this.$t('课程同步-中控平台'),
                                            type: 'text',
                                            icon: 'publish'
                                        },
                                        on: {
                                            click: () => {
                                                this.courseSelectSync = param.row.courseVo;
                                                this.syncDialogTitle = this.courseSelectSync.name;
                                                this.syncDialogCourseId = this.courseSelectSync.id;
                                                this.innerVisible = true;
                                            }
                                        }
                                    });
                                    const reSyncBtn = h('QguButton', {
                                        props: {
                                            toolTip: this.$t('课程重新同步-中控平台'),
                                            type: 'text',
                                            icon: 'sync'
                                        },
                                        on: {
                                            click: () => {
                                                this.courseSelectSync = param.row.courseVo;
                                                this.syncDialogTitle = this.courseSelectSync.name;
                                                this.innerVisible = true;
                                            }
                                        }
                                    });

                                    if (param.row.syncCode) {
                                        if (param.row.courseVo.syncGpCourseId) {
                                            optArr.push(reSyncBtn);
                                        } else {
                                            optArr.push(syncBtn);
                                        }
                                        return h('div', optArr, '');
                                    }
                                }
                            });
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                if (Array.isArray(this.data) && this.data.length) {
                    params.publishStart = moment(this.data[0]).format('YYYY-MM-DD HH:mm:ss');
                    params.publishEnd = moment(this.data[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                if (params.endAt) {
                    params.endAt = `${params.endAt} 23:59:59`;
                }
                params.keywords = params.name;
                params.subjectCode = transformCommonToCode([this.subject]);
                params.tradeCode = transformCommonToCode([this.trade]);
                params.professionCode = transformCommonToCode([this.profession]);
                params.categoryId = this.listQuery.categoryId ? this.listQuery.categoryId[this.listQuery.categoryId.length - 1] : null;
                this.listLoading = true;
                if (this.isEdit) {
                    this.listCourse(params);
                } else {
                    this.getSelectCourse(params);
                }
            },
            selectAll(selection) {
                if (selection.length) {
                    this.list.map(item => {
                        const {id} = item;
                        const index = this.multiSelectionIds.indexOf(id);
                        if (index === -1) {
                            this.multiSelectionIds.push(id);
                        }
                    });
                } else {
                    this.list.map(item => {
                        const {id} = item;
                        const index = this.multiSelectionIds.indexOf(id);
                        if (index >= 0) {
                            this.multiSelectionIds.splice(index, 1);
                        }
                    });
                }
            },
            select(selection, row) {
                const {id} = row;
                const index = this.multiSelectionIds.indexOf(id);
                if (index >= 0) {
                    this.multiSelectionIds.splice(index, 1);
                } else {
                    this.multiSelectionIds.push(row.id);
                }
            },
            async getCategoryTree() {
                getCategory(this.funCode).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.courseCategoryList = [result.data];
                        // this.courseCategoryList = this.categoryFilterLevel(child); child
                    }
                });
            },
            categoryFilterLevel(list, level = 0) {
                const cacheLevel = level + 1;
                return list.map(v => {
                    if (Array.isArray(v.child) && v.child.length && cacheLevel < 1) {
                        return {...v, child: this.categoryFilterLevel(v.child, cacheLevel)};
                    } else {
                        v.child && (delete v.child);
                        return v;
                    }
                });
            },
            handleSizeChange(v) {
                this.getList({
                    pageSize: v,
                    pageNum: 1
                });
            },
            handleCurrentChange(v) {
                this.getList({
                    pageNum: v
                });
            },
            renderRow(list) {
                if (!(Array.isArray(list) && list.length)) {
                    return;
                }

                list.map(item => {
                    const {id} = item;
                    if (this.multiSelectionIds.includes(id)) {
                        this.$refs.table.toggleRowSelection(item);
                    }
                });
            },
            save() {
                if (!this.multiSelectionIds.length) {
                    this.$warnMsg(this.$t('请选择授权课程'));
                    return;
                }
                if (!this.number) {
                    this.$warnMsg(this.$t('请填写授权账号的数量'));
                    return;
                }
                if (!this.abortDate) {
                    this.$warnMsg(this.$t('请选择授权账号的到期时间'));
                    return;
                }
                /* if (!this.chargeLevel) {
                    this.$warnMsg(this.$t('请填写基础收费标准'));
                    return;
                }*/
                const ids = [...new Set(this.multiSelectionIds)];
                const [authId = ''] = this.authIds;
                const result = ids.map(id => {
                    return {
                        courseId: id,
                        customerId: authId,
                        endAt: `${this.abortDate} 23:59:59`,
                        courseCount: this.number
                        /* chargeLevel: this.chargeLevel*/
                    };
                });
                // const result = [];
                // ids.map(id => {
                //     courseArr.push({
                //         courseId: id,
                //         endAt: `${this.abortDate} 23:59:59`,
                //         courseCount: this.number
                //     });
                // });

                // this.authIds.map(clientId => {
                //     courseArr.map(item => {
                //         item.customerId = clientId;
                //         result.push(item);
                //     });
                // });

                this.$emit('on-sure', result);
                this.hide();
            },
            async exportExcel() {
                let callback;
                const token = getToken();
                const params = this.listQuery;
                if (Array.isArray(this.data) && this.data.length) {
                    params.publishStart = moment(this.data[0]).format('YYYY-MM-DD HH:mm:ss');
                    params.publishEnd = moment(this.data[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                if (params.endAt) {
                    params.endAt = `${params.endAt} 23:59:59`;
                }
                params.keywords = params.name;
                params.subjectCode = transformCommonToCode([this.subject]);
                params.tradeCode = transformCommonToCode([this.trade]);
                params.professionCode = transformCommonToCode([this.profession]);
                params.categoryId = this.listQuery.categoryId ? this.listQuery.categoryId[this.listQuery.categoryId.length - 1] : null;
                if (Array.isArray(this.multiSelectionIds) && this.multiSelectionIds.length) {
                    const params = {_token: token, courseIds: this.multiSelectionIds};
                    callback = await getExportCourseExcelFileId(params);
                } else {
                    const code = this.code;
                    if (!code) {
                        return;
                    }
                    callback = await getExportExcelFileId(code, params);
                }

                const {data: {data: {id = ''} = {}} = {}} = callback;
                if (!id) {
                    return;
                }

                // 导出excel
                const url = `${process.env.STU_API}/export/downloadExport/${id}?_token=${token}`;
                window.open(url);
            },
            async exportExcelUrl() {
                let callback;
                const token = getToken();
                const params = this.listQuery;
                if (Array.isArray(this.data) && this.data.length) {
                    params.publishStart = moment(this.data[0]).format('YYYY-MM-DD HH:mm:ss');
                    params.publishEnd = moment(this.data[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                if (params.endAt) {
                    params.endAt = `${params.endAt} 23:59:59`;
                }
                params.keywords = params.name;
                params.subjectCode = transformCommonToCode([this.subject]);
                params.tradeCode = transformCommonToCode([this.trade]);
                params.professionCode = transformCommonToCode([this.profession]);
                params.categoryId = this.listQuery.categoryId ? this.listQuery.categoryId[this.listQuery.categoryId.length - 1] : null;
                if (Array.isArray(this.multiSelectionIds) && this.multiSelectionIds.length) {
                    const params = {_token: token, courseIds: this.multiSelectionIds};
                    callback = await getExportCourseUrlExcelFileId(params);
                } else {
                    const code = this.code;
                    if (!code) {
                        return;
                    }
                    callback = await getExportCourseUrlExcelFileId(code, params);
                }

                const {data: {data: {id = ''} = {}} = {}} = callback;
                if (!id) {
                    return;
                }

                // 导出excel
                const url = `${process.env.STU_API}/export/downloadExport/${id}?_token=${token}`;
                window.open(url);
            },
            async getSyncOptions(type) {
                const params = {'syncCode': this.syncCode};
                switch (type) {
                    case 'TYPE_JOB':
                        getSyncJobOptions(params).then(res => {
                            const {data: {data}} = res;
                            this.syncJobOptions = data;
                        });
                        break;
                    case 'TYPE_COPYRIGHT':
                        getSyncCopyrightOptions(params).then(res => {
                            const {data: {data}} = res;
                            this.syncCopyrightOptions = data;
                        });
                        break;
                }
            },
            initSyncOptions(type) {
                switch (type) {
                    case 'TYPE':
                        this.syncTypeWorkOptions = [];
                        this.syncTypeWorkOptionsValue = '';
                        break;
                    case 'TYPE_WORk':
                        this.syncTypeGradeOptions = [];
                        this.syncTypeGradeOptionsValue = '';
                        break;
                }
            },
            syncDialogCancel() {
                this.innerVisible = false;
                this.syncDialogTitle = '';
                this.syncDialogCourseId = '';
                this.syncTypeOptionsValue = '';
                this.syncTypeWorkOptionsValue = '';
                this.syncTypeGradeOptionsValue = '';
                this.syncJobOptionsValue = '';
                this.syncCopyrightOptionsValue = '';
            },
            syncSelectDialogCancel() {
                this.outerVisible = false;
                this.syncCode = '';
                this.courseSelectSync = '';
            },
            syncDialogConfirm() {
                const params = {
                    syncCode: this.syncCode,
                    courseId: this.syncDialogCourseId,
                    copyrightId: this.syncCopyrightOptionsValue,
                    jobId: this.syncJobOptionsValue
                };
                if (params.copyrightId === '' || params.jobId === '') {
                    this.$message.error('版权和职业均不能为空');
                    return;
                }

                syncCenterCourse(params).then(res => {
                    const {data: {success = false, msg = '错误'}} = res;
                    if (success) {
                        this.$message.success('同步成功');
                        this.search();
                        this.innerVisible = false;
                        this.outerVisible = false;
                    } else {
                        this.$message.error(msg);
                    }
                    this.syncJobOptionsValue = '';
                    this.syncCopyrightOptionsValue = '';
                });
            }
        }
    };
</script>
