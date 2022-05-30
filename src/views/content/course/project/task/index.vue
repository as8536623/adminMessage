<style scoped lang="scss">
    @import 'style.scss';
</style>
<style lang="scss">
    @import 'origin.scss';
</style>

<template>
    <div class="project__task aside__padding">
        <veln-form-section class="task__sec" :title="$t('学习任务')" :can-expand="false">
            <section class="task__container">
                <div class="aside__content">
                    <el-form ref="editQuery" :model="editQuery" label-width="100px">
                        <div class="project__type">
                            <el-form-item :label="$t('项目类型') + '：'">
                                <el-radio
                                    v-for="(item, index) in PROJECT_TYPE_ENUM.arr"
                                    :key="index"
                                    v-model="editQuery.type"
                                    disabled
                                    :label="item.code"
                                >
                                    <span>{{ item.name }}</span>
                                </el-radio>
                            </el-form-item>
                            <el-form-item class="none__label__fi datetime">
                                <el-date-picker
                                    v-model="datetimeArr"
                                    class="datetime__range__picker"
                                    :disabled="readOnly || editQuery.type !== 'TIME_LIMIT'"
                                    type="datetimerange"
                                    format="yyyy-MM-dd HH:mm"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    @change="timeRangeChange"
                                />
                            </el-form-item>
                        </div>
                        <div class="task__info">
                            <div class="task__info__item">
                                <span class="task__info__name">{{ $t('任务总数') }}</span>
                                <span class="task__info__num">{{ editQuery.taskTotal }}</span>
                            </div>
                            <el-button v-if="!readOnly" class="add__stage" type="text" @click="addStage(-1)">{{
                                $t('添加阶段') }}
                            </el-button>
                        </div>
                        <task-stage
                            v-for="(stage, index) in editQuery.stageList"
                            :key="index"
                            :stage="stage"
                            :index="index"
                            :read-only="readOnly"
                            @add="addStage"
                            @edit="handleStageEdit"
                            @delete="deleteStage"
                            @refresh="refreshTaskTotal"
                        />
                        <div v-if="!editQuery.stageList.length" class="task--empty">-- {{ $t('暂无数据') }} --</div>
                        <div v-if="!readOnly" class="text--center btn__line">
                            <el-button @click="cancel">{{ $t('关闭') }}</el-button>
                            <el-button type="primary" @click="save">{{ $t('保存') }}</el-button>
                        </div>
                    </el-form>
                </div>
            </section>
        </veln-form-section>
        <el-dialog
            v-if="dialogVisible"
            append-to-body
            :title="$t('学习阶段')"
            :visible.sync="dialogVisible"
            width="540px"
            :before-close="handleDialogClose"
        >
            <el-form ref="editQuery" :model="stageQuery" :rules="stageRules" label-width="100px">
                <section class="dialog__form__container">
                    <el-form-item :label="$t('阶段名称') + '：'" prop="name">
                        <el-input
                            v-model="stageQuery.name"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于10')"
                            maxlength="10"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item class="required" :label="$t('完成时间') + '：'" prop="startAt">
                        <el-date-picker
                            v-model="stageDatetimeArr"
                            class="datetime__range__picker"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="handleStageTimeChange"
                        />
                    </el-form-item>
                </section>
                <div class="dialog__btn__line">
                    <el-button @click="resetStageQuery">取消</el-button>
                    <el-button type="primary" @click="saveStage">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import TaskStage from './components/TaskStage';
    import {info} from '@/api/course/project/project';
    import {getTaskManageInfo, insertAllStageTask} from '@/api/course/project/stage';
    import {deepClone} from '@/utils';
    import {STAGE_TEMP} from './temp';
    import {PROJECT_TYPE_ENUM} from '@/enum';
    import moment from 'moment';

    export default {
        name: 'ProjectTask',
        components: {
            VelnFormSection,
            TaskStage
        },
        props: {
            readOnly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            // 校验阶段 新增/编辑 时间
            const validateStageTime = (rule, value, callback) => {
                const {startAt, endAt} = this.stageQuery;
                if (!startAt || !endAt) {
                    callback(new Error(this.$t('请选择任务阶段的时间范围！')));
                    return;
                }
                const now = moment().valueOf();
                const startUnix = moment(startAt).valueOf();
                const endUnix = moment(endAt).valueOf();
                if (startUnix <= now) {
                    callback(new Error(this.$t('阶段开始时间不能早于当前时间！')));
                    return;
                }
                if (startUnix >= endUnix) {
                    callback(new Error(this.$t('阶段开始时间不能晚于阶段结束时间！')));
                    return;
                }
                callback();
            };
            return {
                PROJECT_TYPE_ENUM,
                editQuery: {
                    id: this.$route.query.id,
                    startAt: '',
                    endAt: '',
                    type: 'TIME_LIMIT', // 学习项目类型
                    taskTotal: 0, // 任务总数
                    scoreTotal: 0, // 学分总数
                    timeTotal: 0, // 学时总数
                    stageList: [] // 阶段信息
                },
                stageQuery: {
                    name: '',
                    startAt: '',
                    endAt: ''
                }, // 新增、编辑阶段字段
                stageRules: {
                    name: [{required: true, message: this.$t('请输入阶段名称'), trigger: 'blur'}],
                    startAt: [{validator: validateStageTime, trigger: 'blur'}]
                },
                stageDatetimeArr: [], // 阶段时间
                datetimeArr: [], // 项目时间
                stageIndex: -1, // 新增 | 编辑 阶段
                insertIndex: -1, // 插入阶段 下标
                dialogVisible: false // 阶段弹框
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.editQuery.id = this.$route.query.id;
                this.info(this.editQuery.id);

                // 重置已选课程IDs
                this.$store.commit('SET_SELECTED_IDS', []);
            }
        },
        methods: {
            getTaskManageInfo() {
                const params = {
                    proId: this.editQuery.id
                };
                getTaskManageInfo(params).then(res => {
                    const {success, data, message} = res.data;
                    if (!success) {
                        this.$errorMsg(message || this.$t('获取任务管理数据出错'));
                        return;
                    }
                    this.editQuery = Object.assign({}, this.editQuery, data);
                    this.datetimeArr = [this.editQuery.startAt, this.editQuery.endAt];
                    this.refreshTaskTotal();
                });
            },
            // 获取基本信息
            info(id) {
                info(id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery.type = result.data.type;
                        this.getTaskManageInfo();
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 时间段变化 赋值给 editQuery
            timeRangeChange(v) {
                this.editQuery.startAt = moment(v[0]).format('YYYY-MM-DD HH:mm:ss');
                this.editQuery.endAt = moment(v[1]).format('YYYY-MM-DD HH:mm:ss');
            },
            // 时间段变化 赋值给 stageQuery
            handleStageTimeChange(v) {
                this.stageQuery.startAt = moment(v[0]).format('YYYY-MM-DD HH:mm:ss');
                this.stageQuery.endAt = moment(v[1]).format('YYYY-MM-DD HH:mm:ss');
            },
            // 新增阶段
            saveStage() {
                this.$refs.editQuery.validate(valid => {
                    if (!valid) {
                        return;
                    }
                    const {name, startAt, endAt} = this.stageQuery;
                    if (this.stageIndex > -1) {
                        // 编辑阶段
                        const stage = this.editQuery.stageList[this.stageIndex];
                        stage.name = name;
                        stage.startAt = startAt;
                        stage.endAt = endAt;
                        this.editQuery.stageList[this.stageIndex] = stage;
                        this.dialogVisible = false;
                        return;
                    }

                    const temp = deepClone(STAGE_TEMP);
                    temp.name = name;
                    temp.startAt = startAt;
                    temp.endAt = endAt;
                    if (this.insertIndex > -1) {
                        // 插入阶段
                        this.editQuery.stageList.splice(this.insertIndex + 1, 0, temp);
                    } else {
                        // 新增阶段
                        this.editQuery.stageList.push(temp);
                    }
                    this.resetStageQuery();
                });
            },
            // 新增阶段弹框
            addStage(index) {
                if (index > -1) {
                    this.insertIndex = index;
                }
                this.stageQuery = {
                    name: '',
                    startAt: '',
                    endAt: ''
                };
                this.stageIndex = -1;
                this.dialogVisible = true;
            },
            // 重置添加阶段弹框
            resetStageQuery() {
                this.insertIndex = -1;
                this.stageIndex = -1;
                this.stageDatetimeArr = [];
                this.stageQuery = {
                    name: '',
                    startAt: '',
                    endAt: ''
                };
                this.dialogVisible = false;
            },
            // 编辑新增弹框
            handleStageEdit(index) {
                if (!(!isNaN(index) && index > -1)) {
                    this.$errorMsg('阶段选择出错，请重试');
                    return;
                }
                const stage = this.editQuery.stageList[index];
                this.stageIndex = index;
                const {startAt, endAt} = stage;
                this.stageDatetimeArr = [
                    moment(startAt).format('YYYY-MM-DD HH:mm'),
                    moment(endAt).format('YYYY-MM-DD HH:mm')
                ];
                this.stageQuery = stage;
                this.dialogVisible = true;
            },
            cancel() {
                history.back();
            },
            save() {
                console.log('sava', this.editQuery);
                insertAllStageTask(this.editQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('保存成功'));
                        this.$router.push({
                            name: 'projectList',
                            query: {
                                id: this.editQuery.id
                            }
                        });
                        // this.cancel();
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },
            deleteStage(index) {
                if (!(!isNaN(index) && index > -1)) {
                    this.$errorMsg('阶段选择出错，请重试');
                    return;
                }
                this.editQuery.stageList.splice(index, 1);
                this.refreshTaskTotal();
            },
            refreshTaskTotal() {
                if (this.editQuery && this.editQuery.stageList) {
                    let totalTaskCnt = 0;
                    const selectedCourseIds = [];
                    this.editQuery.stageList.forEach(stage => {
                        if (stage && stage.stageTaskList) {
                            totalTaskCnt += stage.stageTaskList.length;
                            stage.stageTaskList.forEach(task => {
                                if (task.relType === 'OPTIONAL_ONLINE_COURSE' ||
                                    task.relType === 'REQUIRE_ONLINE_COURSE' ||
                                    task.relType === 'OPTIONAL_FACE_COURSE' ||
                                    task.relType === 'REQUIRE_FACE_COURSE') {
                                    selectedCourseIds.push(task.relId);
                                }
                            });
                        }
                    });
                    this.editQuery.taskTotal = totalTaskCnt;
                    this.$store.commit('SET_SELECTED_IDS', selectedCourseIds);
                }
                console.log('this.editquery', this.editQuery);
            },
            handleDialogClose(done) {
                this.resetStageQuery();
                done();
            }
        }
    };
</script>
