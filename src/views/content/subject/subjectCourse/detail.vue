<style lang="scss" scoped>
    @import "style";
</style>

<template>
    <div class="app-container">
        <section class="qg-container">
            <h4 class="qg-container__title">查看</h4>
            <el-form ref="form" :model="form" class="qg-edit-form" label-width="100px">
                <el-form-item label="专题ID" prop="code">
                    {{ form.code }}
                </el-form-item>
                <el-form-item label="专题名称" prop="name">
                    {{ form.name }}
                </el-form-item>
                <el-form-item label="专题分类" prop="categoryId">
                    {{ categoryMap[form.categoryId] }}
                </el-form-item>
                <el-form-item label="课程价格" prop="price">
                    {{ form.price }}
                </el-form-item>
                <el-form-item label="课时" prop="period">
                    {{ form.period }}
                </el-form-item>
                <el-form-item label="讲师" prop="teacherList">
                    <el-tag
                        v-for="(tag, index) in form.teacherList"
                        :key="index"
                        class="course__teacher__tag"
                        :disable-transitions="false"
                    >{{ tag.name }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="封面图片" prop="coverUrl" class="course__upload__line">
                    {{ !form.coverUrl ? '--' : '' }}
                    <div v-if="form.coverUrl" class="course__upload__sec">
                        <img
                            v-if="form.coverUrl"
                            class="course__cover"
                            :src="form.coverUrl"
                            :alt="$t('封面')"
                        >
                    </div>
                </el-form-item>
                <el-form-item label="详情描述" prop="desc">
                    <div v-html="form.desc"/>
                </el-form-item>
                <el-form-item label="课程信息" prop="desc">
                    <section class="course__info__list">
                        <div v-for="(item, index) in form.courseReferList" :key="index">
                            <veln-image :src="item.coverUrl"/>
                            <div>{{ item.courseName }}</div>
                        </div>
                    </section>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goBack">{{ mode === 'dialog'?'关闭':'返回' }}</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    import {subject} from '@/api/moudles/stu/subject';
    import {componentsData} from './subjectCourseConfig.js';
    import {getFirstLevelCategory} from './operationalCommonConfig';
    export default {
        props: {
            callback: {
                type: Function,
                default: () => {
                }
            },
            mode: {
                type: String,
                default: ''
            },
            subjectId: {
                type: String,
                default: ''
            }
        },
        data() {
            let id = this.subjectId;
            if (this.$route && this.$route.query.subjectId) {
                id = this.$route.query.subjectId;
            }
            return {
                id: id,
                componentsData,
                form: {},
                categoryMap: {},
                teacherNameList: []
            };
        },
        created() {
            if (this.id) {
                this.form.id = this.id;
                this.getDetail(this.id);
            }
        },
        methods: {
            async getDetail(id) {
                const categoryOptionsArray = await getFirstLevelCategory();
                const categoryMap = {};
                categoryOptionsArray.forEach(item => {
                    categoryMap[item.code] = item.name;
                });
                this.categoryMap = categoryMap;
                subject(id).then(res => {
                    if (res.data.success) {
                        this.form = res.data.data;
                        this.form.teacherList.forEach(item => {
                            this.teacherNameList.push(item.name);
                        });
                        return;
                    }
                    this.$message.error(res.message || '获取信息出错');
                    // this.goBack();
                });
            },
            goBack() {
                if (this.mode === 'dialog') {
                    this.callback();
                } else {
                    this.$router.back();
                }
            }
        }
    };
</script>
