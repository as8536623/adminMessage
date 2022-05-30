<style lang="scss" src='./style.scss'>
</style>

<template>
    <article class="app-container cert__edit cert__detail">
        <aside class="cert__edit__preview__wrapper">
            <div class="cert__edit__preview first">
                <div class="cert__logo">{{ $t('模板') }}</div>
                <div class="cert__name">{{ editQuery.name }}</div>
                <div class="cert__remark">{{ editQuery.remark }}</div>
                <div class="cert__duration">{{ `${$t('有效期')}：${editQuery.duration}${$t('月')}` }}</div>
                <div class="cert__rule">{{ `${$t('序列号')}：${editQuery.ruleEn}${editQuery.ruleNum}` }}</div>
                <div class="cert__date">{{ editQuery.date }}</div>
                <div class="cert__org">{{ editQuery.certOrg }}</div>
            </div>
        </aside>
    </article>
</template>

<script>
    import {getCertDetail} from '@/api/cert/certInfo';
    import moment from 'moment';
    export default {
        name: 'CertDetail',
        data() {
            return {
                editQuery: {
                    id: '',
                    code: '', // 编号
                    date: '',
                    name: '', // 名称
                    categoryId: '', // 类别Id
                    categoryName: '', // 类别名称
                    certOrg: '', // 发证机构
                    duration: '', // 有效时长(月)
                    templateId: '', // 模板Id
                    ruleEn: '', // 序列号规则英文部分
                    ruleNum: '', // 序列号数字部分
                    remark: '' // 说明
                }
            };
        },
        mounted() {
            if (this.$route.query.id) {
                this.editQuery.id = this.$route.query.id;
                this.getDetail();
            }
            this.editQuery.date = moment().format('YYYY.MM.DD');
        },
        methods: {
            getDetail() {
                getCertDetail(this.editQuery.id).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.editQuery = Object.assign(this.editQuery, result.data);
                    } else {
                        this.$errorMsg(this.$t(result.msg || '获取证书数据失败'));
                    }
                });
            }
        }
    };
</script>
