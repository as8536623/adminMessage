<style lang="scss" scoped>
.icons-container {
    margin: 10px 20px 0;
    overflow: hidden;
    .icons-wrapper {
        margin: 0 auto;
    }
    .icon-item {
        margin: 20px;
        height: 110px;
        text-align: center;
        width: 110px;
        float: left;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
    }
    span {
        display: block;
        font-size: 24px;
        margin-top: 10px;
    }
    .disabled{
        pointer-events: none;
    }
}
</style>

<template>
    <div class="icons-container">
        <p class="warn-content">
            1、先看 <a href="http://element-cn.eleme.io/#/zh-CN/component/icon">elementUI</a> 里是否有你需要的图标
            <br>
            2、如果没有请到 <a href="http://iconfont.cn/">iconfont</a> 网站搜索需要的图标，下载svg文件放到 <strong>src/icons/svg</strong> 文件夹下，刷新当前页，图标就会显示到下面列表，复制即可使用。
            <br>
            3、图标命名以中划线链接
        </p>
        <div class="icons-wrapper">
            <div v-for="item of iconsMap" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
                <el-tooltip placement="top">
                    <div slot="content">
                        {{ generateIconCode(item) }}
                    </div>
                    <div class="icon-item">
                        <svg-icon class-name="disabled" :icon-class="item"/>
                        <span>{{ item }}</span>
                    </div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    import icons from './generateIconsView';
    import clipboard from '@/utils/clipboard';

    export default {
        name: 'Icons',
        data() {
            return {
                iconsMap: []
            };
        },
        mounted() {
            const iconsMap = icons.state.iconsMap.map((i) => {
                return i.default.id.split('-')[1];
            });
            this.iconsMap = iconsMap;
        },
        methods: {
            generateIconCode(symbol) {
                return `<svg-icon icon-class="${symbol}" />`;
            },
            handleClipboard(text, event) {
                clipboard(text, event);
            }
        }
    };
</script>

