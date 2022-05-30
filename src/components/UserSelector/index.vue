<style lang="scss" src="./style.scss">
</style>

<template>
    <el-dialog
        v-if="dialogVisible"
        top="5vh"
        append-to-body
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="800px"
        @close="hide"
        @opened="opened"
    >
        <section class="dialog__form__container">
            <search-input
                v-if="showSearch"
                v-model="listQuery.keywords"
                class="course__search"
                :placeholder="$t('输入用户编号/姓名/帐号搜索')"
                @enter="search"
            />
            <qg-table
                ref="noticeListTable"
                :columns="tableColumns"
                :param="listQuery"
                :request="listRequest"
                @selection-change="selectionChange"
            />
        </section>
        <div class="dialog__btn__line">
            <el-button @click="hide">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {searchUser} from '@/api/userComponent';
    import {mapGetters} from 'vuex';
    import {commonPost} from '@/api/common/common';

    export default {
        name: 'VueTemplate',
        props: {
            title: {
                type: String,
                default: '人员选择'
            },
            url: {
                type: String,
                default: ''
            },
            showSearch: {
                type: Boolean,
                default: false
            },
            tableColumns: {
                type: Array,
                default() {
                    return [];
                }
            },
            extraParam: {
                type: Object,
                default: null
            }
        },
        data() {
            const defaultQueryObj = {
                category: true,
                keywords: '',
                relId: '',
                optType: 'USER',
                relType: '',
                route: '',
                funCode: '',
                appCode: '',
                funId: '',
                multiColumnSelector: true
            };

            return {
                dialogVisible: false,
                listQuery: Object.assign({}, defaultQueryObj, this.extraParam),
                list: [],
                total: 0,
                multiSelection: [],
                listRequest: searchUser
            };
        },
        computed: {
            ...mapGetters(['selectedIds'])
        },
        mounted() {
            if (this.$route.query.id) {
                this.listQuery.proId = this.$route.query.id;
            }
        },
        methods: {
            search() {
                this.$refs.noticeListTable.load(this.listQuery);
            },
            show() {
                this.dialogVisible = true;
            },
            hide() {
                this.dialogVisible = false;
                this.multiSelection = [];
                this.listQuery.keywords = '';
            },
            searchUser(params) {
                searchUser(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            commonPost(params) {
                commonPost(this.url, params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                    } else {
                        this.$errorMsg(result.msg || '数据查询异常');
                    }
                });
            },

            selectionChange(v) {
                this.multiSelection = v;
                console.log('this.multiSelection: ', this.multiSelection);
            },
            save() {
                if (!Array.isArray(this.multiSelection) || !this.multiSelection.length) {
                    this.hide();
                    return;
                }

                const list = [];
                let ids = this.selectedIds;
                this.multiSelection.map(item => {
                    ids.push(item.id);
                    list.push(item);
                });

                ids = [...new Set(ids)];
                this.$store.commit('SET_SELECTED_USER_IDS', ids);

                this.$emit('select', list);
                this.hide();
            },
            opened() {
                this.search();
            }
        }
    };
</script>
