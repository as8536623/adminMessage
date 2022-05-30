<style lang="scss">
    @import '../style';
    @import './style';
</style>
<template>
    <article class="app-container paper__question__container random__question__container">
        <veln-steps :data="steps" :active="active" @change="stepChange"/>
        <section class="paper__question__content">
            <div class="paper__left">
                <random-select :id="id" ref="random" @summary="summaryHandle"/>
            </div>
            <div class="paper__right">
                <page-info
                    :key="key"
                    :info="info"
                    :edit-query="editQuery"
                    :summary="summary"
                    :step="2"
                    @preview="preview"
                />
            </div>
        </section>
        <div class="random__btn__list">
            <el-button @click="back">{{ $t('取消') }}</el-button>
            <el-button @click="last">{{ $t('上一步') }}</el-button>
            <el-button @click="next">{{ $t('保存为草稿') }}</el-button>
            <el-button type="primary" @click="next('enable')">{{ $t('保存并启用') }}</el-button>
        </div>
    </article>
</template>
<script>
    import VelnSteps from '@/components/VelnSteps';
    import PageInfo from '../components/paperInfo';
    import RandomSelect from './components/random';
    import {enable, findFixedItem, getBasic, saveRandomPaper} from '@/api/paper/paperTemplate';

    export default {
        name: 'RandomQuestion',
        components: {
            VelnSteps,
            PageInfo,
            RandomSelect
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('必考题'),
                    status: 'done',
                    disabled: true
                },
                {
                    title: this.$t('随机题'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                active: 2,
                steps,
                msg: '',
                id: this.$route.query.id,
                info: null,
                editQuery: {},
                summary: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                },
                key: null
            };
        },
        created() {
            this.findFixedItem();
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.getBasic();
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.$router.push({
                            name: 'paperBasic',
                            query: {id: this.id}
                        });
                        break;
                    case 1:
                        this.last();
                        break;
                }
            },
            // 必考题试题
            findFixedItem() {
                this.info = null;
                const params = {paperTemplateId: this.id};
                findFixedItem(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.info = result.data || null;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取部门数据出错'));
                    }
                });
            },
            // 编辑回显
            getBasic() {
                const params = {paperTemplateId: this.$route.query.id};
                getBasic(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        if (this.editQuery.paperType === 'FIXED') {
                            this.steps.pop();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            back() {
                this.$router.push({
                    name: 'paperList'
                });
            },
            next(type) {
                const params = this.$refs.random.listQuery;
                console.log(params);
                if (this.$store.getters.ajaxIng) {
                    return;
                }
                this.$store.dispatch('setAjaxIng', true);
                if (params.sr.d) {
                    params.sr.sm = null;
                } else {
                    params.sr.smList = null;
                }
                saveRandomPaper(params).then(res => {
                    const result = res.data;
                    this.$store.dispatch('setAjaxIng', false);
                    if (result.success) {
                        if (type === 'enable') {
                            this.enable();
                        } else {
                            this.$successMsg(this.$t('保存成功'));
                            this.back();
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('保存失败'));
                    }
                });
            },
            // 保存并启用
            enable() {
                const params = {templateId: this.id};
                enable(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.$successMsg(this.$t('启用成功'));
                        this.back();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '启用失败'));
                    }
                });
            },
            last() {
                this.$router.push({
                    name: 'fixedQuestion',
                    query: {id: this.id}
                });
            },
            summaryHandle(data) {
                this.summary = data;
                this.key = +new Date();
            },
            // 试卷预览
            preview() {
                const routeData = this.$router.resolve({
                    name: 'paperPreview',
                    query: {id: this.id}
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
