<style lang="scss">
    @import url("./style.scss");
</style>

<template>
    <article class="qgu__transfer">
        <el-row v-if="hasSearch" class="search__line">
            <el-col>
                <el-input
                    v-model.trim="keyword"
                    :placeholder="$t('antistop')"
                    size="small"
                    class="qgu__transfer__search"
                    :maxlength="20"
                />
                <el-button size="small" type="primary" @click="search">{{ $t('search') }}</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="qgu__transfer__panel qgu__transfer--left">
                <header class="qgu__tranfer__header">
                    <span class="qgu__transfer__header__title">{{ $t('waitingSelect') }}</span>
                    <div class="qgu__transfer__page">
                        <i
                            class="el-icon-caret-left qgu__transfer__page__icon qgu__transfer__page--left"
                            :class="{'disabled': leftPage.pageNo===1}"
                            @click="leftPageClick('prev')"
                        />
                        <span class="qgu__transfer__page__container">{{ leftPage.pageNo }}/{{ leftPage.totalPages }}</span>
                        <i
                            class="el-icon-caret-right qgu__transfer__page__icon qgu__transfer__page--right"
                            :class="{'disabled': leftPage.pageNo===leftPage.totalPages}"
                            @click="leftPageClick('next')"
                        />
                    </div>
                </header>
                <el-row class="qgu__transfer__titles">
                    <el-checkbox
                        v-model="leftCheckAll"
                        class="qgu__transfer__select--all"
                        :indeterminate="isLeftIndeterminate"
                        @change="handleLeftCheckAllChange"
                    />
                    <el-col v-for="item in leftFields" :key="item.code" :span="fieldWidth" class="qgu__transfer__title">
                        {{ item.name }}
                    </el-col>
                </el-row>
                <div class="qgu__transfer__list">
                    <el-checkbox-group v-model="leftChecked" @change="handleLeftCheckedChange">
                        <div v-for="(item, index) in leftData" :key="index" class="qgu__tranfer__item">
                            <el-checkbox :key="index" :label="item">
                                <el-row class="qgu__tranfer__item__line">
                                    <el-col
                                        v-for="field in leftFields"
                                        :key="field.code"
                                        class="line--ellipsis"
                                        :span="fieldWidth"
                                        :title="item[field.code]"
                                    >{{ item[field.code] || '--' }}
                                    </el-col>
                                </el-row>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
            </el-col>
            <el-col :span="4" class="qgu__transfer--center">
                <div class="qgu__tranfer__btns">
                    <div class="qgu__transfer__btn__line">
                        <el-button
                            class="qg__transfer__btn"
                            :class="{'is-disabled': btnDisabled || !leftChecked.length}"
                            :disabled="!leftChecked.length"
                            type="primary"
                            icon="el-icon-arrow-right"
                            circle
                            @click="movePre('right')"
                        />
                    </div>
                    <div v-if="canDel" class="qgu__transfer__btn__line">
                        <el-button
                            class="qg__transfer__btn"
                            :class="{'is-disabled': btnDisabled || !rightChecked.length}"
                            :disabled="!rightChecked.length"
                            type="primary"
                            icon="el-icon-arrow-left"
                            circle
                            @click="move('left')"
                        />
                    </div>
                </div>
            </el-col>
            <el-col :span="10" class="qgu__transfer__panel qgu__transfer--right">
                <header class="qgu__tranfer__header">
                    <span class="qgu__transfer__header__title">{{ $t('selected') }}({{ rightPage.total }})</span>
                    <div class="qgu__transfer__page">
                        <i
                            class="el-icon-caret-left qgu__transfer__page__icon qgu__transfer__page--left"
                            :class="{'disabled': rightPage.pageNo===1}"
                            @click="rightPageClick('prev')"
                        />
                        <span
                            class="qgu__transfer__page__container"
                        >{{ rightPage.pageNo }}/{{ rightPage.totalPages }}</span>
                        <i
                            class="el-icon-caret-right qgu__transfer__page__icon qgu__transfer__page--right"
                            :class="{'disabled': rightPage.pageNo===rightPage.totalPages}"
                            @click="rightPageClick('next')"
                        />
                    </div>
                </header>
                <el-row class="qgu__transfer__titles">
                    <el-checkbox
                        v-model="rightCheckAll"
                        class="qgu__transfer__select--all"
                        :indeterminate="isRightIndeterminate"
                        @change="handleRightCheckAllChange"
                    />
                    <el-col
                        v-for="item in rightFields"
                        :key="item.code"
                        :span="fieldWidth"
                        class="qgu__transfer__title"
                    >{{ item.name }}
                    </el-col>
                </el-row>
                <div class="qgu__transfer__list">
                    <el-checkbox-group v-model="rightChecked" @change="handleRightCheckedChange">
                        <div v-for="(item, index) in rightData" :key="index" class="qgu__tranfer__item">
                            <el-checkbox :key="index" :label="item">
                                <el-row class="qgu__tranfer__item__line">
                                    <el-col
                                        v-for="field in rightFields"
                                        :key="field.code"
                                        class="line--ellipsis"
                                        :span="fieldWidth"
                                        :title="item[field.code]"
                                    >{{ item[field.code] || '--' }}
                                    </el-col>
                                </el-row>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
            </el-col>
        </el-row>
    </article>
