<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="questionnaire">
        <header class="questionnaire__header">
            <span class="questionnaire__title">{{ $t('调研设置') }}</span>
            <el-button type="primary" class="pull-right qnt__btn" @click="save">{{ $t('完成') }}</el-button>
            <el-button class="pull-right qnt__btn">{{ $t('预览') }}</el-button>
        </header>
        <section class="questionnaire__main">
            <aside class="questionnaire__category">
                <draggable
                    :list="categoryList"
                    filter=".filtered"
                    :group="{ name: 'people', pull: 'clone', put: false }"
                    :sort="false"
                    :clone="cloneDog"
                >
                    <template v-for="(item, index) in categoryList">
                        <div
                            v-if="item.type !== 'title'"
                            :key="index"
                            class="qnt__category__item"
                            @click="addQuestion(item.type)"
                        >
                            <svg-icon :icon-class="item.type" class-name="qnt__category__icon"/>
                            <div class="qnt__category__name">{{ item.name }}</div>
                        </div>
                        <div v-else :key="index" class="qnt__category__title filtered">{{ item.name }}</div>
                    </template>
                </draggable>
            </aside>
            <div class="questionnaire__canvas" @click.prevent="hideOpt">
                <div class="qnt__header">
                    <el-input v-model="title" class="qnt__input qnt__title" maxlength="40"/>
                    <el-input
                        v-model="description"
                        type="textarea"
                        class="qnt__textarea qnt__description"
                        autosize
                        placeholder="请输入内容"
                        maxlength="200"
                    />
                </div>
                <div id="qntMain" class="qnt__main">
                    <draggable
                        tag="ul"
                        :list="list"
                        class="qnt__list"
                        handle=".handle"
                        v-bind="dragOptions"
                        @change="log"
                    >
                        <template v-for="(item, idx) in list">
                            <li
                                v-if="list.length"
                                :key="idx"
                                class="qnt__item"
                                :class="{'active': active === idx}"
                                @click.stop="selectActive(idx)"
                            >
                                <div class="qnt__item__opt">
                                    <svg-icon icon-class="move" class-name="handle qnt__opt__icon"/>
                                    <svg-icon
                                        icon-class="copy"
                                        class-name="qnt__opt__icon"
                                        @click="copy(idx)"
                                    />
                                    <svg-icon
                                        icon-class="delete"
                                        class-name="qnt__opt__icon"
                                        @click="del(idx)"
                                    />
                                </div>
                                <qnt-radio
                                    v-if="item.type === 'SINGLE'"
                                    :key="idx"
                                    :index="idx"
                                    :value="item"
                                    @selectImage="selectImage"
                                />
                                <qnt-checkbox
                                    v-if="item.type === 'MULTIPLE'"
                                    :key="idx"
                                    :index="idx"
                                    :value="item"
                                    @selectImage="selectImage"
                                />
                                <qnt-blank
                                    v-if="item.type === 'blank'"
                                    :key="idx"
                                    :index="idx"
                                    :value="item"
                                    @selectImage="selectImage"
                                />
                                <qnt-multi-blank
                                    v-if="item.type === 'multiBlank'"
                                    :key="idx"
                                    :index="idx"
                                    :value="item"
                                    @selectImage="selectImage"
                                />
                                <qnt-rate
                                    v-if="item.type === 'rate'"
                                    :key="idx"
                                    :index="idx"
                                    :value="item"
                                    @selectImage="selectImage"
                                />
                            </li>
                        </template>
                        <li v-if="!list.length" :key="list.length" class="qnt__item__empty">
                            <div class="qnt__empty__center">
                                <div class="qnt__empty__item">
                                    <svg-icon icon-class="click" class-name="qnt__empty__icon"/>
                                    <div class="qnt__empty__text">{{ $t('点击题型') }}</div>
                                </div>
                                <span class="qnt__empty__link">{{ $t('或') }}</span>
                                <div class="qnt__empty__item">
                                    <svg-icon icon-class="move" class-name="qnt__empty__icon"/>
                                    <div class="qnt__empty__text">{{ $t('将题拖入此区域') }}</div>
                                </div>
                            </div>
                        </li>
                    </draggable>
                </div>
                <div class="qnt__footer">
                    <el-input
                        v-model="end"
                        type="textarea"
                        class="qnt__textarea qnt__end"
                        autosize
                        placeholder="请输入内容"
                        maxlength="100"
                    />
                </div>
            </div>
            <div class="questionnaire__opt" :class="{'show': active > -1}">
                <header class="qnt__opt__title">{{ $t('题目设置') }}</header>
                <div v-if="list[active] && list.length && active > -1">
                    <div
                        v-for="(item, index) in list[active].setting"
                        :key="index"
                        class="qnt__setting__line"
                    >
                        <qnt-required v-model="item.value" @change="requiredChange"/>
                    </div>
                </div>
            </div>
        </section>
        <el-dialog
            v-if="fileDialogVisible"
            :key="fileDialogKey"
            append-to-body
            :title="$t('选择文件')"
            :visible.sync="fileDialogVisible"
            width="890px"
            :before-close="handleFileClose"
            @close="fileDialogClose"
        >
            <veln-file-select
                app-code="veln-survey"
                fun-code="SURVEY"
                :multi-select="true"
                :type-arr="['IMAGE']"
                @on-sure="onSure"
                @on-cancel="onCancel"
            />
        </el-dialog>
    </article>
