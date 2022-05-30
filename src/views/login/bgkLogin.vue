<style lang="scss">
    @import './login';
</style>

<template>
    <div class="login__container bgk__login" :class="cls">
        <div class="bg__content" :style="{backgroundImage: `url(${bgImage})`}"/>
        <div class="login__info">
            <img class="login__logo__image" :src="logoImage">
            <div class="login__summary">{{ companyName }}</div>
        </div>
        <div class="login__content">
            <img :src="loginRightImage" class="login__image--right" alt="type1_image">
            <div class="login__center">
                <div class="login__center--left"/>
                <div class="login__center--right">
                    <div class="login__form" :class="{'corpCode--hide': !isShowCorpCode}">
                        <h3 class="login__title">{{ $t('登录') }}</h3>
                        <div v-if="isShowCorpCode" class="login__line" :class="{'line--error': errorMsg.corpCode}">
                            <input
                                id="corpCode"
                                v-model="loginForm.corpCode"
                                type="text"
                                autocomplete="off"
                                class="login__input"
                                :class="{'has-value': hasValue.includes('corpCode')}"
                                maxlength="50"
                                :disabled="disabled"
                                @change="inputChange('corpCode')"
                                @keyup.enter="handleLogin"
                            >
                            <label class="login__line__label" for="corpCode">{{ $t('公司编号') }}</label>
                            <svg-icon icon-class="corp" class-name="login__icon"/>
                            <div class="login__line--bottom"/>
                            <div v-if="errorMsg.corpCode" class="login--error">
                                <i class="el-icon-error"/>
                                <span class="login--error__text">{{ errorMsg.corpCode }}</span>
                            </div>
                        </div>
                        <div class="login__line" :class="{'line--error': errorMsg.username}">
                            <input
                                id="username"
                                v-model="loginForm.username"
                                type="text"
                                autocomplete="off"
                                class="login__input"
                                :class="{'has-value': hasValue.includes('username')}"
                                maxlength="50"
                                :disabled="disabled"
                                @change="inputChange('username')"
                                @keyup.enter="handleLogin"
                            >
                            <label class="login__line__label" for="username">{{ $t('手机号／邮箱／用户名') }}</label>
                            <svg-icon icon-class="user" class-name="login__icon"/>
                            <div class="login__line--bottom"/>
                            <div v-if="errorMsg.username" class="login--error">
                                <i class="el-icon-error"/>
                                <span class="login--error__text">{{ errorMsg.username }}</span>
                            </div>
                        </div>
                        <div class="login__line" :class="{'line--error': errorMsg.password}">
                            <input
                                id="password"
                                v-model="loginForm.password"
                                type="password"
                                class="login__input"
                                :class="{'has-value': hasValue.includes('password')}"
                                maxlength="50"
                                autocomplete="new-password"
                                :disabled="disabled"
                                @change="inputChange('password')"
                                @keyup.enter="handleLogin"
                            >
                            <label class="login__line__label" for="password">{{ $t('密码') }}</label>
                            <svg-icon icon-class="lock" class-name="login__icon"/>
                            <div class="login__line--bottom"/>
                            <div v-if="errorMsg.password" class="login--error">
                                <i class="el-icon-error"/>
                                <span class="login--error__text">{{ errorMsg.password }}</span>
                            </div>
                        </div>
                        <div class="login__remember__line">
                            <el-checkbox v-model="remember">{{ $t('记住密码') }}</el-checkbox>
                        </div>
                        <el-button
                            type="primary"
                            class="login__btn"
                            :loading="loading"
                            @click="handleLogin"
                        >{{ $t('登录') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <q-footer :text="copyrightText"/>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import QFooter from '../footer/index';

    const CryptoJS = require('crypto-js');
    const userKey = `${location.host}_veln_u`;

    const LOGIN_THEME = ['type_0', 'type_1', 'type_2'];
    const BG_IMAGES = [
        `${process.env.STATIC_API}/qgyun-static/images/login/mogule0_bg.jpg`,
        `${process.env.STATIC_API}/qgyun-static/images/login/module1_left.jpg`,
        `${process.env.STATIC_API}/qgyun-static/images/login/module2_bg.jpg`
    ];

    export default {
        name: 'Login',
        components: {
            QFooter
        },
        props: {
            contentBg: {
                type: String,
                default: require('./img/bgk_left.jpg')
            },
            logo: {
                type: String,
                default: require('./img/bgk_login_logo.png')
            },
            summary: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            showCorpCode: {
                type: Boolean,
                default: true
            },
            type: {
                type: [String, Number],
                default: 0
            },
            copyright: {
                type: String,
                default: '北京国家会计学院 Copyright © 2019 All Rights Reserved 京公网安备11011302001299号 京ICP备05004616号-2'
            }
        },
        data() {
            return {
                BG_IMAGES,
                LOGIN_THEME,
                saveUrlTime: 1000 * 60 * 60 * 24,
                securityImg: '',
                loginForm: {
                    username: '',
                    password: '',
                    corpCode: 'bgk'
                },
                bgImage: '', // 背景图片
                loginRightImage: `${process.env.STATIC_API}/qgyun-static/images/login/module1_right.jpg`,
                logoImage: '', // logo图片
                companyName: '', // 公司名称
                copyrightText: '', // copyright 信息
                remember: true,
                cls: 'type_0',
                loginRules: {
                    username: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: this.$t('请输入用户名')
                        }
                    ],
                    password: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: this.$t('请输入密码')
                        },
                        {
                            min: 6,
                            trigger: 'blur',
                            message: this.$t('密码至少为6位')
                        }
                    ],
                    corpCode: [
                        {
                            message: this.$t('请输入公司编号'),
                            required: true,
                            trigger: 'blur'
                        }
                    ]
                },
                passwordType: 'password',
                loading: false,
                showDialog: false,
                errTxt: '',
                hasValue: [],
                errorMsg: {
                    corpCode: '',
                    username: '',
                    password: ''
                },
                isShowCorpCode: false
            };
        },
        watch: {
            contentBg: {
                handler(v) {
                    this.bgImage = v;
                },
                immediate: true
            },
            logo: {
                handler(v) {
                    this.logoImage = v;
                },
                immediate: true
            },
            summary: {
                handler(v) {
                    this.companyName = v;
                },
                immediate: true
            },
            type: {
                handler(v) {
                    this.cls = this.LOGIN_THEME[v];
                },
                immediate: true
            },
            copyright: {
                handler(v) {
                    this.copyrightText = v;
                },
                immediate: true
            }
        },
        async created() {
            this.cls = `type_1`;

            if (location.href.includes('showCorpCode=true')) {
                this.isShowCorpCode = true;
            }

            const code = Cookies.get('CORP_CODE');
            if (code !== 'bgk' && code !== 'bgh') {
                this.$router.replace('/login');
            }
        },
        mounted() {
            this.checkRemember();
        },
        destroyed() {
        },
        methods: {
            checkRemember() {
                const userInfoCipher = localStorage.getItem(userKey);
                if (userInfoCipher) {
                    const userInfoDecrypt = CryptoJS.AES.decrypt(
                        userInfoCipher,
                        'veln'
                    );
                    const userInfo = JSON.parse(
                        userInfoDecrypt.toString(CryptoJS.enc.Utf8)
                    );
                    this.hasValue = ['corpCode', 'username', 'password'];
                    this.remember = true;
                    this.loginForm = Object.assign({}, this.loginForm, userInfo);
                }
            },
            inputChange(type) {
                this.errorMsg[type] = '';
                if (this.loginForm[type]) {
                    this.hasValue.push(type);
                    this.hasValue = [...new Set(this.hasValue)];
                } else {
                    const index = this.hasValue.indexOf(type);
                    if (index > -1) {
                        this.hasValue.splice(index, 1);
                    }
                }
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = '';
                } else {
                    this.passwordType = 'password';
                }
            },
            validate() {
                let result = true;
                if (!this.loginForm.corpCode) {
                    this.errorMsg.corpCode = this.$t('请输入公司编号');
                    result = false;
                }
                if (!this.loginForm.username) {
                    this.errorMsg.username = this.$t('请输入手机号／邮箱／用户名');
                    result = false;
                }
                if (!this.loginForm.password) {
                    this.errorMsg.password = this.$t('请输入密码');
                    result = false;
                }
                return result;
            },
            handleLogin() {
                if (this.disabled) {
                    return;
                }
                if (this.validate()) {
                    this.loading = true;
                    if (this.remember) {
                        const userInfo = JSON.stringify(this.loginForm);
                        const userInfoCipher = CryptoJS.AES.encrypt(
                            userInfo,
                            'veln'
                        ).toString();
                        localStorage.setItem(userKey, userInfoCipher);
                    } else {
                        localStorage.removeItem(userKey);
                    }
                    this.$store
                        .dispatch('LoginByUsername', this.loginForm)
                        .then(() => {
                            this.loading = false;
                            this.$router.push({path: '/'});
                        })
                        .catch(error => {
                            if (error.data === 'forceLogin') {
                                this.$confirm(
                                    `
                                        <div class="login__tips__title">${this.$t('该帐号之前未正常退出或在另一地点登录，此次登录将使原登录失效')}</div>
                                        <div class="login__tips__text">${this.$t('如果不是您本人操作，请及时修改密码')}</div>
                                        <div class="login__tips__text">${this.$t('如有疑问请联系管理员，谢谢！')}</div>
                                    `,
                                    '',
                                    {
                                        showClose: false,
                                        customClass: 'login__tips__dialog',
                                        dangerouslyUseHTMLString: true,
                                        confirmButtonText: this.$t('重新登录'),
                                        cancelButtonText: this.$t('取消'),
                                        type: 'warning'
                                    }
                                )
                                    .then(re => {
                                        this.reLogin();
                                    })
                                    .catch(re => {
                                        this.loading = false;
                                        this.form.forceLogin = false;
                                    });
                                return;
                            }
                            if (error.msg) {
                                this.$errorMsg(error.msg);
                            } else {
                                this.$errorMsg(error.response.data.msg);
                            }
                            this.loading = false;
                        });
                }
            },
            reLogin() {
                this.loginForm.forceLogin = true;
                this.$store
                    .dispatch('LoginByUsername', this.loginForm)
                    .then(() => {
                        this.loading = false;
                        this.$router.push({path: '/'});
                    })
                    .catch(error => {
                        if (error.msg) {
                            this.$errorMsg(error.msg);
                        } else {
                            this.$errorMsg(error.response.data.msg);
                        }
                        this.loading = false;
                    });
            }
        }
    };
</script>
