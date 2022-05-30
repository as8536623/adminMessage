<style lang="scss" scoped>
    @import './style';
</style>

<template>
    <article class="app-container container__padding">
        <qgu-drag-row>
            <div slot="left" class="app__row--left">
                <qgu-tree
                    :datalist="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    @include-child-change="includeChildChange"
                    @node-click="nodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span class="organize__tree__text">{{ data.name }}</span>
                    </span>
                </qgu-tree>
            </div>
            <div slot="right" class="app__row--right">
                <section class="person__filter veln__width">
                    <el-form
                        :model="listQuery"
                        :inline="true"
                        label-width="120px"
                        class="demo-form-inline"
                    >
                        <el-form-item :label="$t('课程ID/名称') + '：'">
                            <el-input
                                v-model="listQuery.nameCodeKey"
                                :placeholder="$t('请输入课程ID')"
                                maxlength="20"
                                clearable
                                @keyup.enter.native="getList"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('关键字') + '：'">
                            <el-input
                                v-model="listQuery.userName"
                                :placeholder="$t('姓名/用户名/工号/手机号')"
                                maxlength="20"
                                clearable
                                @keyup.enter.native="getList"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('课程类型') + '：'">
                            <el-select
                                v-model="listQuery.standardList"
                                class="course__type__select"
                                multiple
                                size="mini"
                                placeholder="请选择"
                                @change="handleCheckChange"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
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
                                v-model="listQuery.tier"
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
                        <el-form-item :label="$t('出版时间') + '：'">
                            <el-date-picker
                                v-model="publishDateTime"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                clearable
                                @change="publishDateTimeChange"
                            />
                        </el-form-item>
                        <el-form-item :label="$t('是否显示') + '：'">
                            <el-select
                                v-model="listQuery.displayFlag"
                                class="course__type__select"
                                size="mini"
                                placeholder="请选择"
                                @change="handleCheckChange"
                            >
                                <el-option
                                    v-for="item in displayOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('状态') + '：'">
                            <el-checkbox-group v-model="listQuery.statusList">
                                <el-checkbox
                                    v-for="courseStatus in courseStatusEnum.getValues()"
                                    :key="courseStatus.code"
                                    :label="courseStatus.code"
                                >{{ courseStatus.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-button type="primary" @click="search">{{ $t('查询') }}</el-button>
                        </el-form-item>
                    </el-form>
                </section>
                <section class="opt__line veln__width">
                    <el-button
                        v-if="checkPermission('addCourse')"
                        type="primary"
                        @click="exportAllCourse()"
                    >{{ $t('导出') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('addCourse')"
                        type="primary"
                        @click="add(categorySelected)"
                    >{{ $t('新增') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('enableCourse')"
                        @click="batchEnable()"
                    >{{ $t('启用') }}
                    </el-button>
                    <el-button
                        v-if="checkPermission('enableCourse')"
                        @click="batchDisable()"
                    >{{ $t('停用') }}
                    </el-button>
                    <el-button
                        @click="batchDisplay()"
                    >{{ $t('显示') }}
                    </el-button>
                    <el-button
                        @click="batchUnDisplay()"
                    >{{ $t('隐藏') }}
                    </el-button>
                    <el-button
                        @click="batchChangeCategory()"
                    >{{ $t('修改类别') }}
                    </el-button>
                    <el-button v-if="checkPermission('delCourse')" @click="batchDel()">{{ $t('删除') }}</el-button>
                </section>
                <qgu-table
                    :columns="tableColumns"
                    :data="list"
                    :page="listQuery"
                    :total="total"
                    :loading="listLoading"
                    @selection-change="selectionChange"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </qgu-drag-row>
        <el-dialog
            v-if="authDialogVisible"
            append-to-body
            :title="$t('设置授权')"
            :visible.sync="authDialogVisible"
            width="939px"
        >
            <veln-auth-setting
                app-code="veln-stu"
                :fun-id="funId"
                route="useScope"
                rel-type="COURSE"
                fun-code="COURSE"
                @onClose="authDialogVisible=false"
            />
        </el-dialog>
        <el-dialog
            v-if="categoryDialogVisible"
            :title="$t('选择课程类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            :modal-append-to-body="false"
            @close="categoryDlgClose"
        >
            <section>
                <veln-course-category-select
                    ref="category"
                    :default-expand-all="defaultExpandAll"
                />
                <div class="dialog__btn__line">
                    <el-button @click="categoryDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="categorySelect">确定</el-button>
                </div>
            </section>
        </el-dialog>
        <el-dialog
            v-if="outerVisible"
            :title="$t(`选择推送站点`)"
            :visible.sync="outerVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
            :modal-append-to-body="false"
        >
            <section class="sync__select">
                <el-select v-model="syncCode" placeholder="请选择">
                    <el-option
                        v-for="item in syncOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
                <span slot="footer" class="sync_dialog-footer">
                    <el-button @click="syncSelectDialogCancel">取 消</el-button>
                    <el-button type="primary" @click="syncSelectDialogConfirm">确 定</el-button>
                </span>
            </section>
        </el-dialog>
        <el-dialog
            v-if="innerVisible"
            append-to-body
            :title="$t(`同步${syncDialogTitle}课程`)"
            :visible.sync="innerVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
            :modal-append-to-body="false"
        >
            <section class="sync__select">
                <el-select v-model="syncJobOptionsValue" placeholder="请选择职业" @focus="getSyncOptions('TYPE_JOB')">
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
    import QguTree from '@/components/QguTree';
    import VelnAuthSetting from '@/components/VelnAuthSetting';
    import moment from 'moment';
    import {
        deleteCourse,
        disableCourse,
        enableCourse,
        getList,
        copyCourse,
        displayCourse,
        unDisplayCourse,
        listAllEnable,
        batchChangeCategory
    } from '@/api/course';
    import {getCategory} from '@/api/courseCategory';
    import {COURSE_STATUS_ENUM, TIER_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import VelnCourseCategorySelect from '@/components/VelnCourseCategorySelect';
    import commonData from '@/mixins/commonData';
    import IndustryCascader from '@/components/Common/IndustryCascader';
    import JobCascader from '@/components/Common/JobCascader';
    import SubjectCascader from '@/components/Common/SubjectCascader';
    import {transformCommonToCode} from '@/utils/common';
    import {
        syncHnCourse,
        syncCenterCourse, getSyncJobOptions, getSyncCopyrightOptions
    } from
        '@/api/course/course/courseCategory';
    import {mapActions} from 'vuex';
    import {exportAllCourse} from '@/api/client/client';
    import {getToken} from '@/utils/auth';

    export default {
        name: 'CourseList',
        components: {
            QguTree,
            VelnAuthSetting,
            VelnCourseCategorySelect,
            IndustryCascader,
            SubjectCascader,
            JobCascader
        },
        mixins: [commonData],
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return !(
                            this.checkPermission('addCourse') ||
                            this.checkPermission('delCourse') ||
                            this.checkPermission('enableCourse')
                        );
                    }
                },
                {
                    field: 'code',
                    text: this.$t('编号'),
                    minWidth: 140
                },
                {
                    field: 'name',
                    text: this.$t('名称'),
                    minWidth: 200,
                    render: (h, param) => {
                        const name = param.row.name;
                        if (!name) {
                            return '--';
                        }
                        return h(
                            'span',
                            {
                                attrs: {
                                    class: 'table__td__link'
                                },
                                on: {
                                    click: () => {
                                        this.viewDetail(param.row.id);
                                    }
                                }
                            },
                            name
                        );
                    }
                },
                {
                    field: 'categoryName',
                    text: this.$t('课程类别'),
                    width: 110,
                    align: 'center'
                },
                {
                    field: 'teacherName',
                    text: this.$t('讲师'),
                    align: 'center',
                    minWidth: 140,
                    render: (h, param) => {
                        return param.row.teacherName ? param.row.teacherName : '--';
                    }
                },
                {
                    field: 'period',
                    align: 'center',
                    text: this.$t('课时')
                },
                {
                    field: 'createdAt',
                    text: this.$t('创建时间'),
                    align: 'center',
                    minWidth: 120,
                    render: (h, param) => {
                        const createdAt = param.row.createdAt;
                        return createdAt
                            ? moment(param.row.createdAt).format('YYYY-MM-DD')
                            : '--';
                    }
                },
                {
                    field: 'userName',
                    text: this.$t('创建人'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.userName;
                    }
                },
                {
                    field: 'status',
                    text: this.$t('状态'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        return this.courseStatusEnum.getName(param.row.status);
                    }
                },
                {
                    field: 'displayFlag',
                    text: this.$t('是否显示'),
                    align: 'center',
                    minWidth: 80,
                    render: (h, param) => {
                        return param.row.displayFlag ? '是' : '否';
                    }
                },
                {
                    field: 'publishDate',
                    text: this.$t('出版日期'),
                    align: 'center',
                    minWidth: 120,
                    render: (h, param) => {
                        const publishDate = param.row.publishDate;
                        return publishDate
                            ? moment(param.row.publishDate).format('YYYY-MM')
                            : '';
                    }
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 150,
                    render: (h, param) => {
                        const optArr = [];
                        const previewBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('预览'),
                                type: 'text',
                                icon: 'view'
                            },
                            on: {
                                click: () => {
                                    this.viewDetail(param.row.id);
                                }
                            }
                        });
                        const startBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('启用'),
                                type: 'text',
                                icon: 'enable'
                            },
                            on: {
                                click: () => {
                                    this.start(param.row);
                                }
                            }
                        });
                        const deleteBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('删除'),
                                type: 'text',
                                icon: 'del'
                            },
                            on: {
                                click: () => {
                                    this.del(param.row);
                                }
                            }
                        });
                        const displayBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('显示'),
                                type: 'text',
                                icon: 'eye'
                            },
                            on: {
                                click: () => {
                                    this.display(param.row);
                                }
                            }
                        });
                        const unDisplayBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('隐藏'),
                                type: 'text',
                                icon: 'dense'
                            },
                            on: {
                                click: () => {
                                    this.unDisplay(param.row);
                                }
                            }
                        });
                        const editBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('编辑'),
                                type: 'text',
                                icon: 'edit_s'
                            },
                            on: {
                                click: () => {
                                    this.edit(param.row);
                                }
                            }
                        });
                        const disableBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('停用'),
                                type: 'text',
                                icon: 'disable'
                            },
                            on: {
                                click: () => {
                                    this.disable(param.row);
                                }
                            }
                        });
                        const syncBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('课程同步-中控平台'),
                                type: 'text',
                                icon: 'publish'
                            },
                            on: {
                                click: () => {
                                    // this.courseSync(param.row);
                                    this.courseSelectSync = param.row;
                                    this.outerVisible = true;
                                }
                            }
                        });
                        optArr.push(previewBtn);
                        if ('ENABLED' === param.row.status || 'APPROVE_SUCCESS' === param.row.status) {
                            if (this.checkPermission('enableCourse')) {
                                optArr.push(syncBtn);
                                // optArr.push(syncHNBtn);
                                optArr.push(disableBtn);
                            }
                        }
                        if ('DRAFT' === param.row.status) {
                            if (this.checkPermission('enableCourse')) {
                                optArr.push(startBtn);
                            }
                            // if (this.checkPermission('updCourse')) {
                            optArr.push(editBtn);
                            // }
                            if (this.checkPermission('delCourse')) {
                                optArr.push(deleteBtn);
                            }
                        }
                        if ('DISABLED' === param.row.status) {
                            if (this.checkPermission('enableCourse')) {
                                optArr.push(startBtn);
                            }
                            if (this.checkPermission('updCourse')) {
                                optArr.push(editBtn);
                            }
                        }

                        const copyBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('复制'),
                                type: 'text',
                                icon: 'face'
                            },
                            on: {
                                click: () => {
                                    this.courseCopy(param.row.id);
                                }
                            }
                        });
                        optArr.push(copyBtn);

                        if (false === param.row.displayFlag) {
                            if (this.checkPermission('enableCourse')) {
                                optArr.push(displayBtn);
                            }
                        } else {
                            if (this.checkPermission('enableCourse')) {
                                optArr.push(unDisplayBtn);
                            }
                        }
                        const statisticsBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('统计'),
                                type: 'text',
                                icon: 'course'
                            },
                            on: {
                                click: () => {
                                    this.statistics(param.row.id);
                                }
                            }
                        });
                        optArr.push(statisticsBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                TIER_ENUM,
                tableColumns,
                funId: '',
                list: [],
                total: 0,
                subject: [], // 所属学科
                trade: [], // 行业
                profession: [], // 职业
                tag: [],
                categorySelected: {
                    categoryIdSelected: '',
                    categoryNameSelected: ''
                },
                listQuery: {
                    includeChildCategory: true,
                    nameCodeKey: '',
                    standardList: [],
                    statusList: ['ENABLED', 'DISABLED', 'DRAFT', 'APPROVE_SUCCESS'],
                    tier: '', // 层级
                    level: '', // 层级 code
                    subjectCode: '', // 所属学科 code
                    tradeCode: '', // 行业 code
                    professionCode: '', // 职业 Code
                    myself: false,
                    pageNum: 1,
                    pageSize: 20,
                    userName: '',
                    displayFlag: ''
                },
                courseCondition: {
                    courseIds: [],
                    categoryId: ''
                },
                listLoading: false,
                treeData: [],
                editQuery: {
                    name: '',
                    categoryId: '',
                    id: '',
                    code: '',
                    categoryName: ''
                },
                defaultExpandedKeys: ['0'],
                defaultExpandAll: true,
                selectedData: [],
                courseStatusEnum: COURSE_STATUS_ENUM,
                syncCode: '',
                syncOptions: [],
                options: [
                    {
                        value: 'VIDEO',
                        label: '视频'
                    },
                    {
                        value: 'AUDIO',
                        label: '音频'
                    },
                    {
                        value: 'DOC',
                        label: '文档'
                    }
                ],
                displayOptions: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: true,
                        label: '是'
                    },
                    {
                        value: false,
                        label: '否'
                    }
                ],
                publishDateTime: [],
                authDialogVisible: false,
                categoryDialogVisible: false,
                year: new Date().getFullYear(),
                yearList: [],
                innerVisible: false,
                outerVisible: false,
                courseSelectSync: '',
                syncDialogTitle: '',
                syncDialogCourseId: '',
                // 职业列表
                syncJobOptions: [],
                syncJobOptionsValue: '',
                // 版权列表
                syncCopyrightOptions: [],
                syncCopyrightOptionsValue: '',
                syncTypeOptions: [],
                syncTypeOptionsValue: '',
                syncTypeWorkOptions: [],
                syncTypeWorkOptionsValue: '',
                syncTypeGradeOptions: [],
                syncTypeGradeOptionsValue: ''
            };
        },
        watch: {
            syncTypeOptionsValue: {
                handler() {
                    this.initSyncOptions('TYPE');
                },
                immediate: true
            },
            syncTypeWorkOptionsValue: {
                handler() {
                    this.initSyncOptions('TYPE_WORk');
                },
                immediate: true
            },
            subject: {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            'listQuery.tier': {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            'listQuery.statusList': {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            'listQuery.standardList': {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            trade: {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            profession: {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            },
            publishDateTime: {
                handler: function(newVal) {
                    if (newVal) {
                        this.getList();
                    }
                },
                immediate: false,
                deep: true
            }
        },
        created() {
            this.init();
            this.getCourseCategoryTree();
            this.getList();
            this.listAllEnable();
        },
        methods: {
            ...mapActions(['setCacheView', 'clearCacheView']),
            init() {
                const years = [];
                for (let i = this.year - 5; i <= this.year; i++) {
                    years.unshift(i);
                }
                this.yearList = years;
            },
            checkPermission,
            getCourseCategoryTree() {
                getCategory().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [
                            {
                                id: '',
                                name: '全部',
                                isRoot: true,
                                child: result.data.child
                            }
                        ];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取课程类别出错'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.positionCategory = data;
                this.categorySelected.categoryIdSelected = data.id;
                this.categorySelected.categoryNameSelected = data.name;
                this.getList({
                    pageNum: 1
                });
            },
            search() {
                this.getList({
                    pageNum: 1
                });
            },
            // 包含子类修改
            includeChildChange(includeChildCategory) {
                this.listQuery.includeChildCategory = includeChildCategory;
                this.listQuery.pageNum = 1;

                this.getList();
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                params.statusList = params.statusList.length
                    ? params.statusList.join(',')
                    : null;
                params.standardList = params.standardList.length
                    ? params.standardList.join(',')
                    : null;
                params.publishDateLeft =
                    null !== this.publishDateTime && this.publishDateTime.length
                        ? this.publishDateTime[0]
                        : null;
                params.publishDateRight =
                    null !== this.publishDateTime && this.publishDateTime.length
                        ? this.publishDateTime[1]
                        : null;
                params.source = 'INNER';

                // 处理行业数据、职业数据、层级、学科数据
                params.subjectCode = transformCommonToCode([[...this.subject]]);
                params.tradeCode = transformCommonToCode([[...this.trade]]);
                params.professionCode = transformCommonToCode([[...this.profession]]);
                params.level = params.tier;

                /* 添加标签查询 */
                if (Array.isArray(this.tag) && this.tag.length) {
                    const [groupId = '', itemId = ''] = this.tag;
                    if (groupId === itemId) {
                        params.tag = `labelGroup_${itemId}`;
                    } else {
                        params.tag = itemId;
                    }
                }

                this.listLoading = true;
                getList(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            listAllEnable() {
                listAllEnable().then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.syncOptions = result.data;
                    }
                });
            },
            selectionChange(v) {
                this.selectedData = v;
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
            handleCheckChange() {
                this.getList({
                    pageNum: 1
                });
            },
            del(data) {
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    deleteCourse(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            batchDel() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('此操作将永久删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    deleteCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '删除成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '删除失败'));
                        }
                    });
                });
            },
            batchEnable() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认启用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'info'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    enableCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('启用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '启用失败'));
                        }
                    });
                });
            },
            batchDisable() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认停用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    disableCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            display(data) {
                this.$confirm(this.$t('此操作将显示该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    displayCourse(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '显示成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '显示失败'));
                        }
                    });
                });
            },
            batchDisplay() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认显示勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    displayCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('显示成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '显示失败'));
                        }
                    });
                });
            },
            unDisplay(data) {
                this.$confirm(this.$t('此操作将隐藏该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    unDisplayCourse(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t(result.msg || '隐藏成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '隐藏失败'));
                        }
                    });
                });
            },
            batchUnDisplay() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.$confirm(this.$t('确认隐藏勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }

                    unDisplayCourse(selectedIds).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('隐藏成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '隐藏失败'));
                        }
                    });
                });
            },
            batchChangeCategory() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                this.categoryDialogVisible = true;
            },
            start(data) {
                const params = [];
                params.push(data.id);
                enableCourse(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.getList();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            disable(data) {
                this.$confirm(this.$t('确认停用勾选的数据吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const params = [];
                    params.push(data.id);
                    disableCourse(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('停用成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '停用失败'));
                        }
                    });
                });
            },
            add(query) {
                this.clearCacheView();
                this.setCacheView('courseEdit');
                this.$router.push({name: `courseEdit`, query});
            },
            edit(data) {
                this.add({id: data.id});
            },
            authEdit(course) {
                this.funId = course.id;
                this.authDialogVisible = true;
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
            },
            clearCategory() {
                this.listQuery.categoryId = '';
                this.listQuery.categoryName = '';
                this.getList({
                    pageNum: 1
                });
            },
            categorySelect() {
                const selectedData = this.selectedData;
                if (!selectedData || selectedData.length === 0) {
                    this.$warnMsg(this.$t('请选择需要操作的数据'));
                    return;
                }
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.courseCondition.categoryId = result.id;
                this.categoryDialogVisible = false;
                this.$confirm(this.$t('确认修改类别吗, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const selectedIds = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedIds.push(selectedData[i].id);
                    }
                    this.courseCondition.courseIds = selectedIds;
                    batchChangeCategory(this.courseCondition).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('修改成功成功'));
                            this.getList();
                        } else {
                            this.$errorMsg(this.$t(result.msg || '隐藏失败'));
                        }
                    });
                });
            },
            categoryDlgClose() {
                this.categoryDialogVisible = false;
            },
            viewDetail(id) {
                this.$router.push({
                    name: 'courseDetail',
                    query: {
                        id
                    }
                });
            },
            statistics(id) {
                debugger;
                this.$router.push({
                    name: 'courseStatistics',
                    query: {
                        id: id
                    }
                });
            },

            courseSync(row) {
                const {id = '', name = '', syncCourseId = '', syncHnCourseId = '', syncGpCourseId = ''} = row;
                let msg = '';
                let syncFlag = false;

                if (this.syncCode === 'JX' && !!syncCourseId) {
                    syncFlag = !!syncCourseId;
                    msg = '课程已同步至中控平台-江西站点，是否覆盖？';
                } else if (this.syncCode === 'HN' && !!syncHnCourseId) {
                    syncFlag = !!syncHnCourseId;
                    msg = '课程已同步至中控平台-湖南站点，是否覆盖？';
                } else if (this.syncCode === 'GP' && !!syncGpCourseId) {
                    syncFlag = !!syncGpCourseId;
                    msg = '课程已同步至中控平台-国培站点，是否覆盖？';
                }
                if (syncFlag) {
                    this.$confirm(`"${name}"` + msg, {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'success'
                    }).then(() => {
                        this.syncDialogCourseId = id;
                        this.syncDialogTitle = name;
                        this.innerVisible = true;
                    });
                } else {
                    this.syncDialogCourseId = id;
                    this.syncDialogTitle = name;
                    this.innerVisible = true;
                }
            },
            courseHNSync(row) {
                const {id = '', name = '', syncHnCourseId = ''} = row;
                const params = {courseId: id};
                if (this.$t(syncHnCourseId)) {
                    this.$confirm(`"${name}"课程已同步至湖南平台，是否覆盖？`, {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'success'
                    }).then(() => {
                        // this.syncDialogCourseId = id;
                        // this.syncDialogTitle = name;
                        // this.innerVisible = true;
                        this.courseHnCourse(params);
                    });
                } else {
                    this.$confirm(`是否同步"${name}"课程至湖南平台？`, {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'success'
                    }).then(() => {
                        // this.syncDialogCourseId = id;
                        // this.syncDialogTitle = name;
                        // this.innerVisible = true;
                        this.courseHnCourse(params);
                    });
                }
            },
            async courseHnCourse(params) {
                const {data: {success}} = await syncHnCourse(params);
                if (success) {
                    this.$message.success('同步成功');
                    this.search();
                } else {
                    this.$message.success('同步失败');
                }
            },
            syncDialogConfirm() {
                const params = {
                    // courseId: this.syncDialogCourseId,
                    // cateId: this.syncTypeOptionsValue,
                    // projectId: this.syncTypeWorkOptionsValue,
                    // gradeId: this.syncTypeGradeOptionsValue
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
            syncSelectDialogConfirm() {
                if (!this.syncCode) {
                    this.$message.error('请选择推送站点');
                    return;
                }
                this.courseSync(this.courseSelectSync);
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
            courseCopy(id) {
                copyCourse(id).then(res => {
                    const {data: {success = false, msg = '错误'}} = res;
                    if (success) {
                        this.$message.success('复制成功');
                        this.search();
                    } else {
                        this.$message.error(msg);
                    }
                });
            },
            async exportAllCourse() {
                const token = getToken();
                const callback = await exportAllCourse();
                const {data: {data: {id = ''} = {}} = {}} = callback;
                if (!id) {
                    return;
                }
                const url = `${process.env.STU_API}/export/downloadExport/${id}?_token=${token}`;
                window.open(url);
            },
            publishDateTimeChange() {
                this.getList();
            }
        }
    };
</script>
