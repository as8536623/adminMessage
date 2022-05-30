<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container course__edit">
        <el-form
            ref="editQuery"
            v-loading="loading"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('基本信息')" :can-expand="false">
                <el-form-item :label="$t('课程编号') + '：'" prop="code">
                    <el-input
                        v-model.trim="editQuery.code"
                        :placeholder="$t('课程编号')"
                        :max-length="50"
                        :disabled="!!editQuery.code"
                    />
                </el-form-item>
                <el-form-item :label="$t('课程类别') + '：'" prop="categoryId">
                    <el-input
                        ref="categoryInput"
                        v-model.trim="editQuery.categoryName"
                        :placeholder="$t('请选择课程类别')"
                        :max-length="32"
                        clearable
                        @clear="clearCategory"
                        @focus="showCategorySelect"
                    />
                </el-form-item>
                <el-form-item :label="$t('课程名称') + '：'" prop="name">
                    <el-input
                        v-model.trim="editQuery.name"
                        class="input--long input__limit"
                        type="text"
                        :placeholder="$t('课程名称')"
                        maxlength="50"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item v-show="false" :label="$t('课时') + '：'" prop="period">
                    <el-input-number
                        v-model="editQuery.period"
                        :precision="1"
                        :step="1"
                        :min="0"
                        :max="100"
                        :placeholder="$t('课时')"
                    />
                </el-form-item>
                <el-form-item :label="$t('所属学科') + '：'">
                    <subject-cascader
                        v-model="editQuery.subject"
                        :multiple="true"
                    />
                </el-form-item>
                <el-form-item :label="$t('适用行业') + '：'">
                    <industry-cascader
                        v-model="editQuery.trade"
                        :multiple="true"
                    />
                </el-form-item>
                <el-form-item :label="$t('适用职业') + '：'">
                    <job-cascader
                        v-model="editQuery.profession"
                        :multiple="true"
                    />
                </el-form-item>
                <el-form-item :label="$t('适用层级') + '：'">
                    <el-select
                        v-model="editQuery.tier"
                        class="multiple"
                        multiple
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
                <!--<el-form-item :label="$t('讲师') + '：'" prop="teacherIdList">
                    <el-tag
                        v-for="(tag, index) in teacherSelect"
                        :key="index"
                        class="course__teacher__tag"
                        closable
                        :disable-transitions="false"
                        @close="handleCloseTeacher(tag)"
                    >{{ tag.name || tag }}
                    </el-tag>
                    <el-button class="course__teacher__btn" @click="showTeacherDlg">{{ $t('选择') }}</el-button>
                </el-form-item>-->
                <el-form-item :label="$t('收费方式') + '：'" prop="buyType">
                    <el-radio-group v-model="editQuery.buyType">
                        <el-radio label="COUNT">{{ $t('按版权和流量收费') }}</el-radio>
                        <el-radio label="OTHER">{{ $t('按账号数收费') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="editQuery.buyType === 'COUNT'" :label="$t('版权费') + '：'" prop="copyrightPrice">
                    <el-input-number
                        v-model="editQuery.copyrightPrice"
                        :controls="false"
                        :precision="1"
                        :step="1"
                        :min="0"
                        :max="99999"
                        :placeholder="$t('版权费')"
                    />
                    <span class="el-form-item__tips">{{ $t('元') }}</span>
                </el-form-item>
                <el-form-item v-if="editQuery.buyType === 'COUNT'" :label="$t('流量费') + '：'" prop="flowPrice">
                    <el-input-number
                        v-model="editQuery.flowPrice"
                        :controls="false"
                        :precision="1"
                        :step="1"
                        :min="0"
                        :max="99999"
                        :placeholder="$t('流量费')"
                    />
                    <span class="el-form-item__tips">{{ $t('元/G') }}</span>
                </el-form-item>
                <el-form-item v-if="editQuery.buyType === 'OTHER'" :label="$t('账号费') + '：'" prop="countPrice">
                    <el-input-number
                        v-model="editQuery.countPrice"
                        :controls="false"
                        :precision="1"
                        :step="1"
                        :min="0"
                        :max="99999"
                        :placeholder="$t('版权费')"
                    />
                    <span class="el-form-item__tips">{{ $t('元/个') }}</span>
                </el-form-item>
                <!--                <el-form-item :label="$t('学分') + '：'" prop="score">-->
                <!--                    <el-input-number-->
                <!--                        v-model="editQuery.score"-->
                <!--                        :precision="1"-->
                <!--                        :step="1"-->
                <!--                        :min="0"-->
                <!--                        :max="100"-->
                <!--                        :placeholder="$t('学分')"-->
                <!--                    />-->
                <!--                </el-form-item>-->
                <el-form-item :label="$t('出版时间') + '：'" prop="publishDate">
                    <el-date-picker
                        v-model="editQuery.publishDate"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="出版时间"
                    />
                </el-form-item>
                <!--                <el-form-item :label="$t('价格') + '：'" prop="price">-->
                <!--                    <el-input-number-->
                <!--                        v-model="editQuery.price"-->
                <!--                        :precision="1"-->
                <!--                        :step="10"-->
                <!--                        :min="0"-->
                <!--                        :max="10000"-->
                <!--                        :placeholder="$t('价格')"-->
                <!--                    />-->
                <!--                </el-form-item>-->
                <!--                <el-form-item :label="$t('有效期') + '：'" prop="validity">-->
                <!--                    <el-input-number-->
                <!--                        v-model="editQuery.validity"-->
                <!--                        :precision="0"-->
                <!--                        :min="0"-->
                <!--                        :max="1000"-->
                <!--                        :placeholder="$t('有效期')"-->
                <!--                    />-->
                <!--                </el-form-item>-->
                <!--<el-form-item :label="$t('课程标签') + '：'" prop="tagList">-->
                <!--<veln-tags v-model="editQuery.tagList"></veln-tags>-->
                <!--</el-form-item>-->
                <!--                <veln-label-select-->
                <!--                    ref="labels"-->
                <!--                    label-type="COURSE"-->
                <!--                    :default-labels="editQuery.tagList"-->
                <!--                    :validator-flag="false"-->
                <!--                    :label-width="140"-->
                <!--                    label-name="课程标签"-->
                <!--                    disabled-->
                <!--                    close-enable-->
                <!--                />-->
                <el-form-item :label="$t('课程封面') + '：'" class="course__upload__line" prop="coverUrl">
                    <div class="course__upload__sec" @click="showFileSelect">
                        <img
                            v-if="editQuery.coverUrl"
                            class="course__cover"
                            :src="editQuery.coverUrl"
                            :alt="$t('封面')"
                        >
                        <svg-icon
                            v-if="!editQuery.coverUrl"
                            icon-class="plus"
                            class-name="course__upload__plus"
                        />
                    </div>
                    <span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>
                </el-form-item>
                <!--                <el-form-item :label="$t('课程附件') + '：'" class="course__upload__lecture">-->
                <!--                    <div class="course__paragraph__upload">-->
                <!--                        <div class="course__paragraph&#45;&#45;empty" @click="showLectureSelect">-->
                <!--                            <svg-icon-->
                <!--                                icon-class="fold_o"-->
                <!--                                class-name="course__paragraph&#45;&#45;empty__icon"-->
                <!--                            />-->
                <!--                            <div class="course__paragraph&#45;&#45;empty__text">{{ $t('选择关联文件') }}</div>-->
                <!--                        </div>-->
                <!--                        <section-->
                <!--                            v-for="(item, index) in editQuery.lectureList"-->
                <!--                            :key="index"-->
                <!--                            class="course__lecture__item"-->
                <!--                        >-->
                <!--                            <img-->
                <!--                                v-if="item.srcType === 'image'"-->
                <!--                                class="course__cover"-->
                <!--                                :src="item.viewUrl"-->
                <!--                                :alt="$t('课程附件')"-->
                <!--                            >-->
                <!--                            <div class="km__image__shadow">-->
                <!--                                <svg-icon-->
                <!--                                    icon-class="delete"-->
                <!--                                    class-name="km__image__delete"-->
                <!--                                    @click="deleteFile(index)"-->
                <!--                                />-->
                <!--                            </div>-->
                <!--                        </section>-->
                <!--                        <section>-->
                <!--                            <div-->
                <!--                                v-for="(item, index) in editQuery.lectureList"-->
                <!--                                :key="index+'_'"-->
                <!--                                class="course__lecture__item"-->
                <!--                                :class="{'active': item.srcType === 'image'}"-->
                <!--                            >-->
                <!--                                <div-->
                <!--                                    v-if="item.srcType !== 'image'"-->
                <!--                                    class="course__paragraph__file"-->
                <!--                                >-->
                <!--                                    <div class="course__file__icon" :data-type="item.srcType"/>-->
                <!--                                    <div class="course__file__info">-->
                <!--                                        <div class="course__file__name">{{ item.srcName }}</div>-->
                <!--                                        <div class="course__file__bottom">-->
                <!--                                            <span-->
                <!--                                                class="course__file__length"-->
                <!--                                                :data-size="item.size"-->
                <!--                                            >{{ item.size }}</span>-->
                <!--                                            <el-button-->
                <!--                                                class="course__file__del pull-right"-->
                <!--                                                type="text"-->
                <!--                                                @click.stop="deleteFile(index)"-->
                <!--                                            >{{ $t('删除') }}-->
                <!--                                            </el-button>-->
                <!--                                            <el-button-->
                <!--                                                v-if="item.convertStatus==='complete' || item.convertStatus === 'noNeed'"-->
                <!--                                                class="course__file__del pull-right"-->
                <!--                                                type="text"-->
                <!--                                                @click.stop="previewFile(index)"-->
                <!--                                            >{{ $t('预览') }}-->
                <!--                                            </el-button>-->
                <!--                                            <span-->
                <!--                                                v-else-->
                <!--                                                class="course__file__del pull-right"-->
                <!--                                                type="text"-->
                <!--                                                :disabled="true"-->
                <!--                                            >{{ $t('转换中...') }}</span>-->
                <!--                                        </div>-->
                <!--                                    </div>-->
                <!--                                </div>-->
                <!--                            </div>-->
                <!--                        </section>-->
                <!--                        <div class="course__lecture__tips">{{ $t('（仅支持Word、PPT、PDF、图片类型）') }}</div>-->
                <!--                    </div>-->
                <!--                </el-form-item>-->
                <el-form-item :label="$t('详情描述') + '：'" prop="description">
                    <qgu-editor v-model="editQuery.description" :width="editorWidth"/>
                </el-form-item>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('下一步') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="categoryDialogVisible"
            append-to-body
            :title="$t('选择课程类别')"
            :visible.sync="categoryDialogVisible"
            width="339px"
            @close="categoryDlgClose"
        >
            <veln-course-category-select ref="category" :default-expand-all="defaultExpandAll"/>
            <div class="dialog__btn__line">
                <router-link :to="{name: 'courseCategory'}">
                    <el-button type="primary" class="pull-left">{{ $t('新增') }}</el-button>
                </router-link>
                <el-button @click="categoryDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="categorySelect">确定</el-button>
            </div>
        </el-dialog>
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
        <el-dialog
            v-if="teacherDialogVisible"
            append-to-body
            :title="$t('选择讲师')"
            :visible.sync="teacherDialogVisible"
            width="700px"
            :before-close="handleTeacherClose"
        >
            <section class="dlg__content">
                <div class="teacher__search">
                    <el-button type="primary" class="pull-left" @click="navTeacherEdit">{{ $t('新增') }}</el-button>
                    <search-input
                        v-model="teacherQuery.name"
                        class="pull-right"
                        :placeholder="$t('讲师姓名')"
                        @enter="searchTeacher"
                    />
                </div>
                <qgu-table
                    ref="userTable"
                    :border="false"
                    :columns="tableColumns"
                    :data="teacherlist"
                    :page="teacherQuery"
                    :total="teacherTotal"
                    :loading="teacherListLoading"
                    @selection-change="teacherSelectionChange"
                    @size-change="handleTeacherSizeChange"
                    @current-change="handleTeacherCurrentChange"
                />
            </section>
            <div class="dialog__btn__line">
                <el-button @click="teacherDialogVisible=false">{{ $t('取消') }}</el-button>
                <el-button
                    v-if="checkPermission('addCourse') || checkPermission('updCourse')"
                    type="primary"
                    @click="onTeacherSure"
                >{{ $t('确定') }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-if="lectureDialogVisible"
            :key="lectureDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="lectureDialogVisible"
            width="890px"
            :before-close="handleLectureClose"
            @close="lectureDialogClose"
        >
            <veln-file-select
                app-code="veln-stu"
                fun-code="LECTURE"
                :multi-select="true"
                :type-arr="['IMAGE', 'DOC']"
                extensions="gif,jpg,jpeg,bmp,png,doc,docx,ppt,pptx,pdf"
                mime-types="image/*,.doc,.docx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
                @on-sure="lectureOnSure"
                @on-cancel="lectureOnCancel"
            />
        </el-dialog>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnCourseCategorySelect from '@/components/VelnCourseCategorySelect';
    import VelnFileSelect from '@/components/VelnFileSelect';
    // import VelnLabelSelect from '@/components/VelnLabelSelect';
    import QguEditor from '@/components/QguEditor';
    import {getCode, getCourse, insertCourse, updateCourse} from '@/api/course';
    import {getTeacherPage} from '@/api/teacher';
    import {getRootCourseCategoryId} from '@/utils/common';
    import checkPermission from '@/utils/permission';
    import {transformCommonToCode, transformCodesToSubject, transformCodesToTrade, transformCodesToProfession} from '@/utils/common';
    import moment from 'moment';
    import commonData from '@/mixins/commonData';
    import {TIER_ENUM} from '@/enum';
    import IndustryCascader from '@/components/Common/IndustryCascader';
    import JobCascader from '@/components/Common/JobCascader';
    import SubjectCascader from '@/components/Common/SubjectCascader';
    import {PublicImage} from '@/model/PublicImage';

    export default {
        name: 'CourseEdit',
        components: {
            VelnFileSelect,
            VelnFormSection,
            VelnCourseCategorySelect,
            QguEditor,
            // VelnLabelSelect,
            IndustryCascader,
            JobCascader,
            SubjectCascader
        },
        mixins: [commonData],

        beforeRouteEnter(to, from, next) {
            if (from.name === 'teacherEdit') {
                next(vm => {
                    vm.teacherDialogVisible = true;
                    vm.searchTeacher();
                });
            } else {
                next();
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'courseManage') {
                this.$destroy();
            }
            next();
        },
        data() {
            const tableColumns = [
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    text: this.$t('讲师姓名')
                },
                {
                    field: 'level',
                    minWidth: 100,
                    text: this.$t('讲师等级')
                },
                {
                    field: 'source',
                    minWidth: 100,
                    text: this.$t('讲师来源'),
                    render: (h, param) => {
                        return param.row.source === 'OUTER' ? '外部' : '内部';
                    }
                }
            ];
            return {
                TIER_ENUM,
                tableColumns,
                editQuery: {
                    id: this.$route.query.id, // id
                    name: '', // 课程名称
                    code: '', // 课程编号
                    tier: '', // 层级
                    level: '', // 层级 code
                    subject: '', // 所属学科
                    subjectCode: '', // 所属学科 code
                    trade: '', // 行业
                    tradeCode: '', // 行业 code
                    profession: '', // 职业
                    professionCode: '', // 职业 Code
                    categoryId: this.$route.query.categoryIdSelected, // 类别Id
                    categoryName: this.$route.query.categoryNameSelected, // 类别名称
                    period: 0, // 学时
                    score: 0, // 学分
                    publishDate: moment().format('YYYY-MM-DD'), // 发布时间
                    teacherIdList: [], // 讲师id列表
                    teacherNameList: [], // 讲师名称列表
                    tagList: [], // 标签列表
                    coverUrl: '', // 封面URL
                    coverId: '', // 封面Id
                    description: '', // 课程描述
                    price: 0, // 价格
                    buyType: 'OTHER', // 收费方式
                    copyrightPrice: '', // 版权费
                    flowPrice: '', // 流量费
                    countPrice: '', // 账号费
                    lectureIds: [], // 讲义
                    lectureList: [] // 讲义名称列表
                },
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.$t('请输入课程编号'),
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入课程名称'),
                            trigger: 'blur'
                        }
                    ],
                    categoryId: [
                        {
                            required: true,
                            message: this.$t('请选择课程类别'),
                            trigger: 'blur'
                        }
                    ],
                    period: [
                        {
                            required: true,
                            message: this.$t('请输入课时'),
                            trigger: 'blur'
                        }
                    ],
                    score: [
                        {
                            required: true,
                            message: this.$t('请输入学分'),
                            trigger: 'blur'
                        }
                    ],
                    coverUrl: [
                        {
                            required: true,
                            message: this.$t('请上传封面'),
                            trigger: 'blur'
                        }
                    ],
                    // publishDate: [
                    //     {
                    //         required: true,
                    //         message: this.$t('请选择出版时间'),
                    //         trigger: 'blur'
                    //     }
                    // ],
                    price: [
                        {
                            required: true,
                            message: this.$t('请输入价格'),
                            trigger: 'blur'
                        }
                    ]
                },
                categoryDialogVisible: false,
                defaultExpandAll: true,
                uploadURL: `${process.env.FS_API}/file/upload`,
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                teacherDialogVisible: false,
                teacherlist: [],
                teacherSelect: [],
                teacherQuery: {
                    name: '',
                    source: '',
                    pageNum: 1,
                    pageSize: 20
                },
                teacherTotal: 0,
                teacherListLoading: false,
                teacherMultiSelection: [],
                lectureDialogVisible: false,
                lectureDialogKey: null,
                file: {},
                loading: false
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode'])
        },
        mounted() {
            if (this.editQuery.id) {
                this.loading = true;
                this.getCourse();
            } else {
                this.loading = true;
                this.getCode();
            }
        },
        methods: {
            checkPermission,
            async getCode() {
                const re = await getCode();
                const {data, success, msg} = re.data;
                this.loading = false;
                if (!success) {
                    this.$errorMsg(this.$t(msg || '获取编号失败'));
                    return;
                }
                this.editQuery.code = data;
                if (!this.editQuery.categoryId) {
                    this.editQuery.categoryId = await getRootCourseCategoryId();
                }
            },
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    this.loading = false;
                    if (result.success) {
                        const _data = result.data;
                        // _data.teacherIdList = _data.teacherIdList || [];
                        _data.tagList = _data.tagList || [];
                        if (Array.isArray(_data.lectureList)) {
                            const listImage = [];
                            const listFile = [];
                            _data.lectureList.map(item => {
                                const srcNameArr = item.srcName.split('.');
                                const type = srcNameArr[srcNameArr.length - 1].toLowerCase();
                                if (type === 'png' || type === 'jpg' || type === 'jpeg' || type === 'gif') {
                                    item.srcType = 'image';
                                    listImage.push(item);
                                } else {
                                    item.srcType = srcNameArr[srcNameArr.length - 1];
                                    listFile.push(item);
                                }
                            });
                            _data.lectureList = listImage.concat(listFile);
                        }
                        if (_data.coverId && _data.coverId.endsWith('.png')) {
                            _data.coverUrl = new PublicImage().getImageUrl(_data.coverId);
                        }
                        this.teacherSelect = _data.teacherNameList || [];
                        this.editQuery = Object.assign({}, this.editQuery, _data);
                        this.editQuery.subject = transformCodesToSubject(this.editQuery.subjectCode);
                        this.editQuery.trade = transformCodesToTrade(this.editQuery.tradeCode);
                        this.editQuery.profession = transformCodesToProfession(this.editQuery.professionCode);
                        this.editQuery.tier = this.editQuery.level.split(',');
                    }
                });
            },
            categorySelect() {
                const $category = this.$refs.category;
                const result = $category.getActive();
                this.editQuery.categoryId = result.id;
                this.editQuery.categoryName = result.name;
                this.categoryDialogVisible = false;
                this.$refs.editQuery.validateField('categoryId');
            },
            showCategorySelect() {
                this.categoryDialogVisible = true;
                this.$refs.categoryInput.blur();
            },
            uploadSuccess(response, file, fileList) {
                const result = response;
                if (result.success) {
                    this.editQuery.coverId = result.data.fileId;
                }
            },
            cancel() {
                history.go(-1);
            },
            sure() {
                // this.editQuery.tagList = this.$refs.labels.listQuery.labels;
                // if (this.$store.getters.ajaxIng) {
                //     return;
                // }
                this.$store.dispatch('setAjaxIng', true);
                this.editQuery.teacherNameList = null;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        const params = this.editQuery;
                        params.lectureList.map(item => {
                            params.lectureIds.push(item.fileId);
                        });
                        params.lectureList = null;

                        // 处理行业数据、职业数据、层级、学科数据
                        this.editQuery.subjectCode = transformCommonToCode(this.editQuery.subject);
                        this.editQuery.tradeCode = transformCommonToCode(this.editQuery.trade);
                        this.editQuery.professionCode = transformCommonToCode(this.editQuery.profession);
                        this.editQuery.level = this.editQuery.tier.join(',');

                        this.$store.dispatch('setAjaxIng', true);
                        if (!this.editQuery.id) {
                            insertCourse(params).then(re => {
                                this.$store.dispatch('setAjaxIng', false);
                                const result = re.data;
                                if (result.success) {
                                    this.$successMsg(this.$t('保存成功'));
                                    this.$router.push({
                                        name: `courseItem`,
                                        query: {
                                            id: result.data
                                        }
                                    });
                                } else {
                                    this.$errorMsg(
                                        result.msg || this.$t('保存失败')
                                    );
                                }
                            });
                            return;
                        }
                        updateCourse(params).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.$router.push({
                                    name: `courseItem`,
                                    query: {
                                        id: this.editQuery.id
                                    }
                                });
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
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
                const fileId = files[0].fileId;
                this.editQuery.coverUrl = files[0].viewUrl;
                this.editQuery.coverId = fileId;
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            showTeacherDlg() {
                this.teacherDialogVisible = true;
                this.searchTeacher();
            },
            // 搜索老师列表
            searchTeacher() {
                this.getTeacherList({pageNum: 1});
            },
            getTeacherList(condition) {
                const params = Object.assign(
                    {'status': 'ENABLED'}, this.teacherQuery, condition);
                this.teacherListLoading = true;
                getTeacherPage(params).then(re => {
                    this.teacherListLoading = false;
                    const result = re.data;
                    if (result.success) {
                        this.teacherlist = result.data.list || [];
                        this.teacherTotal = result.data.total;
                        this.teacherQuery.pageNum = params.pageNum;
                        this.teacherQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取讲师数据出错'));
                    }
                });
            },
            teacherSelectionChange(selection) {
                this.teacherMultiSelection = selection;
            },
            handleTeacherSizeChange(v) {
                this.getTeacherList({
                    pageNum: 1,
                    pageSize: v
                });
            },
            handleTeacherCurrentChange(v) {
                this.getTeacherList({
                    pageNum: v
                });
            },
            handleTeacherClose() {
                this.teacherDialogVisible = false;
            },
            onTeacherSure() {
                this.teacherMultiSelection.map(teacher => {
                    if (!this.editQuery.teacherIdList.includes(teacher.id)) {
                        this.editQuery.teacherIdList.push(teacher.id);
                        this.teacherSelect.push(teacher);
                    }
                });
                this.teacherDialogVisible = false;
                this.$refs.editQuery.validateField('teacherIdList');
            },
            handleCloseTeacher(teacher) {
                const index = this.editQuery.teacherIdList.indexOf(teacher.id);
                this.editQuery.teacherIdList.splice(index, 1);

                let idx = -1;
                const list = this.teacherSelect;
                list.map((t, i) => {
                    if (t.id === teacher.id) {
                        idx = i;
                    }
                });

                if (idx > -1) {
                    list.splice(idx, 1);
                    this.teacherSelect = list;
                }
                this.$refs.editQuery.validateField('teacherIdList');
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            clearCategory() {
                this.editQuery.categoryId = '';
                this.$refs.editQuery.validateField('categoryId');
            },
            categoryDlgClose() {
                this.$refs.editQuery.validateField('categoryId');
            },
            showLectureSelect() {
                this.lectureDialogVisible = true;
            },
            handleLectureClose() {
                this.lectureDialogVisible = false;
            },
            lectureDialogClose() {
                this.lectureDialogKey = +new Date();
            },
            lectureOnSure(files) {
                const result = [];
                Array.isArray(files) &&
                    files.map(item => {
                        const {
                            fileId,
                            name,
                            viewUrl,
                            qgFileDetail,
                            convertStatus,
                            convertType
                        } = item;
                        const {length, mediaType, fileExt} = qgFileDetail;

                        const filter = this.editQuery.lectureList.filter(itm => {
                            return itm.fileId === fileId;
                        });

                        if (filter && filter.length) {
                            return;
                        }

                        item.srcType =
                            mediaType === 'image'
                                ? mediaType
                                : fileExt.split('.')[1];
                        if (item.srcType.toLowerCase() === 'png' || item.srcType.toLowerCase() === 'jpg' || item.srcType.toLowerCase() === 'jpeg' || item.srcType.toLowerCase() === 'gif') {
                            item.srcType = 'image';
                        }
                        const file = {
                            fileId,
                            srcName: name,
                            srcType: item.srcType,
                            length: length,
                            viewUrl: viewUrl,
                            convertStatus,
                            convertType
                        };

                        result.push(file);
                    });
                this.editQuery.lectureList = this.editQuery.lectureList.concat(
                    result
                );
                this.lectureDialogVisible = false;
            },
            lectureOnCancel() {
                this.lectureDialogVisible = false;
            },
            deleteFile(index) {
                this.editQuery.lectureList.splice(index, 1);
            },
            previewFile(index) {
                const file = this.editQuery.lectureList[index];
                const {fileId, viewUrl, length, convertType} = file;
                const routeData = this.$router.resolve({
                    name: 'filePreview',
                    query: {fileId, viewUrl, length, convertType}
                });
                window.open(routeData.href, '_blank');
            },
            navTeacherEdit() {
                this.teacherDialogVisible = false;
                this.$router.push({name: 'teacherEdit', query: {type: 'COURSE_EDIT'}});
            }
        }
    };
</script>
