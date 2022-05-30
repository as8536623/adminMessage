<style lang="scss" src='./style.scss'>
</style>

<template>
    <header class="vfv__header">
        <div class="vfv__breadcrumb pull-left">
            <span class="vfv__breadcrumb--parent">{{ $t('文件库') }}</span>
            <span class="vfv__breadcrumb__line">/</span>
            <span class="vfv__breadcrumb--current">{{ subTitle }}</span>
        </div>
        <div class="pull-right vfs__search">
            <search-input v-model="listQuery.keywords" width="192px" :placeholder="$t('输入文件名搜索')" @enter="enter"/>
        </div>
        <div class="pull-right vfv__header__category">
            <el-input
                ref="input"
                v-model="listQuery.categoryName"
                type="text"
                :placeholder="$t('请选择文件类别')"
                @focus="categoryFocus"
            />
        </div>
    </header>
</template>

<script>
    export default {
        name: 'VfsHeader',
        props: {
            category: {
                type: Object,
                default: () => {
                    return {
                        id: '',
                        name: ''
                    };
                }
            },
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            const TITLE_ENUM = {
                VIDEO: this.$t('全部视频'),
                AUDIO: this.$t('全部音频'),
                DOC: this.$t('全部文档'),
                IMAGE: this.$t('全部图片')
            };
            return {
                TITLE_ENUM,
                subTitle: TITLE_ENUM.VIDEO,
                listQuery: {
                    keywords: '',
                    categoryId: this.category.id,
                    categoryName: this.category.name
                }
            };
        },
        watch: {
            category: {
                handler(val) {
                    this.listQuery.categoryId = val.id;
                    this.listQuery.categoryName = val.name;
                },
                immediate: true,
                deep: true
            },
            type: {
                handler(val) {
                    this.subTitle = this.TITLE_ENUM[val || 'VIDEO'];
                },
                immediate: true
            }
        },
        methods: {
            enter() {
                this.$emit('enter', this.listQuery);
            },
            categoryFocus() {
                this.$emit('focus');
                this.$refs.input.blur();
            }
        }
    };
</script>
