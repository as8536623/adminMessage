<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="app-container course__edit course__detail__sec">
        <el-form :model="editQuery" label-width="140px" :inline-message="true">
            <el-form-item :label="$t('课程编号') + '：'" prop="code">{{ editQuery.code }}</el-form-item>
            <el-form-item :label="$t('课程名称') + '：'" prop="name">{{ editQuery.name }}</el-form-item>
            <el-form-item :label="$t('课程类别') + '：'" prop="categoryId">{{ editQuery.categoryName }}</el-form-item>
            <el-form-item :label="$t('课时') + '：'" prop="period">{{ editQuery.period }}</el-form-item>
            <el-form-item :label="$t('所属学科') + '：'">
                <subject-cascader
                    v-model="editQuery.subject"
                    :multiple="true"
                    disabled
                />
            </el-form-item>
            <el-form-item :label="$t('适用行业') + '：'">
                <industry-cascader
                    v-model="editQuery.trade"
                    :multiple="true"
                    disabled
                />
            </el-form-item>
            <el-form-item :label="$t('适用职业') + '：'">
                <job-cascader
                    v-model="editQuery.profession"
                    :multiple="true"
                    disabled
                />
            </el-form-item>
            <el-form-item :label="$t('适用层级') + '：'">
                <el-select
                    v-model="editQuery.tier"
                    class="multiple"
                    multiple
                    :placeholder="$t('请选择')"
                    disabled
                >
                    <el-option
                        v-for="(item, index) in TIER_ENUM.getAllValues()"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('讲师') + '：'" prop="teacherIdList">
                <el-tag
                    v-for="(tag, index) in teacherSelect"
                    :key="index"
                    class="course__teacher__tag"
                    :disable-transitions="false"
                >{{ tag.name }}
                </el-tag>
            </el-form-item>
            <el-form-item :label="$t('版权') + '：'" prop="teacherIdList">
                <div v-for="(tag, index) in editQuery.teacherCopyrightList" :key="tag" class="course__upload__sec">
                    <img
                        v-if="tag.srcUrl"
                        :key="index"
                        class="course__cover"
                        :src="tag.srcUrl"
                        :alt="$t('版权')"
                    >
                    <svg-icon
                        v-if="!tag.srcUrl"
                        icon-class="plus"
                        class-name="course__upload__plus"
                    />
                </div>
            </el-form-item>
            <el-form-item :label="$t('收费方式') + '：'" prop="buyType">
                {{ editQuery.buyType === 'COUNT' ? $t('按版权和流量收费') : $t('按账号数收费') }}
            </el-form-item>
            <el-form-item v-if="editQuery.buyType === 'COUNT'" :label="$t('版权费') + '：'" prop="copyrightPrice">
                {{ editQuery.copyrightPrice }}{{ $t('元') }}
            </el-form-item>
            <el-form-item v-if="editQuery.buyType === 'COUNT'" :label="$t('流量费') + '：'" prop="flowPrice">
                {{ editQuery.flowPrice }}{{ $t('元/G') }}
            </el-form-item>
            <el-form-item v-if="editQuery.buyType === 'OTHER'" :label="$t('账号费') + '：'" prop="countPrice">
                {{ editQuery.countPrice }}{{ $t('元/个') }}
            </el-form-item>
            <el-form-item :label="$t('出版日期') + '：'" prop="publishDate">{{ editQuery.publishDate }}</el-form-item>
            <el-form-item :label="$t('课程封面') + '：'" class="course__upload__line">
                <div class="course__upload__sec">
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
                <!--<span class="course__upload__tips">{{ $t('图片大小不能超过5M，建议尺寸640*370px') }}</span>-->
            </el-form-item>
            <el-form-item :label="$t('详情描述') + '：'" prop="description">
                <div v-html="editQuery.description"/>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getCourse} from '@/api/course';
    import checkPermission from '@/utils/permission';
    import {TIER_ENUM} from '@/enum';
    import IndustryCascader from '@/components/Common/IndustryCascader';
    import JobCascader from '@/components/Common/JobCascader';
    import SubjectCascader from '@/components/Common/SubjectCascader';
    import {transformCodesToProfession, transformCodesToSubject, transformCodesToTrade} from '@/utils/common';
    import {PublicImage} from '@/model/PublicImage';

    export default {
        name: 'CourseBaseInfo',
        components: {
            IndustryCascader,
            JobCascader,
            SubjectCascader
        },
        data() {
            return {
                TIER_ENUM,
                editQuery: {
                    name: '',
                    code: '',
                    categoryId: '',
                    categoryName: '',
                    period: '',
                    score: '',
                    level: '', // 层级 code
                    subject: '', // 所属学科
                    subjectCode: '', // 所属学科 code
                    trade: '', // 行业
                    tradeCode: '', // 行业 code
                    profession: '', // 职业
                    professionCode: '', // 职业 Code
                    publishDate: '',
                    teacherIdList: [],
                    tagList: [],
                    coverUrl: '',
                    coverId: '',
                    description: '',
                    standard: '',
                    id: this.$route.query.id
                },
                teacherSelect: []
            };
        },
        computed: {
            ...mapGetters(['name', 'appCode'])
        },
        created() {
            if (this.editQuery.id) {
                this.getCourse();
            }
        },
        methods: {
            checkPermission,
            getCourse() {
                getCourse(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const _data = result.data;
                        _data.teacherIdList = _data.teacherIdList || [];
                        _data.tagList = _data.tagList || [];
                        if (Array.isArray(_data.teacherNameList)) {
                            _data.teacherNameList.map((item, index) => {
                                _data.teacherNameList[index] = {name: item};
                            });
                        }
                        this.teacherSelect = _data.teacherNameList;
                        if (_data.coverId && _data.coverId.endsWith('.png')) {
                            _data.coverUrl = new PublicImage().getImageUrl(_data.coverId);
                        }

                        this.editQuery = _data;
                        this.editQuery.subject = transformCodesToSubject(this.editQuery.subjectCode);
                        this.editQuery.trade = transformCodesToTrade(this.editQuery.tradeCode);
                        this.editQuery.profession = transformCodesToProfession(this.editQuery.professionCode);
                        this.editQuery.tier = this.editQuery.level.split(',');
                    }
                });
            },
            previewFile(index) {
                const file = this.editQuery.lectureList[index];
                const {fileId, viewUrl, length, convertType} = file;
                const routeData = this.$router.resolve({
                    name: 'filePreview',
                    query: {fileId, viewUrl, length, convertType}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
