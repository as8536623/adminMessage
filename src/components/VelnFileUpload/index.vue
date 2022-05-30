<style lang="scss" src='./style.scss'>
</style>

<template>
    <article>
        <el-dialog
            v-if="dialogVisible"
            ref="dialog"
            append-to-body
            class="veln__file__upload"
            width="540px"
            :title="title"
            :visible.sync="dialogVisible"
            @close="dialogClose"
        >
            <section class="vfu--top">
                <div class="vfu__fold">{{ fileSize || '0KB' }}</div>
            </section>
            <section class="vfu--bottom">
                <div class="vfu__tips">{{ $t('请先下载导入模版，根据导入模版的规则，编辑文件') }}</div>
                <div class="vfu__template">
                    <el-button type="text" @click="download">{{ $t('下载模版') }}</el-button>
                </div>
                <div class="vfu__upload">
                    <span class="vfu__upload__label pull-left">{{ $t('文件') }}</span>
                    <div class="vfu__upload__wrapper pull-left">
                        <div
                            class="vfu__upload__main"
                            :class="{'success': status !== 'FAIL', 'fail': status === 'FAIL'}"
                        >
                            <div class="vfu__upload__container">
                                <span
                                    class="vfu__file__name"
                                    :class="{'done': status === 'SUCCESS' || status == 'FAIL'}"
                                >{{ fileName || '请上传文件' }}</span>
                                <span
                                    v-if="status === 'RUNNING'"
                                    class="vfu__file__progress"
                                >{{ progress }}</span>
                            </div>
                            <svg-icon icon-class="file" class-name="vfu__file__icon"/>
                            <div class="vfu__upload__progress" :style="{width: progress}"/>
                        </div>
                        <div class="vfu__upload__dom">
                            <veln-upload
                                v-if="isMounted"
                                id="vfuUploadWrapper"
                                app-code="sys"
                                :fun-code="funCode"
                                @before-upload="beforeUpload"
                                @progress="progressChange"
                                @success="success"
                                @fail="fail"
                                @complete="complete"
                            />
                        </div>
                    </div>
                </div>
                <div class="vfu__status__wrapper">
                    <div v-if="status === 'FAIL'" class="vfu__upload__status error">
                        <i class="el-icon-error"/>
                        <span class="vfu__error__text">上传失败，请重新尝试</span>
                    </div>
                    <div v-if="status === 'SUCCESS'" class="vfu__upload__status success">
                        <i class="el-icon-success"/>
                        <span class="vfu__error__text">上传成功</span>
                    </div>
                </div>
                <div class="text--right">
                    <el-button class="btn--small" @click="close">{{ $t('取消') }}</el-button>
                    <el-button class="btn--small" type="primary" @click="onSure">{{ $t('确定') }}</el-button>
                </div>
            </section>
        </el-dialog>
    </article>
</template>

<script>
    import VelnUpload from '@/components/VelnUpload';
    import {calFileSize} from '@/utils';
    import {mapGetters} from 'vuex';
    import i18n from '@/lang';

    export default {
        name: 'VelnFileUpload',
        components: {
            VelnUpload
        },
        props: {
            templateUrl: {
                type: String,
                default: ''
            },
            appCode: {
                type: String,
                required: true,
                default: ''
            },
            title: {
                type: String,
                default: i18n.t('文件导入')
            },
            funCode: {
                type: String,
                required: true,
                default: ''
            },
            errorCallback: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogVisible: false,
                isMounted: false,
                fileName: '',
                fileSize: '',
                progress: '0%',
                status: '',
                fileId: '',
                response: null
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            dialogVisible: {
                handler(v) {
                    if (!v) {
                        return;
                    }
                    setTimeout(() => {
                        this.dialogOpen();
                    }, 300);
                },
                immediate: true
            }
        },
        methods: {
            dialogOpen() {
                this.isMounted = true;
            },
            dialogClose() {
                this.$emit('onClose');
                this.reset();
            },
            reset() {
                this.isMounted = false;
                this.fileName = '';
                this.fileSize = '';
                this.progress = '0%';
                this.status = '';
                this.fileId = '';
                this.response = null;
            },
            open() {
                this.dialogVisible = true;
            },
            close() {
                this.dialogVisible = false;
                this.reset();
            },
            beforeUpload(file) {
                console.log('beforeUpload', file);
                this.fileSize = calFileSize(file.size);
                this.progress = '0%';
                this.status = 'RUNNING';
                this.fileName = this.$t('文件正在上传');
            },
            progressChange(percentage, file) {
                console.log('progress', percentage);
                this.progress = `${Math.ceil(percentage * 100)}%`;
            },
            complete(response, file) {
                this.status = 'SUCCESS';
                this.fileName = file.name;
                console.log('complete', response);
            },
            success(response) {
                this.status = 'SUCCESS';
                console.log('success', response);
                if (response.success) {
                    const result = response.data;
                    this.fileId = result.fileId;
                    this.response = response;
                } else {
                    if (this.errorCallback) {
                        this.$emit('onError', response);
                    } else {
                        this.$errorMsg(this.$t(response.msg || '上传失败'));
                    }
                }
            },
            fail(reason, file) {
                this.status = 'FAIL';
                this.fileName = file.name;
            },
            download() {
                var url = '';
                if (`${this.templateUrl}`.includes('?')) {
                    url = `${this.templateUrl}&_token=${this.token}`;
                } else {
                    url = `${this.templateUrl}?_token=${this.token}`;
                }

                window.open(url);
            },
            onSure() {
                this.$emit('onSure', this.response);
                this.close();
            }
        }
    };
</script>
