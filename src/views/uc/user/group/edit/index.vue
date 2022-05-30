<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="form__page group__member">
        <veln-steps :data="steps" :active="active" @change="stepChange"/>
        <base-info v-if="active === 0" :type="type" :info="data" @next="next"/>
        <group-member
            v-if="active === 1"
            :group-id="groupId"
            :type="type"
            :gcp-list="data.gcpList"
            :org-id-name-map="data.orgIdNameMap"
            :pos-id-name-map="data.posIdNameMap"
            @next="next"
            @last="last"
        />
        <member-list v-if="active === 2" :group-id="groupId"/>
    </article>
</template>

<script>
    import BaseInfo from './baseInfo';
    import GroupMember from './groupMember';
    import MemberList from './memberList';
    import VelnSteps from '@/components/VelnSteps';
    import {getGroupDetail} from '@/api/group';

    export default {
        name: 'GroupEdit',
        components: {
            BaseInfo,
            GroupMember,
            MemberList,
            VelnSteps
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'wait',
                    disabled: false
                },
                {
                    title: this.$t('身份验证'),
                    status: 'wait',
                    disabled: true
                },
                {
                    title: this.$t('群组人员'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                steps,
                active: 0,
                groupId: '',
                stepKey: new Date().getTime(),
                activeType: '',
                type: '',
                step: '1',
                data: {},
                marketTime: {}
            };
        },
        watch: {
            activeType(cur, old) {
                this.stepKey += new Date().getTime();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$route.query.id) {
                    this.groupId = this.$route.query.id;
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                    this.getDetail();
                } else {
                    this.steps.pop();
                }
                if (this.$route.query.type) {
                    this.type = this.$route.query.type;
                }
            },
            getDetail() {
                if (!this.groupId) {
                    return;
                }
                getGroupDetail(this.groupId).then(res => {
                    if (res.data.success) {
                        this.data = res.data.data;
                    } else {
                        this.$message.error(this.$t('获取详情失败'));
                        this.$router.back();
                    }
                });
            },
            setTime(data) {
                this.marketTime[data.name] = data;
            },
            // 下一步
            next(groupId, formData) {
                if (groupId) {
                    this.groupId = groupId;
                }
                this.data = Object.assign({}, this.data, formData);
                this.active = 1;
                this.steps[0].status = 'done';
                this.steps[1].disabled = false;
            },
            // 上一步
            last() {
                this.active = 0;
            },
            stepChange(index) {
                this.active = index;
            }
        }
    };
</script>
