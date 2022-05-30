<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="personalized-content">
        <el-form
            ref="editQuery"
            :model="editQuery"
            :inline-message="true"
            label-width="140px"
            :rules="rules"
        >
            <el-form-item :label="$t('域名设置') + '：'" prop="domainName" :rules="[rules.required]">
                <el-input v-model="editQuery.domainName" maxlength="100">
                    <!--<template slot="append">.{{ personalHost }}</template>-->
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('网院名称') + '：'" prop="titleName">
                <el-input v-model.trim="editQuery.titleName" type="text" maxlength="50"/>
            </el-form-item>
            <el-form-item :label="$t('个性化logo') + '：'" prop="logoFileId" :rules="[rules.required]">
                <div class="personalized__logo__wrapper" @click="logoUpload">
                    <img
                        v-if="editQuery.logoFileId"
                        class="personalized__logo"
                        :src="editQuery.logoUrl"
                        :alt="$t('logo')"
                    >
                    <svg-icon
                        v-if="!editQuery.logoFileId"
                        icon-class="plus"
                        class-name="personalized__upload__plus"
                    />
                </div>
            </el-form-item>
            <el-form-item :label="$t('版权说明') + '：'" prop="copyright" :rules="[rules.required]">
                <el-input v-model="editQuery.copyright" type="text" maxlength="100"/>
                <div class="system__desc">{{ $t('建议不超过100个汉字') }}</div>
            </el-form-item>
            <el-form-item :label="$t('个性化登录界面') + '：'" class="required">
                <el-radio-group v-model="editQuery.loginType">
                    <el-radio-button label="pc">{{ $t('电脑端') }}</el-radio-button>
                    <el-radio-button label="mobile">{{ $t('手机端') }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="editQuery.loginType === 'pc'" :label="$t('')">
                <el-radio-group v-model="editQuery.type">
                    <el-radio label="SYSTEM">{{ $t('简单模板') }}</el-radio>
                    <el-radio label="CUSTOM">{{ $t('专业模板') }}</el-radio>
                </el-radio-group>
                <section v-if="editQuery.type === 'SYSTEM'">
                    <div
                        v-for="(item, index) in Object.values(TEMPLATE_ENUM)"
                        :key="index"
                        :label="index"
                        class="personalized__template__img__item"
                        :class="{'active': item.pcModule === editQuery.templateId}"
                        @click="selectTemplate(item, index)"
                    >
                        <img :src="item.templateUrl" :alt="$t('模板')" class="personalized__template__img">
                    </div>
                    <div class="personalized__template__text">{{ $t('当前选择的模板为'+'：') }}</div>
                    <div class="personalized__template__upload">
                        <el-button type="primary" class="login__btn" @click="bgUpload">{{ $t('替换底图') }}</el-button>
                        <span class="personalized__template__upload__text">{{ bgTips }}</span>
                    </div>
                    <div class="personalized__template__wrapper">
                        <veln-login
                            class="personalized__template__login"
                            :show-corp-code="false"
                            :disabled="true"
                            :logo="editQuery.logoUrl"
                            :content-bg="editQuery.backgroundUrl"
                            :type="editQuery.templateId"
                            :summary="editQuery.titleName"
                            :copyright="editQuery.copyright"
                        />
                    </div>
                </section>
                <section v-if="editQuery.type === 'CUSTOM'">
                    <article class="customer__login__tips">
                        <p class="customer__login__p">请仔细阅读以下操作说明，并先
                            <el-link
                                type="primary"
                                class="download__template__link"
                                :href="templateUrl"
                                target="_blank"
                            >下载模板
                            </el-link>
                            ，按模板结构要求做相应调整，再作为附件上传到平台。
                        </p>
                        <p class="customer__login__p">操作说明：</p>
                        <p class="customer__login__p">下列操作说明可以使用户对启效个性页面有更全面、更主观的设计。</p>
                        <section class="customer__login__sec">
                            <div class="customer__login__text">对操作人员的要求：</div>
                            <div class="customer__login__text">1.具有基础的网页制作技能</div>
                            <div class="customer__login__text">2.具有基础的图片处理技能；</div>
                            <div class="customer__login__text">3.已得到登录启效平台的“企业ID”和“个性域名”；</div>
                        </section>
                        <section class="customer__login__sec">
                            <div class="customer__login__text">操作规范及步骤如下：</div>
                            <div class="customer__login__text">1.个性页面上传前必须压缩成zip文件（上传的文件大小限制为10M）;</div>
                            <div class="customer__login__text">2.个性页面的文件名必须是英文；</div>
                            <div class="customer__login__text">3.html，css等文本文件必须采用UTF-8编码；</div>
                            <div class="customer__login__text">4.个性页面的结构分两部分：</div>
                            <div class="customer__login__text">(1)以index开头的html文件的文件名必须为：index.html，该文件存放页面的结构以及布局方式；
                            </div>
                            <div class="customer__login__text">(2)以images命名的同级文件夹，存放背景图片；</div>
                            <div class="customer__login__text">(3)以css命名的同级文件夹，存放css样式文件；</div>
                            <div class="customer__login__text">(4)以js命名的同级文件夹，存放js文件；</div>
                            <div class="customer__login__text">5.上传文件的目录结构必须按照该模板结构存放，页面内容根据模板中的index.html中的要求设计；</div>
                            <div class="customer__login__text">
                                6.请阅读模板index.html中的注释内容，注意引用的通用部分的css和js文件不能改动，自定义的css和js内容可以以新文件形式引入，并建议最好使用与模板中不同的class名称，防止出现意外冲突或不兼容；
                            </div>
                        </section>
                    </article>
                    <div class="template__name">
                        已上传模板名称：{{ editQuery.templateFileName || '--' }}
                        <el-button class="template__uploader__btn" type="primary" @click="showUploader">{{ $t('上传模板') }}
                        </el-button>
                    </div>
                </section>
            </el-form-item>
            <el-form-item v-if="editQuery.loginType === 'mobile'" :label="$t('')">
                <section>
                    <div
                        v-for="(item, index) in Object.values(MOBILE_TEMPLATE_ENUM)"
                        :key="index"
                        :label="index"
                        class="personalized__template__im/views/uc/score/level/index.vueg__item mobile"
                        :class="{'active': item.mobileModule === editQuery.mobileTemplateId}"
                        @click="selectMobileTemplate(item, index)"
                    >
                        <img :src="item.templateUrl" :alt="$t('模板')" class="personalized__template__img">
                    </div>
                    <div class="personalized__template__text">{{ $t('当前选择的模板为'+'：') }}</div>
                    <div class="personalized__template__upload">
                        <el-button type="primary" class="login__btn" @click="bgUpload">{{ $t('替换底图') }}</el-button>
                        <span class="personalized__template__upload__text">{{ $t('建议 尺寸1024*760,格式jpg/png/jpeg,大小不超过5M。') }}</span>
                    </div>
                    <div class="personalized__mobile__template__wrapper">
                        <veln-mobile-login
                            :logo="editQuery.logoUrl"
                            :content-bg="editQuery.mobileBackgroundUrl"
                            :type="editQuery.mobileTemplateId"
                            :summary="editQuery.titleName"
                            :copyright="editQuery.copyright"
                        />
                    </div>
                </section>
            </el-form-item>
            <el-form-item :label="$t('')">
                <el-button type="primary" class="login__btn" @click="save">{{ $t('保存') }}</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            v-if="fileDialogVisible"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
            @close="handleFileClose"
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
        <veln-file-upload
            ref="velnFileUpload"
            app-code="sys"
            :title="title"
            :template-url="templateUrl"
            :fun-code="funCode"
            @onSure="uploadSuccess"
        />
    </article>
</template>
<script>
    import VelnFileSelect from '@/components/VelnFileSelect';
    import VelnFileUpload from '@/components/VelnFileUpload';
    import VelnLogin from '../../../login';
    import VelnMobileLogin from '@/components/VelnMobileLogin';
    import {MOBILE_TEMPLATE_ENUM, TEMPLATE_ENUM} from './data';
    import {getPersonalizedSetting, insert} from '@/api/personalized/personalized';
    import {deepClone} from '@/utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'PersonalizedSetting',
        components: {
            VelnFileSelect,
            VelnLogin,
            VelnMobileLogin,
            VelnFileUpload
        },
        data() {
            const BG_TIPS = [
                '建议 尺寸1920*800,格式jpg/png/jpeg,大小不超过5M。',
                '建议 尺寸480*980,格式jpg/png/jpeg,大小不超过5M。',
                '建议 尺寸1920*600,格式jpg/png/jpeg,大小不超过5M。'
            ];
            return {
                BG_TIPS,
                TEMPLATE_ENUM,
                MOBILE_TEMPLATE_ENUM,
                title: this.$t('上传模板'),
                personalHost: '',
                templateUrl: ``,
                funCode: '',
                errorUrl: '',
                editQuery: {
                    domainName: '', // 域名设置
                    titleName: TEMPLATE_ENUM[0].summary, // 网院名称
                    logoUrl: TEMPLATE_ENUM[0].logo, // logo图片地址
                    logoFileId: '', // logo图片ID
                    copyright: 'Copyright ©2020 课通天下教育平台 All Rights Reserved 皖ICP备20009376号', // 版权信息
                    templateId: 0, // PC端模板编号
                    templateFileId: '', // 模板文件ID
                    mobileTemplateId: 0, // 移动端模板编号
                    loginType: 'pc', // pc端/手机端
                    type: 'SYSTEM', // 模板类型
                    backgroundId: '', // 电脑端背景图
                    templateFileName: '',
                    backgroundUrl: TEMPLATE_ENUM[0].bg, // 电脑端背景图
                    mobileBackgroundId: '', // 手机端背景图
                    mobileBackgroundUrl: MOBILE_TEMPLATE_ENUM[0].bg // 手机端背景图
                },
                fileDialogVisible: false,
                uploadType: 'LOGO',
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    }
                },
                bgTips: BG_TIPS[0]
            };
        },
        computed: {
            ...mapGetters(['token'])
        },
        watch: {
            'editQuery.templateId': {
                handler(v) {
                    this.bgTips = this.BG_TIPS[v];
                },
                immediate: true
            }
        },
        created() {
            const userKey = `${location.host}_veln_u`;
            localStorage.setItem(userKey, '');

            this.getPersonalizedSetting();
        },
        mounted() {
            this.templateUrl = `${process.env.STATIC_API}/api/veln-cs/personalized/downloadTemplate?_token=${this.token}`;
        },
        methods: {
            async getPersonalizedSetting() {
                const re = await getPersonalizedSetting();
                const result = re.data;
                const {titleName, logoFilePath, backgroundPath, copyright, templateId, logoFileId, mobileTemplateId, backgroundId, type, templateFileId, templateFileName, mobileBackgroundId, mobileBackgroundPath} = result.data;
                let {domainName} = result.data;
                domainName = domainName || '';
                // let domainArr = domainName.split('.');
                // domainArr.pop();
                // domainArr.pop();
                // this.editQuery.domainName = domainArr.join('.');
                this.editQuery.domainName = domainName;
                this.editQuery.copyright = copyright;
                this.editQuery.logoUrl = logoFilePath;
                this.editQuery.titleName = titleName;
                this.editQuery.backgroundUrl = backgroundPath;
                this.editQuery.templateId = Number(templateId || 0);
                if (!backgroundPath) {
                    this.editQuery.backgroundUrl = this.TEMPLATE_ENUM[this.editQuery.templateId].bg;
                }
                this.editQuery.logoFileId = logoFileId;
                this.editQuery.mobileTemplateId = Number(mobileTemplateId || 0);
                this.editQuery.backgroundId = backgroundId;
                this.editQuery.templateFileId = templateFileId;
                this.editQuery.templateFileName = templateFileName;
                this.editQuery.mobileBackgroundUrl = mobileBackgroundPath;
                if (!mobileBackgroundPath) {
                    this.editQuery.mobileBackgroundUrl = this.MOBILE_TEMPLATE_ENUM[this.editQuery.mobileTemplateId].bg;
                }
                this.editQuery.mobileBackgroundId = mobileBackgroundId;
                this.editQuery.type = type || 'SYSTEM';
            },
            logoUpload() {
                this.uploadType = 'LOGO';
                this.fileDialogVisible = true;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            onSure(files) {
                const fileId = files[0].fileId;
                if (this.uploadType === 'LOGO') {
                    this.editQuery.logoUrl = files[0].coverUrl;
                    this.editQuery.logoFileId = fileId;
                    this.fileDialogVisible = false;
                    return;
                }
                // 底图
                if (this.editQuery.loginType === 'pc') {
                    this.editQuery.backgroundUrl = files[0].coverUrl;
                    this.editQuery.backgroundId = fileId;
                } else {
                    this.editQuery.mobileBackgroundUrl = files[0].coverUrl;
                    this.editQuery.mobileBackgroundId = fileId;
                }
                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            selectTemplate(item) {
                this.editQuery.templateId = item.pcModule;
                this.editQuery.backgroundUrl = item.bg;
                this.editQuery.backgroundId = '';
            },
            selectMobileTemplate(item) {
                this.editQuery.mobileTemplateId = item.mobileModule;
                this.editQuery.mobileBackgroundUrl = item.bg;
                this.editQuery.mobileBackgroundId = '';
            },
            bgUpload() {
                this.uploadType = 'BG';
                this.fileDialogVisible = true;
            },
            save() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (!this.editQuery.logoFileId) {
                            this.$warnMsg(this.$t('请上传logo'));
                            return;
                        }
                        if (this.editQuery.type !== 'SYSTEM' && !this.editQuery.templateFileId) {
                            this.$warnMsg(this.$t('请上传登录模板'));
                            return;
                        }
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = deepClone(this.editQuery);
                        // params.domainName = `${params.domainName}.${process.env.PERSONAL_HOST}`;
                        insert(params).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t(result.msg || '保存成功'));
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            uploadSuccess(re) {
                if (re.success) {
                    this.editQuery.templateFileId = re.data.fileId;
                    this.editQuery.templateFileName = re.data.name;
                } else {
                    this.$errorMsg(this.$t(re.msg || '导入失败'));
                }
            },
            showUploader() {
                this.$refs.velnFileUpload.open();
            }
        }
    };
</script>