</template>

<script>
    import {deleteSurveyItem, getSurvey, save} from '@/api/survey/surveyItem';
    import {templateSave} from '@/api/survey/surveyTemplate';
    import {deepClone} from '@/utils';
    import draggable from 'vuedraggable';
    import template from './utils/template';
    import QntRadio from './components/qntRadio';
    import QntCheckbox from './components/qntCheckbox';
    import QntBlank from './components/qntBlank';
    import QntRate from './components/qntRate';
    import QntMultiBlank from './components/qntMultiBlank';
    import QntRequired from './components/qntRequired';
    import VelnFileSelect from '@/components/VelnFileSelect';

    export default {
        name: 'Questionnaire',
        components: {
            VelnFileSelect,
            draggable,
            QntRadio,
            QntCheckbox,
            QntBlank,
            QntMultiBlank,
            QntRate,
            QntRequired
        },
        data() {
            const categoryList = [
                {
                    type: 'title',
                    name: this.$t('选择题')
                },
                {
                    type: 'SINGLE',
                    name: this.$t('单选题')
                },
                {
                    type: 'MULTIPLE',
                    name: this.$t('多选题')
                },
                {
                    type: 'title',
                    name: this.$t('填空题')
                },
                {
                    type: 'blank',
                    name: this.$t('填空题')
                },
                {
                    type: 'multiBlank',
                    name: this.$t('多项填空')
                },
                {
                    type: 'title',
                    name: this.$t('打分题')
                },
                {
                    type: 'rate',
                    name: this.$t('填空题')
                }
            ];
            return {
                active: -1,
                templateId: '',
                title: '调查问卷',
                description:
                    '感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧！',
                list: [],
                categoryList,
                end: '感谢您的积极参与！',
                drag: false,
                testModel: false,
                fileDialogVisible: false,
                fileDialogKey: null,
                fileType: '',
                fileQIndex: -1,
                fileAIndex: -1
            };
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: 'people',
                    disabled: false
                };
            }
        },
        mounted() {
            if (!this.$route.query.id) {
                this.createdTemplate();
            } else {
                this.templateId = this.$route.query.id;
                this.getSurvey();
            }
        },
        methods: {
            // 格式化问卷数据
            formatSurveyList(arr) {
                arr.map(item => {
                    item.optionList = item.optionList || [];
                });
                return arr;
            },
            // 获取问卷数据
            getSurvey() {
                getSurvey(this.templateId).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list = this.formatSurveyList(result.data);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取问卷失败'));
                    }
                });
            },
            // 新建问卷模板
            createdTemplate() {
                templateSave().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.templateId = result.data;
                        this.$router.replace({
                            name: 'questionnaire',
                            query: {id: result.data}
                        });
                    } else {
                        this.$errMsg(this.$t(result.msg || '创建问卷失败'));
                    }
                });
            },
            log: function(evt) {
                for (const key in evt) {
                    const item = evt[key];
                    const index = item.newIndex;
                    const element = item.element;
                    switch (key) {
                        case 'added':
                            this.addItem(element, index);
                            break;
                    }
                }
            },
            // 新增
            addItem(item, index) {
                const lastId = this.list[index - 1].id || '';
                const itm =
                    this.list.length === 1
                        ? this.list[index - 1]
                        : this.list[index];
                this.singleSave(itm, lastId, index);
            },
            cloneDog({type}) {
                return deepClone(template[type]);
            },
            copy(index) {
                const item = deepClone(this.list[index]);
                const lastId = this.list[index].id;
                item.id = '';
                this.singleSave(item, lastId)
                    .then(() => {
                        this.list.splice(index, 0, item);
                    })
                    .catch(() => {
                    });
            },
            del(index) {
                this.$confirm(this.$t('此操作将删除该数据, 是否继续?'), {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'error'
                }).then(() => {
                    const ids = [this.list[index].id];
                    deleteSurveyItem(ids).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            this.list.splice(index, 1);
                        } else {
                            this.$errorMsg(this.$t(result.msg || '操作失败'));
                        }
                    });
                });
            },
            selectActive(index) {
                this.active = index;
            },
            addQuestion(type) {
                const item = deepClone(template[type]);
                this.list.push(item);
            },
            requiredChange() {
                console.log(this.list);
            },
            hideOpt() {
                this.active = -1;
            },
            handleFileClose() {
                this.fileDialogVisible = false;
            },
            showFileSelect() {
                this.fileDialogVisible = true;
            },
            fileDialogClose() {
                this.fileDialogKey = +new Date();
            },
            onSure(files) {
                const imgs = [];
                files.map(img => {
                    const obj = {
                        fileId: img.fileId,
                        fileUrl: img.viewUrl
                    };
                    imgs.push(obj);
                });

                if (this.fileType === 'TITLE') {
                    let oImgs = this.list[this.fileQIndex].imgList;
                    oImgs = oImgs.concat(imgs);
                    this.list[this.fileQIndex].imgList = oImgs;
                } else {
                    let oImgs = this.list[this.fileQIndex].list[this.fileAIndex]
                        .imgList;
                    oImgs = oImgs.concat(imgs);
                    this.list[this.fileQIndex].list[
                        this.fileAIndex
                    ].imgList = oImgs;
                }

                console.log(this.list);

                this.fileDialogVisible = false;
            },
            onCancel() {
                this.fileDialogVisible = false;
            },
            // 选择图片
            selectImage(type, index, idx) {
                this.fileType = type;
                this.fileQIndex = index;
                this.fileAIndex = idx;
                this.showFileSelect();
            },
            // 单题保存
            singleSave(item, lastId) {
                const params = deepClone(item);
                params.lastItemId = lastId;
                params.templateId = this.templateId;
                const settingObj = {};
                params.setting.map(item => {
                    const values = Object.values(item);
                    settingObj[`${values[0]}`] = values[1];
                });
                params.setting = JSON.stringify(settingObj);
                return new Promise((resolve, reject) => {
                    save(params).then(re => {
                        const result = re.data;
                        if (result.success) {
                            this.$successMsg(this.$t('操作成功'));
                            item.id = result.data;
                            resolve();
                        } else {
                            this.$errMsg(this.$t(result.msg || '操作失败'));
                            reject();
                        }
                    });
                });
            },
            // 保存
            save() {
            }
        }
    };
</script>
