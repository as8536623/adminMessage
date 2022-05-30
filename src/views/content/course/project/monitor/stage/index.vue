<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="stage__detail__wrapper">
        <nav v-if="user" class="stage__detail__user">
            <div class="stage__user__info">
                <span class="stage__info__item">{{ $t('工号') }}：{{ user.code }}</span>
                <span class="stage__info__item">{{ $t('姓名') }}：{{ user.name }}</span>
                <span class="stage__info__item">{{ $t('部门') }}：{{ user.orgName }}</span>
                <span class="stage__info__item">{{ $t('岗位') }}：{{ user.positionName || $t('暂无') }}</span>
            </div>
            <div class="stage__cur__info">
                <span class="stage__info__item">{{ $t('当前阶段') }}（{{ $t('共') + stageList.length + $t('个阶段') }}）：{{ $t('第') + (curStage.stageOrder + 1) + $t('阶段') }}-{{ curStage.name }}</span>
                <el-button v-if="checkPermission('mpUserUpgradeManual')" type="primary" @click="upgradeManual">{{
                    curStage.stageOrder === stageList.length - 1 ?
                        $t('完成') : $t('升级至下一阶段') }}
                </el-button>
            </div>
        </nav>
        <section v-if="stageList.length" class="stage__detail__content">
            <div class="stage__detail__left">
                <div
                    v-for="(item, index) in stageList"
                    :key="index"
                    class="stage__item"
                    :class="{'active': index === curIndex}"
                    @click="changeStage(index)"
                >
                    {{ $t('阶段')+ (index+1) }}：{{ item.name }}
                </div>
            </div>
            <div class="stage__detail__right">
                <div v-for="(t_item, t_index) in stageList[curIndex].stageTaskList" :key="t_index">
                    <online-course
                        v-if="t_item.relType === 'REQUIRE_ONLINE_COURSE' || t_item.relType === 'OPTIONAL_ONLINE_COURSE'"
                        :task="t_item"
                    />
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import {userStageDetail} from '@/api/course/project/monitor';
    import {upgradeManual} from '@/api/course/project/stageUserRel';
    import OnlineCourse from './components/OnlineCourse';
    import checkPermission from '@/utils/permission';

    export default {
        name: 'StageDetail',
        components: {
            OnlineCourse
        },
        data() {
            return {
                userId: this.$route.query.userId,
                proId: this.$route.query.proId,
                stageList: [],
                user: null,
                curStage: null, // 当前阶段信息
                curIndex: 0 // 当前阶段index -- 可点击切换
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            checkPermission,
            init() {
                const params = {userId: this.userId, proId: this.proId};
                userStageDetail(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        const {stageList, user, curStage} = result.data;
                        this.stageList = stageList;
                        this.user = user;
                        this.curStage = curStage;
                        this.curStageHandle();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            curStageHandle() {
                this.curIndex = this.stageList.findIndex(item => {
                    return item.id === this.curStage.id;
                });
            },
            changeStage(index) {
                this.curIndex = index;
            },
            upgradeManual() {
                const params = {proId: this.proId, userId: this.userId};
                upgradeManual(params).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.$successMsg(this.$t(result.msg || '升级下一阶段成功'));
                        if (this.curIndex === this.stageList.length - 1) {
                            return;
                        }
                        this.curIndex++;
                        this.curStage = this.stageList[this.curIndex];
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            }
        }
    };
</script>
