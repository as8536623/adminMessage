<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="app-container news__edit">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="140px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('资讯信息')" :can-expand="false">
                <section class="tool-form-item">
                    <el-form-item :label="$t('资讯名称') + '：'" prop="name">
                        <el-input
                            v-model.trim="editQuery.name"
                            class="input__limit"
                            type="text"
                            :placeholder="$t('长度小于50位')"
                            maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <el-form-item :label="$t('资讯作者') + '：'" prop="author">
                        <el-input
                            v-model.trim="editQuery.author"
                            type="text"
                            :placeholder="$t('长度小于20位')"
                            maxlength="20"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('资讯封面') + '：'" class="course__upload__line">
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
                    <el-form-item :label="$t('资讯内容') + '：'" prop="blobContent">
                        <qgu-editor
                            ref="editor"
                            v-model="editQuery.blobContent"
                            :width="editorWidth"
                        />
                    </el-form-item>
                </section>
            </veln-form-section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button @click="sure('DRAFT')">{{ $t('保存') }}</el-button>
                <el-button type="primary" @click="sure('ENABLED')">{{ $t('保存并启用') }}</el-button>
            </section>
        </el-form>
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
                app-code="veln-news"
                fun-code="NEWS_COVER"
                :multi-select="false"
                :type-arr="['IMAGE']"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import QguEditor from '@/components/QguEditor';
    import {saveNews, getNewsById} from '@/api/info/info';
    export default {
        name: 'NewsEdit',
        components: {
            QguEditor,
            VelnFormSection,
            VelnFileSelect
        },
        data() {
            return {
                editQuery: {
                    id: this.$route.query.id,
                    code: `${Math.ceil(Math.random() * 100000000)}`,
                    name: '',
                    author: '',
                    coverUrl: '',
                    blobContent: '',
                    introduction: ''
                },
                uploadURL: `${process.env.FS_API}/file/upload`,
                editorWidth: '750px',
                fileDialogVisible: false,
                fileDialogKey: null,
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t('请输入资讯名称'),
                            trigger: 'blur'
                        }
                    ],
                    author: [
                        {
                            required: true,
                            message: this.$t('请输入作者'),
                            trigger: 'blur'
                        }
                    ],
                    blobContent: [
                        {
                            required: true,
                            message: this.$t('请输入资讯内容'),
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getInfoById(this.$route.query.id);
                }
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect() {
                this.fileDialogVisible = true;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
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
            cancel() {
                history.back();
            },
            sure(status) {
                this.editQuery.introduction = this.$refs.editor
                    .getText()
                    .slice(0, 50);
                this.editQuery.status = status;
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        saveNews(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.$router.push({
                                    name: 'newsList'
                                });
                            } else {
                                this.$errorMsg(result.msg || this.$t('保存失败'));
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            },
            // 编辑回显
            getInfoById(id) {
                const params = {id};
                getNewsById(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            }
        }
    };
</script>
