<style lang="scss" scoped>
    @import url('./style.scss');
</style>

<template>
    <article class="login__block mobile__block" :class="cls">
        <section class="login__content flex__1" :style="{backgroundImage: `url(${contentBg})`}">
            <div class="login__center">
                <div class="login__logo">
                    <div class="login__logo__image" :style="{backgroundImage: `url(${logo})`}"/>
                </div>
                <div class="logo__text">
                    {{ summary }}
                </div>
                <div class="login__info">
                    <div class="login__item hide">
                        <label
                            class="login__label transition"
                            for="corpCode"
                        >{{ $t('企业ID') }}</label>
                        <div class="login__desc">
                            <input
                                id="corpCode"
                                v-model="form.corpCode"
                                type="text"
                                class="login__input"
                                autocomplete="off"
                                maxlength="50"
                                :placeholder="$t('企业ID')"
                                readonly
                            >
                        </div>
                        <svg-icon
                            icon-class="crop_l"
                            class-name="login__icon"
                        />
                    </div>
                    <div class="login__item">
                        <label
                            class="login__label transition"
                            for="name"
                        >{{ $t('手机号/邮箱/用户名') }}</label>
                        <div class="login__desc">
                            <input
                                id="name"
                                v-model="form.username"
                                type="text"
                                class="login__input"
                                autocomplete="off"
                                maxlength="50"
                                :placeholder="$t('手机号/邮箱/用户名')"
                                readonly
                            >
                            <input type="password" style="display: none;">
                        </div>
                        <svg-icon
                            icon-class="user_l"
                            class-name="login__icon"
                        />
                    </div>
                    <div class="login__item">
                        <label
                            class="login__label transition"
                            for="password"
                        >
                            {{ $t('登录密码') }}</label>
                        <div class="login__desc">
                            <input
                                id="password"
                                v-model="form.password"
                                type="password"
                                class="login__input"
                                autocomplete="new-password"
                                maxlength="50"
                                :placeholder="$t('请输入密码')"
                                readonly
                            >
                        </div>
                        <svg-icon
                            icon-class="password_l"
                            class-name="login__icon"
                        />
                    </div>
                </div>
                <div
                    class="login__btn"
                    :class="{'login__btn-active': form.username && form.password && form.corpCode}"
                >
                    {{ $t('登录') }}
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex';
    // const LOGIN_THEME = ['type_0', 'type_1', 'type_2'];
    export default {
        name: 'VelnMobileLogin',
        props: {
            contentBg: {
                type: String,
                default: `${process.env.STATIC_API}/qgyun-static/images/bg.jpg`
            },
            logo: {
                type: String,
                default: `${process.env.STATIC_API}/qgyun-static/images/logo.png`
            },
            summary: {
                type: String,
                default: '课通天下教育平台'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: [String, Number],
                default: 0
            },
            copyright: {
                type: String,
                default: 'Copyright ©2020 课通天下教育平台 All Rights Reserved 皖ICP备20009376号'
            }
        },
        data() {
            return {
                cls: `type_${this.type}`,
                form: {
                    openId: '',
                    username: '',
                    password: '',
                    corpCode: ''
                }
            };
        },
        computed: {
            ...mapGetters(['addRouters'])
        },
        watch: {
            type: {
                handler(v) {
                    this.cls = `type_${v}`;
                },
                immediate: true
            }
        },
        created() {
        },
        methods: {}
    };
</script>

