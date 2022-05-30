<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="container__padding news__list">
        <section class="opt__line">
            <div class="enterpriseNameOption">
                <el-form
                    :model="chargingListQuery"
                    :inline="true"
                    label-width="90px"
                    class="demo-form-inline"
                >
                    <el-form-item :label="$t('企业名称') + '：'">
                        <el-select
                            v-model="chargingListQuery.customerId"
                            class="course__type__select"
                            size="mini"
                            placeholder="请选择"
                            @change="handleCheckChange"
                        >
                            <el-option
                                v-for="item in customerList"
                                :key="item.customerId"
                                :label="item.customerName"
                                :value="item.customerId"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="primary" @click="batchEdit">{{ $t('批量修改收费标准') }}</el-button>
            <search-input
                v-model="chargingListQuery.keywords"
                class="pull-right"
                width="320px"
                :placeholder="$t('请输入课程/企业名称')"
                @enter="search"
                @input="getKeywords"
            />
        </section>
        <qgu-table
            :columns="tableColumns"
            :data="chargingList"
            :page="chargingListQuery"
            :total="chargingTotal"
            :loading="listLoading"
            @selection-change="selectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <veln-dialog
            :select-course-show="selectCourseShow"
            :select-course-num="selectCourseNum"
            :dialog-title="$t(dialogTitle)"
            :charge-level="chargeLevel"
            :precision="precision"
            :dialog-visible="dialogVisible"
            @cancel="handleCancelChargeLevel"
            @sure="handleSureChargeLevel"
            @change="handleChargeLevel"
        />
    </article>
</template>

<script>
    import {getEnterpriseSelectList} from '@/api/common/enterpriseSelect';
    import {getChargingStandardList, setChargingStandard} from '@/api/charging';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import checkPermission from '@/utils/permission';
    import VelnDialog from '@/components/VelnDialog';
    export default {
        name: 'ChargingList',
        components: {
            VelnDialog
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox',
                    disabled: () => {
                        return !(
                            this.checkPermission('uploadResource') ||
                            this.checkPermission('resourceDetail') ||
                            this.checkPermission('deleteResource') ||
                            this.checkPermission('editResource')
                        );
                    }
                },
                {
                    field: 'customerName',
                    text: this.$t('企业名称'),
                    minWidth: 90,
                    align: 'center'
                },
                {
                    field: 'courseName',
                    text: this.$t('课程名称'),
                    minWidth: 140,
                    align: 'center'
                },
                {
                    field: 'itemName',
                    text: this.$t('章/节'),
                    minWidth: 140,
                    align: 'center'
                },
                {
                    field: 'srcSize',
                    text: this.$t('视频时长'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'courseHour',
                    text: this.$t('课时'),
                    minWidth: 80,
                    align: 'center'
                },
                {
                    field: 'chargeLevel',
                    text: this.$t('收费标准(元/课时)'),
                    minWidth: 60,
                    align: 'center'
                },
                {
                    field: 'opt',
                    text: this.$t('操作'),
                    fixed: 'right',
                    minWidth: 20,
                    align: 'center',
                    render: (h, param) => {
                        const optArr = [];
                        const setChargingBtn = h('QguButton', {
                            props: {
                                toolTip: this.$t('收费标准'),
                                type: 'text',
                                icon: 'chargingStandard'
                            },
                            on: {
                                click: () => {
                                    this.chargingStandard(param.row);
                                }
                            }
                        });
                        optArr.push(setChargingBtn);
                        return h('div', optArr, '');
                    }
                }
            ];
            return {
                COMMON_STATUS_ENUM,
                tableColumns,
                multiSelection: [],
                listLoading: false,
                customerList: [], // 企业列表
                chargingList: [], // 收费标准列表
                chargingListQuery: { // 收费标准查询参数
                    customerId: '', // 企业ID
                    pageNum: 1,
                    pageSize: 20,
                    keywords: ''
                },
                chargingTotal: 0,
                userId: '',
                dialogVisible: false,
                chargeLevel: 0,
                precision: 2,
                dialogTitle: '',
                settingList: [],
                selectCourseNum: 0,
                selectCourseShow: false,
                singleSelection: []
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            checkPermission,
            getList(condition) {
                this.listLoading = true;
                this.userId = this.$store.getters.userId;
                const userId = this.userId;
                getEnterpriseSelectList({userId}).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.customerList = result.data || [];
                        this.chargingListQuery.customerId = result.data[0].customerId;
                        this.listLoading = false;
                        this.getChargingStandard();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            getChargingStandard() {
                const data = Object.assign({}, this.chargingListQuery);
                getChargingStandardList(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.chargingList = result.data.list || [];
                        this.chargingListQuery.pageNumber = result.data.pageNum;
                        this.chargingListQuery.pageSize = result.data.pageSize;
                        this.chargingTotal = result.data.total;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            selectionChange(v) {
                this.multiSelection = v;
            },
            search() {
                this.getList({pageNum: 1});
            },
            getKeywords(value) {
                this.chargingListQuery.keywords = value;
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            chargingStandard(row) {
                this.singleSelection = [];
                this.selectCourseShow = false;
                this.dialogTitle = '修改收费标准';
                this.dialogVisible = true;
                this.singleSelection.push(row);
            },
            handleCheckChange() {
                this.getChargingStandard();
            },
            batchEdit() {
                if (!this.multiSelection.length) {
                    this.$warnMsg(this.$t('请选择修改企业'));
                    return;
                }
                this.selectCourseShow = true;
                this.selectCourseNum = this.multiSelection.length;
                this.dialogTitle = '批量修改收费标准';
                this.dialogVisible = true;
            },
            handleSureChargeLevel(value, distinguishBatch) {
                this.dialogVisible = value;
                const data = {};
                data.chargeLevel = this.chargeLevel;
                data.customerId = this.chargingListQuery.customerId;
                const settingList = [];
                const multiSelectionList = distinguishBatch ? this.multiSelection : this.singleSelection;
                multiSelectionList.map(item => {
                    const itemData = {
                        id: item.settingId || '',
                        courseId: item.courseId,
                        itemId: item.itemId,
                        srcSize: item.srcSize
                    };
                    settingList.push(itemData);
                });
                data.settingList = settingList;
                setChargingStandard(data).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.chargeLevel = 0;
                        this.multiSelection = [];
                        this.$successMsg(this.$t(result.msg || '批量修改成功'));
                        this.getList({pageNum: 1});
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            handleCancelChargeLevel(value) {
                this.dialogVisible = value;
            },
            handleChargeLevel(value) {
                this.chargeLevel = value;
            }
        }
    };
</script>
