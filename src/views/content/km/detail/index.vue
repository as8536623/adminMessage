<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="km__detail">
        <div class="km__content">
            <header class="km__title">{{ knowledge.name }}</header>
            <p class="km__sub">
                <span class="km__sub__item">{{ $t('作者') }}：{{ knowledge.author }}</span>
                <span class="km__sub__item">{{ knowledge.createdAt }}</span>
                <span class="km__sub__item">{{ $t('阅读') }}（{{ knowledge.viewCount }}）</span>
            </p>
            <km-image
                v-if="knowledgeItemList.length && knowledge.type === 'image'"
                :list="knowledgeItemList"
            />
            <km-video
                v-if="knowledgeItemList.length && knowledge.type === 'video'"
                :list="knowledgeItemList"
            />
            <km-doc
                v-if="knowledge.type === 'DOC'"
                :view-url="knowledge.viewUrl"
                :corp-code="knowledge.corpCode"
            />
            <nav class="view__nav">
                <div
                    v-for="(item, index) in NAV_TYPE"
                    :key="index"
                    class="view__nav__item pull-left"
                    :class="{'active': listQuery.type===item.code}"
                    @click="changeType(item.code)"
                >{{ $t(item.name) }}({{ userCount[item.code] }})
                </div>
            </nav>
            <qgu-table
                class="km__detail__table"
                :columns="tableColumns"
                :data="list"
                :page="listQuery"
                :total="total"
                :loading="listLoading"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <aside class="km__info">
            <header class="km__info__header">{{ $t('基本信息') }}</header>
            <ul class="km__info__list">
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('创建者') }}</span>
                    <div class="km__info__text">{{ knowledge.userName }}</div>
                </li>
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('所属部门') }}</span>
                    <div class="km__info__text">{{ knowledge.orgName }}</div>
                </li>
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('录入时间') }}</span>
                    <div class="km__info__text">{{ knowledge.createdAt }}</div>
                </li>
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('文档状态') }}</span>
                    <div class="km__info__text">{{ COMMON_STATUS_ENUM.getName(knowledge.status) }}</div>
                </li>
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('文档编号') }}</span>
                    <div class="km__info__text">{{ knowledge.code }}</div>
                </li>
                <li class="km__info__line">
                    <span class="km__info__label pull-left">{{ $t('所属分类') }}</span>
                    <div class="km__info__text">{{ knowledge.categoryName }}</div>
                </li>
            </ul>
        </aside>
    </article>
</template>

<script>
    import {getKnowledge} from '@/api/km/knowledge';
    import {searchUsers} from '@/api/km/statisticsUserRel';
    import {getStatisticsUser} from '@/api/km/statistics';
    import {COMMON_STATUS_ENUM} from '@/enum';
    import KmImage from './components/KmImage';
    import KmDoc from './components/KmDoc';
    import KmVideo from './components/KmVideo';

    export default {
        name: 'KmDetail',
        components: {
            KmImage,
            KmDoc,
            KmVideo
        },
        data() {
            const tableColumns = [
                {
                    field: 'index',
                    text: this.$t('序号'),
                    minWidth: 60,
                    render: (h, param) => {
                        const index = param.index;
                        return index + 1;
                    }
                },
                {
                    field: 'userName',
                    text: this.$t('阅读人'),
                    minWidth: 100,
                    render: (h, param) => {
                        const {userName} = param.row;
                        return userName || this.$t('游客');
                    }
                },
                {
                    field: 'createdAt',
                    text: this.$t('阅读时间'),
                    minWidth: 150
                },
                {
                    field: 'orgName',
                    text: this.$t('部门'),
                    minWidth: 150
                }
            ];

            const NAV_TYPE = [
                {code: 'VIEW', name: this.$t('浏览记录')},
                {code: 'COLLECT', name: this.$t('收藏记录')},
                {code: 'DOWNLOAD', name: this.$t('下载记录')},
                {code: 'AGREE', name: this.$t('点赞记录')}
            ];
            return {
                NAV_TYPE,
                COMMON_STATUS_ENUM,
                tableColumns,
                total: 0,
                list: [],
                listLoading: false,
                knowledgeItemList: [],
                knowledge: {
                    type: '',
                    createdAt: '',
                    author: '',
                    status: 'ENABLED',
                    code: '',
                    name: '',
                    orgName: '',
                    viewCount: 0,
                    userName: '',
                    categoryName: '',
                    viewUrl: '',
                    corpCode: ''
                },
                listQuery: {
                    knowledgeId: '',
                    type: 'VIEW',
                    pageNum: 1,
                    pageSize: 10
                },
                userCount: {
                    viewCount: 0,
                    collectCount: 0,
                    agreeCount: 0,
                    downloadCount: 0
                }
            };
        },
        mounted() {
            this.init();
            const id = this.$route.query.id;
            if (id) {
                this.listQuery.knowledgeId = id;
                this.getKnowledge();
                this.getStatisticsUser();
                this.getList();
            }
        },
        destroyed() {
            document
                .querySelector('.content__container')
                .classList.remove('bg--gray');
        },
        methods: {
            init() {
                document
                    .querySelector('.content__container')
                    .classList.add('bg--gray');
            },
            getStatisticsUser() {
                const params = {knowledgeId: this.listQuery.knowledgeId};
                getStatisticsUser(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        const {
                            viewCount,
                            collectCount,
                            agreeCount,
                            downloadCount
                        } = result.data;
                        this.userCount = {
                            VIEW: viewCount,
                            COLLECT: collectCount,
                            AGREE: agreeCount,
                            DOWNLOAD: downloadCount
                        };
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取数据失败'));
                    }
                });
            },
            getKnowledge() {
                const params = {id: this.listQuery.knowledgeId};
                getKnowledge(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        console.log(result.data);
                        const {
                            type,
                            knowledgeItemList,
                            createdAt,
                            author,
                            status,
                            code,
                            name,
                            viewCount,
                            orgName,
                            userName,
                            categoryName,
                            viewUrl,
                            corpCode
                        } = result.data;
                        this.knowledgeItemList = knowledgeItemList;
                        this.knowledge = {
                            type,
                            createdAt,
                            author,
                            status,
                            code,
                            name,
                            orgName,
                            viewCount,
                            userName,
                            categoryName,
                            viewUrl,
                            corpCode
                        };
                        console.log(this.knowledge.type);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取资料失败'));
                    }
                });
            },
            getList(condition) {
                const params = Object.assign({}, this.listQuery, condition);
                this.listLoading = true;
                searchUsers(params).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        this.list = result.data.list || [];
                        this.total = result.data.total;
                        this.listLoading = false;
                        this.listQuery.pageNum = params.pageNum;
                        this.listQuery.pageSize = params.pageSize;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            search() {
                this.getList({pageNum: 1});
            },
            handleSizeChange(v) {
                this.getList({pageNum: 1, pageSize: v});
            },
            handleCurrentChange(v) {
                this.getList({pageNum: v});
            },
            changeType(type) {
                this.listQuery.type = type;
                this.getList({pageNum: 1});
            }
        }
    };
</script>
