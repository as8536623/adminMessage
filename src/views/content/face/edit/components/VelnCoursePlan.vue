<style lang="scss" scoped>
    @import './style';

    .veln__map__content {
        margin-top: 16px;
        width: 600px;
        height: 300px;
    }

    .veln__map {
        width: 100%;
        height: 100%;
    }
</style>
<template>
    <article class="veln__course__plan">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
            class="veln__plan-form"
        >
            <el-form-item :label="$t('内容名称') + '：'" prop="name" :rules="rules.required">
                <el-input v-model.trim="editQuery.name" :placeholder="$t('请输入名称')"/>
            </el-form-item>
            <el-form-item :label="$t('开始时间') + '：'" prop="startTime">
                <veln-datetime
                    v-model="editQuery.startTime"
                    :min-datetime="getNow()"
                    @input="startInput"
                />
            </el-form-item>
            <el-form-item :label="$t('结束时间') + '：'" prop="endTime">
                <veln-datetime
                    v-model="editQuery.endTime"
                    :min-datetime="getNow()"
                    @input="endInput"
                />
            </el-form-item>
            <el-form-item :label="$t('授课地点') + '：'">
                <el-input v-model.trim="editQuery.teachingLocations" :placeholder="$t('请输入授课地点')"/>
                <!--<el-autocomplete-->
                <!--v-model.trim="editQuery.teachingLocations"-->
                <!--:fetch-suggestions="querySearchAsync"-->
                <!--:placeholder="$t('请输入名称')"-->
                <!--@select="handleSelect"-->
                <!--&gt;</el-autocomplete>-->
                <!--<div class="veln__map__content">-->
                <!--<div :id="'velnMap'+index" class="veln__map"></div>-->
                <!--</div>-->
            </el-form-item>
            <el-form-item :label="$t('讲师') + '：'">
                <el-select v-model="editQuery.lecturer" filterable :placeholder="$t('请选择讲师')">
                    <el-option
                        v-for="item in teacherList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('讲义') + '：'" class="upload__form__item" prop="lectureList">
                <div class="course__paragraph__upload">
                    <div
                        v-if="!editQuery.lectureList || editQuery.lectureList.length === 0"
                        class="course__paragraph--empty"
                        @click="showFileDialog"
                    >
                        <svg-icon icon-class="fold_o" class-name="course__paragraph--empty__icon"/>
                        <div class="course__paragraph--empty__text">{{ $t('选择关联文件') }}</div>
                    </div>
                    <div
                        v-for="(item, idx) in editQuery.lectureList"
                        v-else
                        :key="idx"
                        class="course__paragraph__file"
                        @click="showFileDialog"
                    >
                        <div class="course__file__icon" :data-type="item.srcType"/>
                        <div class="course__file__info">
                            <div class="course__file__name">{{ $t(item.srcName) }}</div>
                            <div class="course__file__bottom">
                                <span class="course__file__length">{{ transformSize(item) }}</span>
                                <el-button
                                    class="course__file__del pull-right"
                                    type="text"
                                    @click.stop="deleteFile(idx)"
                                >{{ $t('删除') }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-tooltip
                v-if="index > 0"
                class="veln__del__btn"
                effect="dark"
                :content="$t('删除本节')"
                placement="top"
            >
                <el-button type="text" size="mini" @click="del">
                    <svg-icon class-name="tree__icon" icon-class="del"/>
                </el-button>
            </el-tooltip>
        </el-form>
        <el-dialog
            v-if="fileDialogVisible"
            :key="dialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
        >
            <veln-file-select
                app-code="veln-face"
                fun-code="FACE"
                :multi-select="false"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFileSelect from '@/components/VelnFileSelect';
    import {transformSecondToMS} from '@/utils/time';
    import {calFileSize, debounce} from '@/utils';
    import {listAll} from '@/api/teacher';
    import moment from 'moment';

    export default {
        name: 'VelnCoursePlan',
        components: {
            VelnFileSelect
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        name: '',
                        startTime: '',
                        endTime: '',
                        teachingLocations: '',
                        longitude: '',
                        latitude: '',
                        lecturer: '',
                        lectureList: []
                    };
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data() {
            // let validateLecture = (rule, value, callback) => {
            //     if (!this.editQuery.lectureList.length) {
            //         return callback(new Error('请关联讲义'));
            //     } else {
            //         callback();
            //     }
            // };
            const validatorStartTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.endTime &&
                    value >= this.editQuery.endTime
                ) {
                    callback(new Error(this.$t('开始时间不能小于结束时间')));
                } else {
                    callback();
                }
            };
            const validatorEndTime = (rule, value, callback) => {
                if (
                    value &&
                    this.editQuery.startTime &&
                    value <= this.editQuery.startTime
                ) {
                    callback(new Error(this.$t('结束时间不能小于开始时间')));
                } else {
                    callback();
                }
            };
            return {
                editQuery: this.data,
                addressList: [],
                map: '',
                teacherList: [],
                fileDialogVisible: false,
                typeArr: ['DOC'],
                // typeArr: ['VIDEO', 'AUDIO', 'DOC', 'IMAGE'],
                dialogKey: null,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    // lectureList: [
                    //     { validator: validateLecture, trigger: 'change' }
                    // ],
                    startTime: [
                        {
                            required: true,
                            message: this.$t('请选择开始时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorStartTime,
                            trigger: 'change'
                        }
                    ],
                    endTime: [
                        {
                            required: true,
                            message: this.$t('请选择结束时间'),
                            trigger: 'change'
                        },
                        {
                            validator: validatorEndTime,
                            trigger: 'change'
                        }
                    ]
                }
            };
        },
        created() {
            this.listAll();
        },
        mounted() {
            // this.$nextTick(() => {
            //     this.init();
            // });
        },
        destroyed() {
            this.map && this.map.destroy();
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },
            init() {
                const id = 'velnMap' + this.index;
                // 初始化地图
                this.map = new window.AMap.Map(id, {
                    resizeEnable: true, // 是否监控地图容器尺寸变化
                    zoom: 11 // 初始地图级别
                });
                if (this.data.latitude && this.data.longitude) {
                    let marker = {};
                    marker = new window.AMap.Marker({
                        position: [this.data.longitude, this.data.latitude], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        title: this.data.teachingLocations
                    });
                    this.map.add(marker);
                    this.map.setFitView();
                }
            },
            // 地址搜索
            querySearchAsync(queryString, cb) {
                debounce(this.searchHandle(queryString, cb), 300, true);
            },
            searchHandle(queryString, cb) {
                const that = this;
                window.AMap.plugin('AMap.Autocomplete', () => {
                    // 实例化Autocomplete
                    const autoOptions = {
                        city: queryString
                    };
                    const autoComplete = new window.AMap.Autocomplete(autoOptions);
                    autoComplete.search(queryString, (status, result) => {
                        if (status === 'complete') {
                            that.addressList = result.tips;
                            const list = [];
                            that.addressList.map(item => {
                                const data = {
                                    value: item.name,
                                    address: item.name,
                                    location: item.location
                                };
                                list.push(data);
                            });
                            cb(list);
                        }
                    });
                });
            },
            // 选择地址
            handleSelect(item) {
                let marker = {};
                marker = new window.AMap.Marker({
                    position: item.location, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: item.value
                });
                this.editQuery.longitude = item.location.lng;
                this.editQuery.latitude = item.location.lat;
                this.map.add(marker);
                this.map.setFitView();
            },
            listAll() {
                listAll().then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.teacherList = result.data;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 删除
            del() {
                this.$emit('del', this.index);
            },
            // 表单验证
            formValidate() {
                let result = false;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        result = true;
                    }
                });
                return result;
            },
            // 选择文件确认
            onSure(files) {
                const file = files[0];
                const data = {
                    srcId: file.fileId,
                    srcName: file.name,
                    srcSize: file.qgFileDetail.length
                        ? file.qgFileDetail.length
                        : file.qgFileDetail.fileSize,
                    srcType: file.iconType
                };
                this.editQuery.lectureList.push(data);
                this.$refs.editQuery.validateField('lectureList');
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            // 文件上传
            showFileDialog() {
                if (!this.editQuery.lectureList) {
                    this.editQuery.lectureList = [];
                }
                if (this.editQuery.lectureList && this.editQuery.lectureList.length === 1) {
                    this.$warnMsg(this.$t('最多添加一个！'));
                    return;
                }
                this.fileDialogVisible = true;
            },
            // 文件删除
            deleteFile(index) {
                this.editQuery.lectureList.splice(index, 1);
                this.$forceUpdate();
            },
            transformSize(section) {
                // 如果是音频/视频，length是时长，其他是页数
                if (section.srcType === 'audio' || section.srcType === 'video') {
                    return transformSecondToMS(section.srcSize);
                } else if (section.srcType === 'image') {
                    return calFileSize(section.srcSize);
                } else {
                    return `${section.srcSize || 0}页`;
                }
            },
            startInput(val) {
                this.editQuery.startTime = val
                    ? moment(val).format('YYYY-MM-DD HH:mm')
                    : '';
            },
            endInput(val) {
                this.editQuery.endTime = val
                    ? moment(val).format('YYYY-MM-DD HH:mm')
                    : '';
            }
        }
    };
</script>
