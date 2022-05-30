<style lang="scss" src="./style.scss">
</style>

<template>
    <div
        :class="{fullscreen:fullscreen, 'tinymce-tool-container': hideFlag}"
        class="tinymce-container"
        :style="{width:containerWidth}"
    >
        <textarea :id="tinymceId" class="tinymce-textarea"/>
    </div>
</template>

<script>
    import axios from 'axios';
    import store from '@/store';
    import {getToken} from '@/utils/auth';
    /**
     * docs:
     * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
     */
    import editorImage from './components/editorImage';
    import plugins from './plugins';
    import config from './config';
    // import load from './dynamicLoadScript';

    // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
    // const tinymceCDN = `${process.env.STATIC_API}/qgyun-static/js/tinymce/4.9.3/tinymce.min.js`;

    export default {
        name: 'QguEditor',
        // eslint-disable-next-line vue/no-unused-components
        components: {editorImage},
        props: {
            id: {
                type: String,
                default: function() {
                    return (
                        'qgu-editor-' +
                        +new Date() +
                        ((Math.random() * 1000).toFixed(0) + '')
                    );
                }
            },
            value: {
                type: String,
                default: ''
            },
            toolbar: {
                type: Array,
                required: false,
                default() {
                    return [];
                }
            },
            menubar: {
                type: String,
                default: 'file edit insert view format table'
            },
            height: {
                type: [Number, String],
                required: false,
                default: 360
            },
            width: {
                type: [Number, String],
                required: false,
                default: 'auto'
            },
            hideFlag: {
                type: Boolean,
                default: false
            },
            cleanUp: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                hasChange: false,
                hasInit: false,
                tinymceId: this.id,
                fullscreen: false,
                languageTypeList: {
                    en: 'en',
                    zh: 'zh_CN',
                    es: 'es_MX',
                    ja: 'ja'
                }
            };
        },
        computed: {
            containerWidth() {
                const width = this.width;
                if (/^[\d]+(\.[\d]+)?$/.test(width)) {
                    // matches `100`, `'100'`
                    return `${width}px`;
                }
                return width;
            }
        },
        watch: {
            value: {
                handler(val) {
                    if (!this.hasChange && this.hasInit) {
                        this.$nextTick(() =>
                            window.tinymce.get(this.tinymceId).setContent(val || '')
                        );
                    }
                },
                immediate: true
            }
        },
        mounted() {
            this.init();
            console.log(this.tinymceId);
        },
        activated() {
            if (window.tinymce) {
                this.initTinymce();
            }
        },
        deactivated() {
            this.destroyTinymce();
        },
        destroyed() {
            this.destroyTinymce();
        },
        methods: {
            init() {
                // dynamic load tinymce from cdn
                // load(tinymceCDN, err => {
                //     if (err) {
                //         this.$message.error(err.message);
                //         return;
                //     }
                //     this.initTinymce();
                // });
                this.initTinymce();
            },
            initTinymce() {
                const _this = this;
                window.tinymce.init({
                    selector: `#${this.tinymceId}`,
                    language: this.languageTypeList['zh'],
                    height: this.height,
                    // eslint-disable-next-line camelcase
                    body_class: 'panel-body ',
                    // eslint-disable-next-line camelcase
                    object_resizing: false,
                    toolbar: this.hideFlag
                        ? false
                        : this.toolbar.length > 0
                            ? this.toolbar
                            : config.toolbar,
                    // eslint-disable-next-line camelcase
                    font_formats: config.fonts,
                    // eslint-disable-next-line camelcase
                    fontsize_formats: config.fontsize_formats,
                    // eslint-disable-next-line camelcase
                    // lineheight_formats: config.lineheight_formats,
                    menubar: false,
                    plugins: this.hideFlag ? [] : plugins,
                    // eslint-disable-next-line camelcase
                    end_container_on_empty_block: true,
                    // eslint-disable-next-line camelcase
                    powerpaste_word_import: 'clean',
                    // eslint-disable-next-line camelcase
                    code_dialog_height: 450,
                    // eslint-disable-next-line camelcase
                    code_dialog_width: 1000,
                    // eslint-disable-next-line camelcase
                    advlist_bullet_styles: 'square',
                    // eslint-disable-next-line camelcase
                    advlist_number_styles: 'default',
                    // eslint-disable-next-line camelcase
                    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                    // eslint-disable-next-line camelcase
                    default_link_target: '_blank',
                    // eslint-disable-next-line camelcase
                    link_title: false,
                    // eslint-disable-next-line camelcase
                    images_upload_url: `/file/upload`,
                    // eslint-disable-next-line camelcase
                    paste_auto_cleanup_on_paste: this.cleanUp, // 只粘贴文本文字
                    // eslint-disable-next-line camelcase
                    paste_remove_styles: this.cleanUp, // 只粘贴文本文字
                    // eslint-disable-next-line camelcase
                    paste_remove_styles_if_webkit: this.cleanUp, // 只粘贴文本文字
                    // eslint-disable-next-line camelcase
                    paste_strip_class_attributes: this.cleanUp, // 只粘贴文本文字
                    // eslint-disable-next-line camelcase
                    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                    // eslint-disable-next-line camelcase
                    images_upload_handler: function(blobInfo, success, failure) {
                        const formData = new FormData();
                        // 服务端接收文件的参数名，文件数据，文件名
                        formData.append(
                            'file',
                            blobInfo.blob(),
                            blobInfo.filename()
                        );
                        axios({
                            method: 'POST',
                            // 这里是你的上传地址
                            url: store.getters.uploadImageUrl,
                            headers: {
                                Authorization: getToken()
                            },
                            data: formData
                        })
                            .then(res => {
                                // 这里返回的是你图片的地址
                                success(`${res.data.data.viewUrl}`);
                            })
                            .catch(() => {
                                failure('上传失败');
                            });
                    // setTimeout(function() {
                    //     // no matter what you upload, we will turn it into TinyMCE logo :)
                    //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
                    // }, 2000);
                    },
                    // eslint-disable-next-line camelcase
                    init_instance_callback: editor => {
                        if (_this.value) {
                            editor.setContent(_this.value);
                        }
                        _this.hasInit = true;
                        editor.on('Change KeyUp SetContent', () => {
                            this.hasChange = true;
                            this.$emit('input', editor.getContent());
                        });
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', e => {
                            _this.fullscreen = e.state;
                        });
                    }
                });
            },
            destroyTinymce() {
                const tinymce = window.tinymce.get(this.tinymceId);
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen');
                }

                if (tinymce) {
                    tinymce.destroy();
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceId).setContent(value);
            },
            getContent() {
                return window.tinymce.get(this.tinymceId).getContent();
            },
            getText() {
                return window.tinymce.get(this.tinymceId).getBody().innerText;
            },
            imageSuccessCBK(arr) {
                const _this = this;
                arr.forEach(v => {
                    window.tinymce
                        .get(_this.tinymceId)
                        .insertContent(`<img class="wscnph" src="${v.url}" >`);
                });
            }
        }
    };
</script>
