<style lang="scss">
    @import './style';

    .upload-img {
        display: inline-block;
        vertical-align: middle;
    }
</style>
<template>
    <article class="exam__content">
        <!--题干、解析-->
        <div class="exam__item">
            <div class="exam__nav">
                <div class="exam__title">{{ title }}</div>
                <div v-if="showBtn" class="pull-right exam__tooltip">
                    <el-tooltip
                        v-if="type === 'fill'"
                        class="item"
                        effect="dark"
                        :content="$t('插入空格')"
                        placement="top"
                    >
                        <el-button class="add" type="text" size="mini" @click="addBlank">
                            <svg-icon class-name="tree__icon" icon-class="blank_e"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('代码编辑器')" placement="top">
                        <el-button class="add" type="text" size="mini" @click="codeMirrorFlag = true">
                            <svg-icon class-name="tree__icon" icon-class="code"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('上传图片')" placement="top">
                        <el-button class="add" type="text" size="mini" @click="upload('IMAGE')">
                            <svg-icon class-name="tree__icon" icon-class="pic_e"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('上传视频')" placement="top">
                        <el-button class="add" type="text" size="mini" @click="upload('VIDEO')">
                            <svg-icon class-name="tree__icon" icon-class="play_e"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('上传音频')" placement="top">
                        <el-button class="add" type="text" size="mini" @click="upload('AUDIO')">
                            <svg-icon class-name="tree__icon" icon-class="voice_e"/>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
            <!--富文本-->
            <qgu-editor
                v-if="editor"
                ref="editor"
                v-model="content.ct"
                :width="800"
                :height="120"
                :hide-flag="true"
                :clean-up="true"
            />
            <!--文本框-->
            <el-input v-if="!editor" v-model="content.ct" type="textarea" rows="6"/>
        </div>
        <!--代码编辑器-->
        <div v-if="codeMirrorFlag || content.code" class="exam__item">
            <div class="exam__nav">
                <div class="exam__title">{{ $t('代码编辑器') }}</div>
                <div class="pull-right exam__code">
                    <el-select v-model="content.codeType" @change="modeChange">
                        <el-option
                            v-for="(item, idx) in codeTypeList"
                            :key="idx"
                            :value="item.code"
                            :label="item.name"
                        />
                    </el-select>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('关闭')"
                        placement="bottom"
                    >
                        <el-button
                            type="text"
                            size="mini"
                            @click="codeMirrorChange"
                        >
                            <svg-icon class-name="close__icon" icon-class="close_e"/>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
            <vue-codemirror :key="key" v-model="content.code" :options="options"/>
        </div>
        <div
            v-show="(content.imageList && content.imageList.length)
                || (content.videoList && content.videoList.length) ||
                (content.audioList && content.audioList.length)"
            class="file__list"
        >
            <!--图片-->
            <div class="file__item km__image__list">
                <div v-for="(item, idx) in content.imageList" :key="idx" class="km__image__item">
                    <veln-image class="km__image" :src="item.viewUrl"/>
                    <div class="km__image__shadow">
                        <svg-icon
                            icon-class="delete"
                            class-name="km__image__delete"
                            @click="deleteImage(idx)"
                        />
                    </div>
                </div>
            </div>
            <!--视频-->
            <div v-for="(item, idx) in content.videoList" :key="idx">
                <file-item :section="item" :index="idx" @delete="delFile"/>
            </div>
            <!--音频-->
            <div v-for="(item, idx) in content.audioList" :key="'key'+idx">
                <file-item :section="item" :index="idx" @delete="delFile"/>
            </div>
        </div>
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
                :app-code="$appCodes.pe + '/pe'"
                fun-code="ITEM"
                :multi-select="multiSelect"
                :type-arr="typeArr"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VueCodemirror from '@/components/VueCodemirror';
    import QguEditor from '@/components/QguEditor';
    import VelnFileSelect from '@/components/VelnFileSelect';
    import FileItem from './components/FileItem';

    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/css/css');
    require('codemirror/mode/xml/xml');
    require('codemirror/mode/vue/vue');
    require('codemirror/mode/sql/sql');
    require('codemirror/mode/htmlmixed/htmlmixed');
    require('codemirror/mode/clike/clike');

    require('codemirror/addon/hint/show-hint.js');
    require('codemirror/addon/hint/show-hint.css');
    require('codemirror/addon/hint/html-hint.js');
    require('codemirror/addon/hint/xml-hint.js');
    require('codemirror/addon/hint/css-hint.js');
    require('codemirror/addon/hint/javascript-hint.js');

    export default {
        name: 'Content',
        components: {
            QguEditor,
            VelnFileSelect,
            VueCodemirror,
            FileItem
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        ct: '',
                        code: '',
                        codeType: 'javascript',
                        imageList: [],
                        audioList: [],
                        videoList: []
                    };
                }
            },
            value: {
                type: String,
                default: ''
            },
            showBtn: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            maxIndex: {
                type: Number,
                default: 0
            },
            // 代码编辑器
            codeMirror: {
                type: Boolean,
                default: false
            },
            // 富文本
            editor: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                index: this.maxIndex,
                text: this.value,
                fileDialogVisible: false,
                typeArr: ['IMAGE'],
                dialogKey: null,
                codeMirrorFlag: this.codeMirror,
                codeTypeList: [],
                options: {
                    mode: 'javascript',
                    tabSize: 2,
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: {'Ctrl-Space': 'autocomplete'}
                },
                key: null,
                multiSelect: false // 图片支持多选
            };
        },
        watch: {
            'content.ct': {
                handler(val) {
                    if (this.editor) {
                        this.textHandle();
                    }
                },
                immediate: true
            },
            'content.code': {
                handler(val) {
                    if (val) {
                        this.codeMirrorFlag = true;
                    }
                },
                immediate: true
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.codeTypeList = [
                    {
                        code: 'javascript',
                        name: 'javascript'
                    }, {

                        code: 'text/x-java',
                        name: 'java'
                    }, {

                        code: 'xml',
                        name: 'xml'
                    }, {
                        code: 'vue',
                        name: 'vue'
                    }, {

                        code: 'css',
                        name: 'css'
                    }, {
                        code: 'sql',
                        name: 'sql'
                    }
                ];
            },
            modeChange() {
                this.options.mode = this.content.codeType;
                this.key = +new Date();
            },
            codeMirrorChange() {
                if (this.codeMirrorFlag) {
                    this.$confirm(this.$t('此操作将清空已有代码, 是否继续?'), {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                    }).then(() => {
                        this.content.code = '';
                        this.codeMirrorFlag = false;
                    });
                } else {
                    this.codeMirrorFlag = true;
                }
            },
            // 添加空格
            addBlank() {
                this.index++;
                const blank = `<input type="text" data-index="${this.index}"
                class="insert-blank-item" readonly="true" name="insertPeSimpleBlankValueByTomFill${this.index}"
                style="border: none; border-bottom: 1px solid #333333;width: 80px;outline: none;margin: 0 10px;"/>`;
                const editor = this.$refs.editor;
                if (editor) {
                    const text = this.content.ct.replace(/<\/?p[^>]*>/gi, '');
                    editor.setContent(text + blank);
                    this.$emit('blankHandle', this.index.toString());
                }
            },
            // 上传
            upload(type) {
                if (type === 'IMAGE') {
                    this.multiSelect = true;
                } else {
                    this.multiSelect = false;
                }
                if (type === 'IMAGE' && this.content.imageList.length === 9) {
                    this.$warnMsg(this.$t('最多上传9张图片!'));
                    return;
                }
                if (type === 'AUDIO' && this.content.audioList.length === 1) {
                    this.$warnMsg(this.$t('最多上传1段音频!'));
                    return;
                }
                if (type === 'VIDEO' && this.content.videoList.length === 1) {
                    this.$warnMsg(this.$t('最多上传1段视频!'));
                    return;
                }
                this.fileDialogVisible = true;
                this.typeArr[0] = type;
                this.fileType = type;
            },
            // 选择文件确认
            onSure(files) {
                if (this.fileType === 'IMAGE') {
                    const list = files.splice(0, 9 - this.content.imageList.length);
                    this.fileHandle(list);
                } else {
                    this.fileHandle(files);
                }
                this.fileDialogVisible = false;
            },
            fileHandle(list) {
                list.map(file => {
                    const data = {
                        name: file.name,
                        viewUrl: file.viewUrl,
                        fileId: file.fileId,
                        size: file.size,
                        type: file.mt,
                        duration: file.duration,
                        coverUrl: file.coverUrl,
                        m3u8Url: file.m3u8Url
                    };
                    switch (this.fileType) {
                        case 'IMAGE':
                            this.content.imageList.push(data);
                            break;
                        case 'VIDEO':
                            this.content.videoList.push(data);
                            break;
                        case 'AUDIO':
                            this.content.audioList.push(data);
                            break;
                    }
                });
            },
            // 删除图片
            deleteImage(index) {
                this.content.imageList.splice(index, 1);
            },
            // 删除视频/音频
            delFile(index, type) {
                type === 'video' ? this.content.videoList.splice(index, 1) : this.content.audioList.splice(index, 1);
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            // 监听删除空格
            textHandle() {
                this.$nextTick(() => {
                    if (this.$refs.editor) {
                        const reg = new RegExp(
                            '(?<=<input.*data-index=").*?(?=")',
                            'g'
                        );
                        const regSingle = new RegExp("(?<=<input.*data-index=').*?(?=')", 'g');
                        let list = this.$refs.editor.value.match(reg) || [];
                        !list.length ? list = this.$refs.editor.value.match(regSingle) : null;
                        this.$emit('blankDel', list);
                    }
                });
            }
        }
    };
</script>
