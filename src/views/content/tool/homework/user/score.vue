<style lang="scss" scoped>
    @import "./style.scss";
</style>
<template>
    <article class="app-container score-container">
        <nav class="score__nav">
            <div class="nav__item">{{ $t('姓名' + '：') }}{{ user.name }}</div>
            <div class="nav__item">{{ $t('工号' + '：') }}{{ user.code }}</div>
            <div class="nav__item">{{ $t('部门' + '：') }}{{ user.orgName }}</div>
            <div class="nav__item">{{ $t('岗位' + '：') }}{{ user.positionName }}</div>
            <div class="nav__item">{{ $t('用户' + '：') }}{{ user.loginName }}</div>
        </nav>
        <div class="score__content">
            <div v-if="workUserDetail.workType === 'VIDEO'" class="score__work__item">
                <label>{{ $t('作业'+'：') }}</label>
                <div class="score__video">
                    <video
                        controls
                        width="500"
                        height="278"
                        preload
                        :src="qgFile.viewUrl"
                    />
                </div>
            </div>
            <div v-if="workUserDetail.workType === 'PICTURE_TEXT'" class="score__work__item">
                <label>{{ $t('作业'+'：') }}</label>
                <div class="score__picture">
                    <div v-if="qgFile.viewUrl" class="picture">
                        <img :src="qgFile.viewUrl" class="cover__image">
                        <div class="download" @click="download(qgFile)">
                            <svg-icon icon-class="download" class-name="search__icon"/>
                            {{ $t('下载') }}
                        </div>
                    </div>
                    <div class="desc">{{ workUserDetail.text }}</div>
                </div>
            </div>
            <div v-if="workUserDetail.workType === 'VOICE'" class="score__work__item">
                <label>{{ $t('作业'+'：') }}</label>
                <div class="score__voice">
                    <div class="vfa__item pull-left">
                        <div class="vfa__item--left">
                            <div class="vfa__item__name" :title="qgFile.name">
                                <span class="vfa__item__icon"/>
                                <span class="vfa__item__name__text">{{ qgFile.name }}</span>
                            </div>
                            <div class="vfa__item__info">
                                <span
                                    class="vfa__item__time"
                                >{{ dateFormat(workUserDetail.submitTime, 'yyyy/MM/dd') }}</span>
                                <span class="pull-right">{{ transformSecondToMS(qgFile.mediaLength) }}</span>
                            </div>
                        </div>
                        <div class="vfa__item--right">
                            <div
                                v-show="currentPlay === workUserDetail.voiceId"
                                class="vfa__item__loading active"
                                @click.stop="pause(qgFile, workUserDetail.voiceId)"
                            >
                                <svg-icon icon-class="loading_bar" class-name="vfa__loading__icon"/>
                                <span class="vfa__playing__text">播放中</span>
                            </div>
                            <div
                                v-show="currentPlay !== workUserDetail.voiceId"
                                class="vfa__item__loading"
                                @click.stop="play(qgFile, workUserDetail.voiceId)"
                            >
                                <svg-icon icon-class="play" class-name="vfa__play__icon"/>
                                <span class="vfa__playing__text">播放</span>
                            </div>
                        </div>
                    </div>
                    <div class="download" @click="download(qgFile)">
                        <svg-icon icon-class="download" class-name="search__icon"/>
                        {{ $t('下载') }}
                    </div>
                    <audio ref="audio" autoplay :src="currentSrc"/>
                </div>
            </div>
            <div v-if="workUserDetail.workType === 'DOCUMENT'" class="score__work__item">
                <label>{{ $t('作业'+'：') }}</label>
                <el-link class="score__work" type="primary" @click="preview(qgFile)">{{ qgFile.name }}</el-link>
            </div>
            <div class="score__work__btn">
                <el-form
                    ref="editQuery"
                    :model="editQuery"
                    label-width="100px"
                    :rules="rules"
                    :inline="true"
                >
                    <el-form-item
                        :label="$t('分数') + '：'"
                        prop="score"
                        :rules="[rules.required, rules.score]"
                        class="el-from__item"
                    >
                        <el-input
                            v-model.trim="editQuery.score"
                            :placeholder="$t('请输入分数')"
                            maxlength="3"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="$t('作业评语') + '：'"
                        prop="remark"
                        :rules="[rules.required]"
                    >
                        <el-input
                            v-model.trim="editQuery.remark"
                            :placeholder="$t('作业完成的不错，再接再厉哦！')"
                            maxlength="200"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSure">{{ $t('提交并返回') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </article>
</template>
<script>
    import {loadDetail, gradeAndRemark} from '@/api/workInfoUser';
    import {validateUpNumber} from '@/utils/validate';
    import {HOMEWORK_TYPE_ENUM} from '@/enum';
    import {transformSecondToMS} from '@/utils/time';
    import {dateFormat} from '@/utils';

    export default {
        name: 'HomeworkScore',
        data() {
            return {
                dateFormat,
                transformSecondToMS,
                HOMEWORK_TYPE_ENUM,
                relId: this.$route.query.relId,
                id: this.$route.query.id,
                from: this.$route.query.from,
                workId: this.$route.query.workId,
                data: {},
                user: {},
                workUserDetail: {},
                qgFile: {},
                editQuery: {
                    id: this.$route.query.id,
                    score: '',
                    remark: ''
                },
                rules: {
                    required: {
                        required: true,
                        message: this.$t('请完善必填项'),
                        trigger: 'blur'
                    },
                    score: {validator: validateUpNumber, trigger: ['blur']}
                },
                currentPlay: '',
                currentSrc: ''
            };
        },
        created() {
            this.loadDetail();
        },
        methods: {
            loadDetail() {
                loadDetail(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        this.data = result.data;
                        this.user = result.data.user;
                        this.workUserDetail = result.data.workUserDetail;
                        this.qgFile = result.data.workUserDetail ? result.data.workUserDetail.qgFile : {};
                        this.editQuery.score = result.data.score;
                        this.editQuery.remark = result.data.remark;
                    } else {
                        this.$errorMsg(this.$t(result.msg || '数据查询异常'));
                    }
                });
            },
            onSure() {
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        const params = Object.assign({}, this.editQuery);
                        params.score = Number(params.score);
                        gradeAndRemark(params).then(re => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = re.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.back();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            back() {
                if (this.from) {
                    this.$router.push({name: 'faceCourseCheck', query: {relId: this.relId, type: 'WORK'}});
                    return;
                }
                this.$router.push({
                    name: 'homeworkUser',
                    query: {id: this.workId}
                });
            },
            pause() {
                this.$refs.audio.pause();
                this.currentPlay = '';
            },
            // 音频播放
            play(item, fileId) {
                this.currentPlay = fileId;
                this.currentSrc = item.viewUrl;
            },
            // 下载
            download(data) {
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.style.display = 'none';
                link.href = data.downloadUrl;
                // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
                link.download = data.name;
                // 自触发click事件
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(data.downloadUrl);
            },
            // 文档预览
            preview(data) {
                // 获取最后一个.的位置
                const index = data.viewUrl.lastIndexOf('.');
                // 获取后缀
                const ext = data.viewUrl.substr(index + 1);
                if (ext.toLowerCase() === 'pdf') {
                    window.open(data.viewUrl);
                    return;
                }
                const pre = `https://view.officeapps.live.com/op/view.aspx?src=${data.viewUrl}`;
                window.open(pre);
            }
        }
    };
</script>