</template>

<script>
    import {getList, moveToLeft, moveToRight} from '@/api/transfer';

    export default {
        name: 'QguTransfer',
        props: {
            leftFields: {
                type: [Array],
                default: null
            },
            rightFields: {
                type: [Array],
                default: null
            },
            getLeftDataUrl: {
                type: [String],
                default: null
            },
            getRightDataUrl: {
                type: [String],
                default: null
            },
            optLeftUrl: {
                type: [String],
                default: null
            },
            optRightUrl: {
                type: [String],
                default: null
            },
            param: {
                type: [Object],
                default: null
            },
            hasSearch: {
                type: [Boolean],
                default: false
            },
            canDel: {
                type: [Boolean],
                default: true
            },
            showAllSelect: {
                type: [Boolean],
                default: false
            }
        },
        data() {
            const fieldWidth = Math.floor(24 / this.leftFields.length);
            return {
                fieldWidth: fieldWidth,
                leftCheckAll: false,
                leftChecked: [],
                leftData: [],
                isLeftIndeterminate: false,
                leftPage: {
                    pageNo: 1,
                    pageNum: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 10
                },
                rightCheckAll: false,
                rightChecked: [],
                rightData: [],
                isRightIndeterminate: false,
                rightPage: {
                    pageNo: 1,
                    pageNum: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 10
                },
                keyword: '',
                btnDisabled: false
            };
        },
        mounted() {
            this.getLeftList();
            this.getRightList();
        },
        methods: {
            // 获取数据
            getLeftList(condition) {
                const params = Object.assign(
                    {},
                    this.leftPage,
                    this.param,
                    condition
                );
                const url = this.getLeftDataUrl;
                getList(url, params)
                    .then(re => {
                        const data = re.data.data;
                        this.leftData = data ? data.list : [];
                        this.leftPage.pageNo = data.pageNum;
                        this.leftPage.pageNum = data.pageNum;
                        this.leftPage.pageSize = data.pageSize;
                        this.leftPage.total = data.total;
                        this.leftPage.totalPages = Math.ceil(data.total / data.pageSize);
                        this.param.id = params.id || '';
                        this.leftCheckAll = false;
                        this.isLeftIndeterminate = false;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            getRightList(condition) {
                const params = Object.assign(
                    {},
                    this.rightPage,
                    this.param,
                    condition
                );
                const url = this.getRightDataUrl;

                getList(url, params)
                    .then(re => {
                        const data = re.data.data;
                        this.rightData = data ? data.list : [];
                        this.rightPage.pageNo = data.pageNum;
                        this.rightPage.pageNum = data.pageNum;
                        this.rightPage.pageSize = data.pageSize;
                        this.rightPage.total = data.total;
                        this.rightPage.totalPages = Math.ceil(data.total / data.pageSize);
                        this.rightCheckAll = false;
                        this.isRightIndeterminate = false;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 左边单选
            handleLeftCheckedChange(value) {
                const checkedCount = value.length;
                this.leftCheckAll = checkedCount === this.leftData.length;
                this.isLeftIndeterminate =
                    checkedCount > 0 && checkedCount < this.leftData.length;
            },
            // 左边全选
            handleLeftCheckAllChange(val) {
                this.leftChecked = val && this.leftData ? this.leftData : [];
                this.isLeftIndeterminate = false;
            },
            // 左边分页点击事件
            leftPageClick(type) {
                const page = this.leftPage;
                if (type === 'prev' && page.pageNo === 1) {
                    return;
                }

                if (type === 'next' && page.pageNo === page.totalPages) {
                    return;
                }
                page.pageNo = type === 'prev' ? --page.pageNo : ++page.pageNo;
                page.pageNum = type === 'prev' ? --page.pageNum : ++page.pageNum;
                this.getLeftList(page);
            },
            // 右边单选
            handleRightCheckedChange(value) {
                const checkedCount = value.length;
                this.rightCheckAll = checkedCount === this.rightData.length;
                this.isRightIndeterminate =
                    checkedCount > 0 && checkedCount < this.rightData.length;
            },
            // 右边全选
            handleRightCheckAllChange(val) {
                this.rightChecked = val && this.rightData ? this.rightData : [];
                this.isRightIndeterminate = false;
            },
            // 右边分页
            rightPageClick(type) {
                const page = this.rightPage;
                if (type === 'prev' && page.pageNo === 1) {
                    return;
                }

                if (type === 'next' && page.pageNo === page.totalPages) {
                    return;
                }
                page.pageNo = type === 'prev' ? --page.pageNo : ++page.pageNo;
                page.pageNum = type === 'prev' ? --page.pageNum : ++page.pageNum;
                this.getRightList(page);
            },
            // 移动之前
            movePre(type) {
                if (!this.canDel) {
                    // 删除
                    this.$confirm(
                        this.$t('moveDataRemind'),
                        this.$t('warmPrompt'),
                        {
                            confirmButtonText: this.$t('sure'),
                            cancelButtonText: this.$t('cancel'),
                            type: 'warning'
                        }
                    )
                        .then(() => {
                            this.move(type);
                        })
                        .catch(() => {
                            this.$message({
                                duration: 1500,
                                type: 'info',
                                message: this.$t('deleteCancel')
                            });
                        });
                    return;
                }
                this.move(type);
            },
            // 移动函数
            move(type) {
                if (this.btnDisabled) {
                    return;
                }
                const multiSelected = type === 'right' ? this.leftChecked : this.rightChecked;
                const url = type === 'right' ? this.optLeftUrl : this.optRightUrl;
                const idArr = [];
                multiSelected.map(item => {
                    idArr.push(item.id);
                });
                this.haveChange = true;
                this.$emit('change');
                this.btnDisabled = true;
                if (type === 'left') {
                    moveToLeft(url, idArr).then(re => {
                        const result = re.data;
                        this.btnDisabled = false;
                        if (result.success) {
                            console.log(re);
                            this.$message({
                                duration: 1500,
                                type: 'success',
                                message: this.$t('mobileSuccess')
                            });
                            this.getLeftList();
                            this.getRightList();
                            this.leftChecked = [];
                            this.rightChecked = [];
                        }
                    });
                    return;
                }
                moveToRight(url, idArr).then(re => {
                    const result = re.data;
                    this.btnDisabled = false;
                    if (result.success) {
                        console.log(re);
                        this.$message({
                            duration: 1500,
                            type: 'success',
                            message: this.$t('mobileSuccess')
                        });
                        this.getLeftList();
                        this.getRightList();
                        this.leftChecked = [];
                        this.rightChecked = [];
                    }
                });
            },
            // 查询功能
            search() {
                this.param.name = this.keyword;
                this.getLeftList({pageNo: 1});
            }
        }
    };
</script>
