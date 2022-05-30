<style lang="scss" scoped>
    .hideSidebar {
        .tags-view-container {
            .tags-view-content {
                left: 80px;
            }
        }
        &.mobile {
            .tags-view-container {
                .tags-view-content {
                    left: 0;
                }
            }
        }
    }

    .tags-view-container {
        position: fixed;
        top: 42px;
        height: 49px;
        width: 100%;
        z-index: 100;

        .tags-view-content {
            height: 49px;
            position: fixed;
            transition: .2s;
            left: 200px;
            right: 0;
            top: 42px;
            padding: 5px 5px 0;
            box-sizing: border-box;
        }

        .tags-view-wrapper {
            background: #fff;
            height: 44px;
            border-top: 1px solid #F5F5F5;
            border-bottom: 1px solid #ddd;

            .tags-view-item {
                display: inline-block;
                position: relative;
                height: 36px;
                line-height: 36px;
                border: 1px solid #ddd;
                border-bottom: none;
                color: #495060;
                background: #fff;
                padding: 0 10px 0 18px;
                font-size: 15px;
                margin-left: 5px;
                border-radius: 3px 3px 0 0;

                &:first-of-type {
                    margin-left: 15px;
                }

                &.active {
                    background-color: #009FA8;
                    color: #fff;
                    border-color: #009FA8;
                    .el-icon-close{
                        color: #fff;
                    }
                }
            }
        }

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #333;

            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                line-height: 24px;

                &:hover {
                    background: #eee;
                }
            }
        }

        .tags-view-opt {
            position: absolute;
            width: 100px;
            text-align: center;
            height: 42px;
            line-height: 42px;
            border-left: 1px solid #F5F5F5;
            border-right: 1px solid #F5F5F5;
            right: 5px;
            top: 6px;
            background-color: #ffffff;

            &:hover {
                .contextmenu {
                    /*display: block;*/
                    border: 1px solid #F5F5F5;
                    top: 32px;
                    height: auto;
                    padding: 5px 0;
                }
            }

            .contextmenu {
                /*display: none;*/
                width: 110px;
                height: 0;
                overflow: hidden;
                padding: 0;
                box-sizing: content-box;
                right: 5px;
                top: 36px;
                text-align: center;
                transition: all .25s;
            }
        }

        .tags-view-opt-text {
            font-size: 14px;
            height: 32px;
            display: inline-block;
            line-height: 32px;
            cursor: pointer;
            color: #666666;

            .tags__opt__icon {
                color: #D6D6D6;
            }
        }
    }
</style>

<style lang="scss">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                font-size: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                transform-origin: 100% 50%;
                color:#b3b3b3;
                &:before {
                    transform: scale(0.6);
                    display: inline-block;
                    vertical-align: -3px;
                }

                &:hover {
                    opacity: .85;
                }
            }
        }
    }

    .tags__arrow--left {
        width: 41px;
        height: 42px;
        position: absolute;
        left: 5px;
        border-left: 1px solid #F5F5F5;
        border-right: 1px solid #F5F5F5;
        top: 6px;
        z-index: 10;
        text-align: center;
        line-height: 42px;
        color: #999999;
        cursor: pointer;
        background-color: #ffffff;
    }

    .tags__arrow--right {
        width: 41px;
        height: 42px;
        position: absolute;
        right: 105px;
        border-left: 1px solid #F5F5F5;
        top: 6px;
        z-index: 10;
        text-align: center;
        line-height: 42px;
        color: #999999;
        cursor: pointer;
        background-color: #ffffff;
    }
</style>

<template>
    <div class="tags-view-container">
        <section class="tags-view-content">
            <div class="tags__arrow--left" @click="moveScroll('left')">
                <i class="el-icon-caret-left"/>
            </div>
            <scroll-pane ref="scrollPane" class="tags-view-wrapper">
                <router-link
                    v-for="tag in Array.from(visitedViews)"
                    ref="tag"
                    :key="tag.path"
                    class="tags-view-item"
                    :class="isActive(tag)?'active':''"
                    :to="tag"
                    @contextmenu.prevent.native="openMenu(tag,$event)"
                >
                    {{ generateTitle(tag.title === 'no-name' ? tag.meta.parentTitle : tag.title) }}
                    <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
                </router-link>
            </scroll-pane>
            <div class="tags__arrow--right" @click="moveScroll('right')">
                <i class="el-icon-caret-right"/>
            </div>
            <div class="tags-view-opt">
                <span class="tags-view-opt-text">
                    更多操作
                    <i class="el-icon-caret-bottom tags__opt__icon"/>
                </span>
                <ul v-show="visible" class="contextmenu">
                    <!--                <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>-->
                    <li @click="closeOthersTags">{{ $t('关闭其他标签') }}</li>
                    <li @click="closeAllTags">{{ $t('关闭所有标签') }}</li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
    import ScrollPane from '@/components/ScrollPane';
    import {generateTitle} from '@/utils/i18n';

    export default {
        components: {ScrollPane},
        data() {
            return {
                visible: true,
                top: 0,
                left: 0,
                selectedTag: {}
            };
        },
        computed: {
            visitedViews() {
                return this.$store.state.tagsView.visitedViews;
            }
        },
        watch: {
            $route() {
                this.addViewTags();
                this.moveToCurrentTag();
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu);
                } else {
                    document.body.removeEventListener('click', this.closeMenu);
                }
            }
        },
        mounted() {
            this.addViewTags();
        },
        methods: {
            generateTitle, // generateTitle by vue-i18n
            generateRoute() {
                if (this.$route.name) {
                    return this.$route;
                }
                return false;
            },
            isActive(route) {
                return route.path === this.$route.path;
            },
            addViewTags() {
                const route = this.generateRoute();
                if (!route) {
                    return false;
                }
                this.$store.dispatch('addVisitedViews', route);
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag;
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag.$el);
                            break;
                        }
                    }
                });
            },
            closeSelectedTag(view) {
                this.$store.dispatch('delVisitedViews', view).then(views => {
                    if (this.isActive(view)) {
                        const latestView = views.slice(-1)[0];
                        if (latestView) {
                            this.$router.push(latestView);
                        } else {
                            this.$router.push('/');
                        }
                    }
                });
            },
            closeCurrentTag() {
                let currentView = null;
                this.visitedViews.map(tag => {
                    if (this.isActive(tag)) {
                        currentView = tag;
                    }
                });
                this.closeSelectedTag(currentView);
            },
            closeOthersTags() {
                this.$router.push(this.selectedTag);
                this.$store.dispatch('delOthersViews', this.generateRoute()).then(() => {
                    this.moveToCurrentTag();
                });
            },
            closeAllTags() {
                this.$store.dispatch('delAllViews');
                this.$router.push('/');
            },
            openMenu(tag, e) {
                this.visible = true;
                this.selectedTag = tag;
                this.left = e.clientX;
                this.top = e.clientY;
            },
            closeMenu() {
                this.visible = false;
            },
            moveScroll(type) {
                const $scrollPanel = this.$refs.scrollPane;
                if (type === 'left') {
                    $scrollPanel.moveToLeft();
                } else {
                    $scrollPanel.moveToRight();
                }
            }
        }
    };
</script>
