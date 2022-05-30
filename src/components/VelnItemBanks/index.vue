<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="veln__position__select">
        <aside class="vps--left">
            <qgu-tree
                type="dialog"
                :datalist="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                @include-child-change="includeChildChange"
                @node-click="nodeClick"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="organize__tree__text">{{ data.name }}</span>
                </span>
            </qgu-tree>
        </aside>
        <div class="vps--right">
            <section class="opt__line opt__tips opt__tips__exam">
                <el-form ref="listQuery" :model="listQuery" :inline-message="true" :inline="true">
                    <el-form-item :label="$t('题库名称') + '：'">
                        <el-input v-model.trim="listQuery.bankName" type="text"/>
                    </el-form-item>
                    <el-form-item :label="$t('')">
                        <el-button type="primary" @click="search">{{ $t('筛选') }}</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <section class="vps__table__wrapper">
                <veln-item-bank-list ref="itemBank" :data="list" :active="active"/>
                <veln-transfer-page
                    v-if="showPage"
                    :total="total"
                    :page-num="listQuery.pageNum"
                    :page-size="listQuery.pageSize"
                    @current-change="pageChange"
                />
            </section>
            <section class="opt__tips opt__btn__wrapper">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('确定') }}</el-button>
            </section>
        </div>
    </article>
</template>
<script>
    import VelnTransferPage from './components/page';
    import VelnItemBankList from './components/list';
    import QguTree from '@/components/QguTree';
    import {listBankTree} from '@/api/exam/item/item';
    import {search} from '@/api/exam/item/itemBank';

    export default {
        name: 'VelnItemBanks',
        components: {
            QguTree,
            VelnTransferPage,
            VelnItemBankList
        },
        props: {
            active: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                treeData: [],
                defaultExpandedKeys: [],
                listQuery: {
                    categoryId: '*',
                    includeChild: true,
                    itemStatus: 'ENABLED',
                    itemAttribute: 'EXAM',
                    viewEqualZero: false,
                    bankName: '',
                    pageNum: 1,
                    pageSize: 6
                },
                list: [],
                total: 0,
                showPage: true
            };
        },
        created() {
            this.getTree();
        },
        methods: {
            getTree() {
                listBankTree().then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.treeData = [result.data];
                        this.listQuery.categoryId = result.data.id;
                        this.defaultExpandedKeys = [result.data.id];
                        this.getList();
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                search(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            nodeClick(data) {
                this.listQuery.categoryId = data.id;
                this.getList({pageNum: 1});
            },
            includeChildChange(includeChild) {
                this.listQuery.includeChild = includeChild;
                this.getList({pageNum: 1});
            },
            search() {
                this.getList({pageNum: 1});
            },
            // 右边分页变化
            pageChange(pageNum) {
                this.getList({pageNum: pageNum});
            },
            cancel() {
                this.$emit('close');
            },
            sure() {
                const active = this.$refs.itemBank.selectedList;
                this.$emit('select', active);
            }
        }
    };
</script>
