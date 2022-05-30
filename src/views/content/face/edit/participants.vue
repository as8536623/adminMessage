<style lang="scss">
    @import '../style.scss';
</style>
<template>
    <article class="app-container face-edit-container tool-participants">
        <el-form ref="editQuery" :model="editQuery" label-width="140px" :inline-message="true">
            <veln-form-section :title="$t('参与人员')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section class="tool-form-item">
                    <el-form-item :label="$t('指定人员') + '：'" prop="code">
                        <veln-organization-scope
                            :fun-code="funCode"
                            :business-id="businessId"
                            :app-code="appCode"
                            :route="route"
                        />
                    </el-form-item>
                    <el-form-item v-if="applyList.includes('veln-enroll')" :label="$t('报名人员') + '：'">
                        <el-button
                            v-if="!enrollId"
                            size="small"
                            type="text"
                            @click="toSignUp"
                        >{{ $t('添加报名') }}
                        </el-button>
                        <section v-else class="sign__up__set">
                            {{ $t('已设置接受报名') }}
                            <el-button
                                size="small"
                                type="text"
                                class="face__btn"
                                @click="signUpView"
                            >{{ $t('去查看') }}
                            </el-button>
                            <el-button
                                v-if="enrollId"
                                type="text"
                                class="face__del__btn"
                                @click="delEnroll(enrollId)"
                            >
                                {{ $t('删除') }}
                            </el-button>
                        </section>
                    </el-form-item>
                    <el-form-item :label="$t('指定助教') + '：'">
                        <el-tag
                            v-for="(tag, index) in assistantList"
                            :key="index"
                            closable
                            @close="assistantHandleClose(tag)"
                        >
                            {{ tag.name }}
                        </el-tag>
                        <el-button
                            size="small"
                            type="text"
                            @click="assistantSelect"
                        >{{ (!assistantList || !assistantList.length) ?
                            $t('选择，默认是自己，可修改') : $t('指定助教') }}
                        </el-button>
                    </el-form-item>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="next">{{ $t('完成') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                route="faceScope"
                fun-code="ASSISTANT"
                app-code="veln-face"
                :fun-id="editQuery.id"
                @onClose="onClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnOrganizationScope from '@/components/VelnOrganizationScope';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {detail, delEnroll} from '@/api/faceCourse';
    import {OUT_USER_JOIN_ENUM} from '@/enum';
    import {removeUsers} from '@/api/userComponent';
    import {getAppCodes} from '@/api/system/csFeign';
    export default {
        name: 'CourseParticipants',
        components: {
            VelnFormSection,
            VelnSteps,
            VelnOrganizationScope,
            VelnDgpUser
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('参与人员'),
                    status: 'wait',
                    disabled: true
                }
                // ,
                // {
                //     title: this.$t('面授安排'),
                //     status: 'done',
                //     disabled: false
                // }
                // ,
                // {
                //     title: this.$t('现场互动（可不添加）'),
                //     status: 'done',
                //     disabled: false
                // }
            ];
            return {
                OUT_USER_JOIN_ENUM,
                steps,
                active: 1,
                editQuery: {
                    id: this.$route.query.id
                },
                enrollId: '',
                businessId: this.$route.query.id,
                funCode: 'FACE',
                route: 'faceScope',
                appCode: 'veln-face',
                assistantList: [],
                dgpDialogVisible: false,
                userQuery: {
                    appCode: 'veln-face',
                    category: true,
                    funCode: 'ASSISTANT',
                    funId: this.$route.query.id,
                    includeChild: true,
                    optType: 'USER',
                    relIds: [],
                    route: 'faceScope'
                },
                applyList: []
            };
        },
        created() {
            this.init();
            this.getAppCodes();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.detail();
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            // 获取公司应用
            getAppCodes() {
                getAppCodes().then(res => {
                    const result = res.data;
                    if (result.length) {
                        this.applyList = result || [];
                    }
                });
            },
            last() {
                this.$router.push({
                    name: 'courseBaseInfo',
                    query: {id: this.$route.query.id}
                });
            },
            sure() {
                this.$router.push({name: 'faceCourseList'});
            },
            next() {
                this.$confirm(this.$t('面授项目已创建成功，你还可以进行'), {
                    confirmButtonText: this.$t('课程设计'),
                    cancelButtonText: this.$t('返回'),
                    type: 'success'
                }).then(() => {
                    this.$router.push({
                        name: 'coursePlan',
                        query: {id: this.$route.query.id}
                    });
                }).catch(() => {
                    this.cancel();
                });
            },
            // 编辑回显
            detail() {
                const params = {id: this.$route.query.id};
                detail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.enrollId = result.data.enrollId;
                        this.assistantList = result.data.assistantVoList;
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            cancel() {
                this.$router.push({name: 'faceCourseList'});
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'courseBaseInfo',
                            query: {id: this.$route.query.id}
                        });
                        break;
                    case 2:
                        this.$router.push({
                            name: 'coursePlan',
                            query: {id: this.$route.query.id}
                        });
                        break;
                    case 3:
                        this.$router.push({
                            name: 'courseInteraction',
                            query: {id: this.$route.query.id}
                        });
                        break;
                }
            },
            toSignUp() {
                this.$router.push({
                    name: 'basicInfo',
                    query: {sourceId: this.editQuery.id, source: 'FACE_ENROLL'}
                });
            },
            signUpView() {
                this.$router.push({
                    name: 'basicInfo',
                    query: {
                        sourceId: this.editQuery.id,
                        source: 'FACE_ENROLL',
                        id: this.enrollId
                    }
                });
            },
            assistantSelect() {
                this.dgpDialogVisible = true;
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
            },
            onClose() {
                this.dgpDialogVisible = false;
                this.detail();
            },
            // 删除报名
            delEnroll() {
                const params = {courseId: this.editQuery.id, enrollId: this.enrollId};
                delEnroll(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.detail();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            },
            // 删除助教
            assistantHandleClose(tag) {
                this.userQuery.relIds = [tag.id];
                removeUsers(this.userQuery).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t('删除成功'));
                        this.detail();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '删除失败'));
                    }
                });
            }
        }
    };
</script>
