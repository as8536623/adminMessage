<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container exam-edit-container">
        <el-form
            ref="editQuery"
            :model="editQuery"
            label-width="200px"
            :inline-message="true"
            :rules="rules"
        >
            <veln-form-section :title="$t('添加考试')" :can-expand="false">
                <veln-steps :data="steps" :active="active" @change="stepChange"/>
                <section v-if="!showMore" class="exam-basic-content">
                    <el-form-item :label="$t('监考员') + '：'">
                        <div class="person__tab__list">
                            <el-tag
                                v-for="(item, index) in editQuery.examAuthNameList"
                                :key="index"
                                type="success"
                            >{{ item }}</el-tag>
                            <el-button type="text" @click="invigilatePerson">{{ $t('选择人员') }}</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.examSetting.elt === 'LIMIT'"
                        :label="$t('考试时长') + '：'"
                        :rules="rules.numberVal"
                        prop="examSetting.el"
                    >
                        <span>
                            {{ $t('限制考试时长') }}
                            <el-input v-model.number="editQuery.examSetting.el" type="text"/>
                            {{ $t('分钟') }}
                        </span>
                    </el-form-item>
                    <el-form-item v-else :label="$t('考试时长') + '：'">{{ $t('不限制考试时长') }}</el-form-item>
                    <el-form-item
                        :label="$t('答题模式') + '：'"
                    >{{ ANSWER_MODEL_ENUM.getName(editQuery.examSetting.at) }}</el-form-item>
                    <el-form-item
                        :label="$t('补考设置') + '：'"
                    >{{ MAKE_UP_SETTING_ENUM.getName(editQuery.examSetting.mt) }}</el-form-item>
                    <el-form-item :label="$t('评卷策略') + '：'">
                        {{ MARKING_STRATEGY_ENUM.getName(editQuery.judgeSetting.jt) }}
                        <span
                            v-if="editQuery.judgeSetting.jt === 'AUTO_JUDGE'"
                            class="desc"
                        >{{ $t('适合全部为客观题的试卷，系统对客观题自动评卷，若有主观题，则记为0分') }}</span>
                    </el-form-item>
                    <el-form-item
                        :label="$t('成绩设置') + '：'"
                        :rules="rules.numberVal"
                        prop="scoreSetting.cm"
                    >
                        {{ $t('原试卷题目分数按比例折算成满分') }}
                        <el-input
                            v-model.number="editQuery.scoreSetting.cm"
                            type="text"
                            @blur="resultSetting"
                        />
                        {{ $t('分') }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('及格条件') + '：'"
                        :rules="rules.numberVal"
                        prop="scoreSetting.pr"
                    >
                        {{ $t('得分率不低于') }}
                        <el-input
                            v-model.number="editQuery.scoreSetting.pr"
                            type="text"
                            @blur="scoreSetting"
                        />
                        {{ $t('%') }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('多选/不定项评分规则') + '：'"
                    >{{ editQuery.scoreSetting.mst? SCORING_RULES_ENUM.getName(editQuery.scoreSetting.mst) : '--' }}</el-form-item>
                    <el-form-item
                        :label="$t('成绩发布设置') + '：'"
                    >{{ RESULT_PUBLISH_SETTING_ENUM.getName(editQuery.scoreSetting.spt) }}</el-form-item>
                    <el-form-item
                        :label="$t('排行榜显示设置') + '：'"
                    >{{ RANKING_LIST_SHOW_SETTING_ENUM.getName(editQuery.rankSetting.rst) }}</el-form-item>
                    <el-form-item
                        :label="$t('排行榜发布设置') + '：'"
                    >{{ RANKING_LIST_PUBLISH_ENUM.getName(editQuery.rankSetting.sht) }}</el-form-item>
                    <el-form-item
                        :label="$t('考试权限设置') + '：'"
                    >{{ editQuery.examAuthType ? EXAM_AUTH_SETTING_ENUM.getName(editQuery.examAuthType) : '--' }}</el-form-item>
                    <el-form-item
                        v-if="editQuery.preventSetting.cs || editQuery.preventSetting.no"
                        :label="$t('防舞弊设置') + '：'"
                    >
                        <section v-if="editQuery.preventSetting.cs">
                            {{ $t('切屏次数超过') }}
                            <el-form-item
                                class="el__form-inline"
                                :rules="rules.numberVal"
                                prop="preventSetting.csN"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.csN"
                                    type="text"
                                    @blur="csN"
                                />
                            </el-form-item>
                            {{ $t('次，强制交卷') }}
                        </section>
                        <div v-if="editQuery.preventSetting.no" style="margin-top: 10px;">
                            <el-form-item
                                class="el__form-inline"
                                :rules="rules.numberVal"
                                prop="preventSetting.noD"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.noD"
                                    type="text"
                                    :rules="rules.numberVal"
                                    @blur="noD"
                                />
                            </el-form-item>
                            {{ $t('分钟内，考试页面不操作算为舞弊并强制交卷') }}
                        </div>
                    </el-form-item>
                </section>
                <section v-else>
                    <veln-form-section :title="$t('基础设置')" :expand="true">
                        <el-form-item :label="$t('考试时长') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.elt">
                                <el-radio label="NO_LIMIT">
                                    {{ $t('不限制考试时长') }}
                                    <span
                                        class="desc"
                                    >{{ $t('考试结束前都可以参加考试，到达考试结束时间，自动交卷') }}</span>
                                </el-radio>
                                <div>
                                    <el-radio label="LIMIT">
                                        {{ $t('限制时长为') }}
                                        <el-form-item
                                            v-if="editQuery.examSetting.elt === 'LIMIT'"
                                            prop="examSetting.el"
                                            class="el__form-inline"
                                            :rules="rules.numberVal"
                                        >
                                            <el-input
                                                v-model.number="editQuery.examSetting.el"
                                                type="text"
                                            />
                                            {{ $t('分钟') }}
                                        </el-form-item>
                                        <div v-else class="el__form-inline">
                                            <el-input
                                                v-model.number="editQuery.examSetting.el"
                                                disabled
                                                type="text"
                                            />
                                            {{ $t('分钟') }}
                                        </div>
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('答题模式') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.at">
                                <el-radio label="ALL">{{ $t('整卷模式') }}</el-radio>
                                <div>
                                    <el-radio label="EVERY">{{ $t('逐题模式') }}</el-radio>
                                    <div style="margin-left: 25px">
                                        <el-checkbox
                                            v-model="editQuery.examSetting.ce"
                                            :disabled="editQuery.examSetting.at !== 'EVERY'"
                                        >{{ $t('允许返回修改答案') }}</el-checkbox>
                                    </div>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('补考设置') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.mt">
                                <el-radio label="NO_MAKEUP">{{ $t('不允许补考') }}</el-radio>
                                <div>
                                    <el-radio label="AUTO_MAKEUP">{{ $t('自动安排补考') }}</el-radio>
                                    {{ $t('补考次数') }}
                                    <el-form-item
                                        :rules="rules.numberVal"
                                        prop="examSetting.mn"
                                        class="el__form-inline"
                                    >
                                        <el-input
                                            v-model.number="editQuery.examSetting.mn"
                                            type="text"
                                        />
                                    </el-form-item>
                                    <span class="desc">{{ $t('补考次数为“0”时，表示不限制补考的次数') }}</span>
                                </div>
                                <div>
                                    <el-radio label="MANUAL_MAKEUP">{{ $t('手动安排补考') }}</el-radio>
                                    <span
                                        class="desc"
                                    >{{ $t('成绩发布后，管理员手工给未通过或缺考的学员安排补考，补考可以设置新的试卷和考试时间') }}</span>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('评卷策略')" :expand="false">
                        <el-form-item :label="$t('')">
                            <el-radio-group
                                v-model="editQuery.judgeSetting.jt"
                                @change="judgeSetting"
                            >
                                <el-radio label="AUTO_JUDGE">
                                    {{ $t('自动评卷') }}
                                    <span
                                        class="desc"
                                    >{{ $t('适合全部为客观题的试卷，系统对客观题自动评卷，若有主观题，则记为0分') }}</span>
                                </el-radio>
                                <div>
                                    <el-radio label="MANUAL_JUDGE_PAPER">{{ $t('人工评卷') }}</el-radio>
                                    <div style="margin-left: 25px">
                                        <!--<el-radio label="MANUAL_JUDGE_PAPER">{{$t('按试卷分配评卷人')}}</el-radio>-->
                                        <div class="person__tab__list">
                                            <el-tag
                                                v-for="(item, index) in editQuery.judgeUserRels"
                                                :key="index"
                                                type="success"
                                            >{{ item.user.name }}</el-tag>
                                            <el-button type="text" @click="judgeUser">{{ $t('选择人员') }}</el-button>
                                        </div>
                                        <div>
                                            <el-checkbox
                                                v-model="editQuery.judgeSetting.vi"
                                            >{{ $t('允许评卷人查看考生信息') }}</el-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('成绩设置')" :expand="false">
                        <el-form-item :label="$t('成绩设置') + '：'">
                            <el-radio-group v-model="editQuery.scoreSetting.st">
                                <el-radio label="CONVERT">
                                    {{ $t('原试卷题目分数按比例折算成满分') }}
                                    <el-form-item
                                        class="el__form-inline"
                                        :rules="rules.numberVal"
                                        prop="scoreSetting.cm"
                                    >
                                        <el-input
                                            v-model.number="editQuery.scoreSetting.cm"
                                            type="text"
                                            @blur="resultSetting"
                                        />
                                        {{ $t('分') }}
                                    </el-form-item>
                                </el-radio>
                                <div>
                                    <el-radio label="ORIGINAL">
                                        {{ $t('使用原试卷分数') }}
                                        {{ $t('如果使用多份试卷，每份试卷的分值可能会不一致，请仔细检查') }}
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            :label="$t('及格条件') + '：'"
                            :rules="rules.numberVal"
                            prop="scoreSetting.pr"
                        >
                            {{ $t('得分率不低于') }}
                            <el-input
                                v-model.number="editQuery.scoreSetting.pr"
                                type="text"
                                @blur="scoreSetting"
                            />
                            {{ $t('%') }}
                        </el-form-item>
                        <el-form-item :label="$t('多选/不定项评分规则') + '：'">
                            <el-radio-group v-model="editQuery.scoreSetting.mst">
                                <div v-for="(item,index) in SCORING_RULES_ENUM.arr" :key="index">
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('成绩发布设置') + '：'" class="el__form__time">
                            <el-radio-group v-model="editQuery.scoreSetting.spt">
                                <div
                                    v-for="(item, index) in RESULT_PUBLISH_SETTING_ENUM.arr"
                                    :key="index"
                                >
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                    <!--<div style="margin-left: 25px" v-if="index === 1">
                                        <el-checkbox
                                            v-model="editQuery.scoreSetting.publish"
                                        >{{$t('定时发布成绩')}}</el-checkbox>
                                        <veln-datetime
                                            v-model="editQuery.scoreSetting.pd"
                                            :minDatetime="getNow()"
                                        ></veln-datetime>
                                    </div>-->
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('考试权限设置') + '：'">
                            <el-radio-group v-model="editQuery.examAuthType">
                                <div
                                    v-for="(item, index) in EXAM_AUTH_SETTING_ENUM.arr"
                                    :key="index"
                                >
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :key="key" :title="$t('排行榜设置')" :expand="!!key">
                        <el-form-item :label="$t('排行榜显示设置') + '：'">
                            <el-radio-group v-model="editQuery.rankSetting.rst" @change="rankSettingChange">
                                <el-radio label="NO_SHOW">
                                    {{ $t('不显示考试排名') }}
                                    <span
                                        class="desc"
                                    >{{ $t('适合全部为客观题的试卷，系统对客观题自动评卷，若有主观题，则记为0分') }}</span>
                                </el-radio>
                                <div>
                                    <el-radio label="SHOW_FIRST">{{ $t('显示首次考试的排名') }}</el-radio>
                                    {{ $t('显示前') }}
                                    <el-form-item
                                        class="el__form-inline"
                                        :rules="rules.numberVal"
                                        prop="rankSetting.rsn"
                                    >
                                        <el-input
                                            v-model.number="editQuery.rankSetting.rsn"
                                            type="text"
                                        />
                                    </el-form-item>
                                    {{ $t('名的排名情况') }}
                                    <span class="desc">{{ $t('不填则显示全部排名') }}</span>
                                </div>
                                <div style="margin-top: 5px">
                                    <el-radio label="SHOW_MAX">{{ $t('显示最高成绩的排名') }}</el-radio>
                                    {{ $t('显示前') }}
                                    <el-form-item
                                        class="el__form-inline"
                                        :rules="rules.numberVal"
                                        prop="rankSetting.rsn2"
                                    >
                                        <el-input
                                            v-model.number="editQuery.rankSetting.rsn2"
                                            type="text"
                                        />
                                    </el-form-item>
                                    {{ $t('名的排名情况') }}
                                    <span class="desc">{{ $t('不填则显示全部排名') }}</span>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="editQuery.rankSetting.rst !== 'NO_SHOW'" :label="$t('排行榜发布设置') + '：'">
                            <el-radio-group v-model="editQuery.rankSetting.sht">
                                <div
                                    v-for="(item, index) in RANKING_LIST_PUBLISH_ENUM.arr"
                                    :key="index"
                                >
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('防舞弊设置')" :expand="false">
                        <!--<el-form-item :label="$t('')">
                            <el-checkbox
                                v-model="editQuery.preventSetting.sv"
                            >{{$t('进入考试时需要短信验证身份')}}</el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.rc">{{$t('开启实时摄像抓拍的功能')}}</el-checkbox>
                        </el-form-item>-->
                        <!--<el-form-item :label="$t('')">-->
                        <!--<el-checkbox v-model="editQuery.preventSetting.jk">{{$t('开启远程监控的功能')}}</el-checkbox>-->
                        <!--<span class="desc__tips">{{$t('*该功能需付费开通，如需开通，请联系13855167015')}}</span>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item :label="$t('')">-->
                        <!--<el-checkbox v-model="editQuery.preventSetting.fa">{{$t('开启人脸识别功能')}}</el-checkbox>-->
                        <!--<span class="desc">{{$t('此为APP端功能')}}</span>-->
                        <!--</el-form-item>-->
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.cs">{{ $t('切屏次数超过') }}</el-checkbox>
                            <el-form-item
                                class="el__form-inline"
                                :rules="rules.numberVal"
                                prop="preventSetting.csN"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.csN"
                                    type="text"
                                    @blur="csN"
                                />
                            </el-form-item>
                            {{ $t('次，强制交卷') }}
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.no">
                                <el-form-item
                                    class="el__form-inline"
                                    :rules="rules.numberVal"
                                    prop="preventSetting.noD"
                                >
                                    <el-input
                                        v-model.number="editQuery.preventSetting.noD"
                                        type="text"
                                        @blur="noD"
                                    />
                                </el-form-item>
                                {{ $t('分钟内，考试页面不操作算为舞弊并强制交卷') }}
                            </el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('')">-->
                        <!--<el-checkbox v-model="editQuery.preventSetting.lt">-->
                        <!--{{$t('迟到')}}-->
                        <!--<el-form-item-->
                        <!--class="el__form-inline"-->
                        <!--:rules="rules.numberVal"-->
                        <!--prop="preventSetting.ltD"-->
                        <!--&gt;-->
                        <!--<el-input-->
                        <!--type="text"-->
                        <!--v-model.number="editQuery.preventSetting.ltD"-->
                        <!--@blur="ltD"-->
                        <!--&gt;</el-input>-->
                        <!--</el-form-item>-->
                        <!--{{$t('分钟后禁止参加考试')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.bs">
                                {{ $t('答卷时间少于') }}
                                <el-form-item
                                    class="el__form-inline"
                                    :rules="rules.numberVal"
                                    prop="preventSetting.bsD"
                                >
                                    <el-input
                                        v-model.number="editQuery.preventSetting.bsD"
                                        type="text"
                                        @blur="bsD"
                                    />
                                </el-form-item>
                                {{ $t('分钟禁止交卷') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-checkbox
                                v-model="editQuery.preventSetting.ri"
                            >{{ $t('生成试卷时打乱相同题型下的试题的顺序以及试题选项的顺序') }}</el-checkbox>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('考试消息设置')" :expand="false">
                        <el-form-item :label="$t('考试通知') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.M">{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.S">{{ $t('电子邮件') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.E">{{ $t('手机短信') }}</el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('考试作废通知') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.M">{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.S">{{ $t('电子邮件') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.E">{{ $t('手机短信') }}</el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('考试移除人员通知') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.M">{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.S">{{$t('电子邮件')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.E">{{$t('手机短信')}}</el-checkbox>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item :label="$t('考试结束时间变更') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.M">{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.S">{{$t('电子邮件')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.E">{{$t('手机短信')}}</el-checkbox>-->
                        <!--</el-form-item>-->
                        <el-form-item :label="$t('发布成绩') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.M">{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.S">{{ $t('电子邮件') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.E">{{ $t('手机短信') }}</el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('补考通知') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.M">{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.S">{{$t('电子邮件')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.E">{{$t('手机短信')}}</el-checkbox>-->
                        <!--</el-form-item>-->
                    </veln-form-section>
                </section>
            </veln-form-section>
            <section v-if="!showMore" class="form__page__btn">
                <el-button type="primary" @click="showMore = true">{{ $t('更多设置') }}</el-button>
            </section>
            <section class="form__page__btn">
                <el-button @click="cancel">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="last">{{ $t('上一步') }}</el-button>
                <el-button type="primary" @click="sure">{{ $t('保存') }}</el-button>
            </section>
        </el-form>
        <el-dialog
            v-if="dgpDialogVisible"
            append-to-body
            :title="$t('选择人员')"
            :visible.sync="dgpDialogVisible"
            width="939px"
            @close="handleUserClose"
        >
            <veln-dgp-user
                ref="dgpUser"
                :route="route"
                :fun-code="funCode"
                :fun-id="editQuery.exam.id"
                :app-code="$appCodes.pe + '/pe'"
                @onClose="dgpClose"
            />
        </el-dialog>
    </article>
</template>
<script>
    import VelnFormSection from '@/components/VelnFormSection';
    import VelnSteps from '@/components/VelnSteps';
    import VelnDgpUser from '@/components/VelnDgpUser';
    import {validateInteger} from '@/utils/validate';
    import {
        REMINDER_ENUM,
        SCORING_RULES_ENUM,
        EXAM_AUTH_SETTING_ENUM,
        RANKING_LIST_SHOW_SETTING_ENUM,
        RANKING_LIST_PUBLISH_ENUM,
        RESULT_PUBLISH_SETTING_ENUM,
        MARKING_STRATEGY_ENUM,
        MAKE_UP_SETTING_ENUM,
        ANSWER_MODEL_ENUM
    } from '@/enum';
    import {saveSetting, getSettingInfo} from '@/api/exam/exam/exam';
    import moment from 'moment';

    export default {
        name: 'ExamSetting',
        components: {
            VelnFormSection,
            VelnSteps,
            VelnDgpUser
        },
        data() {
            const steps = [
                {
                    title: this.$t('基本信息'),
                    status: 'done',
                    disabled: false
                },
                {
                    title: this.$t('考试设置'),
                    status: 'wait',
                    disabled: true
                }
            ];
            return {
                validateInteger,
                REMINDER_ENUM,
                SCORING_RULES_ENUM,
                EXAM_AUTH_SETTING_ENUM,
                RANKING_LIST_SHOW_SETTING_ENUM,
                RANKING_LIST_PUBLISH_ENUM,
                RESULT_PUBLISH_SETTING_ENUM,
                MARKING_STRATEGY_ENUM,
                MAKE_UP_SETTING_ENUM,
                ANSWER_MODEL_ENUM,
                editQuery: {
                    checkList: [],
                    exam: {
                        id: this.$route.query.id,
                        examType: 'ONLINE',
                        sourceId: this.$route.query.sourceId, // 面授课程
                        source: this.$route.query.source, // 面授课程
                        finish: true
                    },
                    examSetting: {
                        // 基础设置
                        elt: 'NO_LIMIT',
                        el: '',
                        at: 'ALL',
                        ce: false,
                        mt: 'NO_MAKEUP',
                        mn: 0
                    },
                    judgeSetting: {
                        // 评卷策略
                        jt: 'AUTO_JUDGE',
                        vi: false,
                        distr: false
                    },
                    scoreSetting: {
                        // 成绩设置
                        st: 'CONVERT',
                        cm: 100,
                        pr: 60,
                        mst: 'LESS_SELECT_NO_SCORE',
                        spt: 'JUDGED_AUTO_PUBLISH',
                        pd: '',
                        publish: false
                    },
                    examAuthType: 'NO_SEE',
                    rankSetting: {
                        // 排行榜设置
                        rst: 'NO_SHOW',
                        sht: 'SHOW_MARK',
                        rsn: 10,
                        rsn2: 10
                    },
                    preventSetting: {
                        // 防舞弊设置
                        sv: false,
                        rc: false,
                        cs: false,
                        csN: 3,
                        no: false,
                        noD: 5,
                        lt: false,
                        ltD: 10,
                        bs: false,
                        bsD: 3,
                        ri: false,
                        jk: false,
                        fa: false
                    },
                    messageSetting: {
                        eMsg: {
                            M: false,
                            S: false,
                            E: false
                        },
                        caMsg: {
                            M: false,
                            S: false,
                            E: false
                        },
                        reMsg: {
                            M: false,
                            S: false,
                            E: false
                        },
                        eeMsg: {
                            M: false,
                            S: false,
                            E: false
                        },
                        pmMsg: {
                            M: false,
                            S: false,
                            E: false
                        },
                        muMsg: {
                            M: false,
                            S: false,
                            E: false
                        }
                    }
                },
                active: 0,
                steps,
                showMore: false,
                rules: {
                    required: [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        }
                    ],
                    numberVal: [
                        {
                            type: 'number',
                            message: this.$t('必须为数字值')
                        },
                        {
                            validator: validateInteger,
                            trigger: 'blur'
                        }
                    ],
                    'examSetting.el': [
                        {
                            required: true,
                            message: this.$t('请完善必填项'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'}
                    ]
                },
                dgpDialogVisible: false,
                route: '',
                funCode: '',
                key: null
            };
        },
        created() {
            this.init();
        },
        methods: {
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            },
            init() {
                if (this.$route.query.id) {
                    this.getSettingInfo();
                    this.steps.map(step => {
                        step.status = 'done';
                        step.disabled = false;
                    });
                }
            },
            cancel() {
                const sourceId = this.$route.query.sourceId;
                if (sourceId) {
                    if (this.$route.query.quick) {
                        this.$router.push({
                            name: 'quickInteraction',
                            query: {id: sourceId}
                        });
                    } else {
                        this.$router.push({
                            name: 'courseInteraction',
                            query: {id: sourceId}
                        });
                    }
                }
            },
            sure() {
                console.log(this.editQuery);
                if (this.editQuery.scoreSetting.publish) {
                    if (!this.editQuery.scoreSetting.pd) {
                        this.$warnMsg(
                            this.$t('成绩发布设置，手动定时发布成绩时间不可为空')
                        );
                        return;
                    }
                }
                if (this.editQuery.rankSetting.rst === 'SHOW_MAX') {
                    this.editQuery.rankSetting.rsn = this.editQuery.rankSetting.rsn2;
                }
                this.$refs.editQuery.validate(valid => {
                    if (valid) {
                        if (this.$store.getters.ajaxIng) {
                            return;
                        }
                        this.$store.dispatch('setAjaxIng', true);
                        this.editQuery.exam.sourceId = this.$route.query.sourceId;
                        this.editQuery.exam.source = this.$route.query.source;
                        this.editQuery.exam.finish = true;
                        saveSetting(this.editQuery).then(res => {
                            this.$store.dispatch('setAjaxIng', false);
                            const result = res.data;
                            if (result.success) {
                                this.$successMsg(this.$t('保存成功'));
                                this.cancel();
                            } else {
                                this.$errorMsg(this.$t(result.msg || '保存失败'));
                            }
                        });
                    }
                });
            },
            // 编辑回显
            getSettingInfo() {
                getSettingInfo(this.$route.query.id).then(res => {
                    const result = res.data;
                    if (result.success) {
                        console.log(this.editQuery);
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            result.data
                        );
                        if (this.editQuery.scoreSetting.pd) {
                            this.editQuery.scoreSetting.publish = true;
                        }
                        this.editQuery.sourceId = this.$route.query.sourceId;
                        this.editQuery.preventSetting.bsD =
                            this.editQuery.preventSetting.bsD || 3;
                        this.editQuery.preventSetting.ltD =
                            this.editQuery.preventSetting.ltD || 10;
                        this.editQuery.preventSetting.csN =
                            this.editQuery.preventSetting.csN || 3;
                        this.editQuery.preventSetting.noD =
                            this.editQuery.preventSetting.noD || 5;
                        if (this.editQuery.rankSetting.rst === 'SHOW_MAX') {
                            this.editQuery.rankSetting.rsn2 = this.editQuery.rankSetting.rsn;
                        } else {
                            this.editQuery.rankSetting.rsn2 = 10;
                            this.editQuery.rankSetting.rsn = 10;
                        }
                    } else {
                        this.$errorMsg(result.msg || this.$t('数据查询失败'));
                    }
                });
            },
            // 监考人员
            invigilatePerson() {
                this.route = 'examAuth';
                this.funCode = 'MANAGER_USER';
                this.dgpDialogVisible = true;
            },
            // 评卷人员
            judgeUser() {
                if (this.editQuery.judgeSetting.jt === 'MANUAL_JUDGE_PAPER') {
                    this.route = 'judgeUser';
                    this.funCode = 'JUDGE_PAPER_USER';
                    this.dgpDialogVisible = true;
                }
            },
            handleUserClose() {
                this.dgpDialogVisible = false;
            },
            dgpClose() {
                this.getSettingInfo();
                this.editQuery.judgeUserRels = [];
                Array.isArray(this.$refs.dgpUser.rightData) && this.$refs.dgpUser.rightData.map(item => {
                    const data = {
                        user: {
                            name: item.name,
                            id: item.id
                        }
                    };
                    this.editQuery.judgeUserRels.push(data);
                });
                this.dgpDialogVisible = false;
            },
            stepChange(index) {
                switch (index) {
                    case 0:
                        this.last();
                        break;
                }
            },
            last() {
                const sourceId = this.$route.query.sourceId;
                this.$router.push({
                    name: 'faceExamBase',
                    query: {
                        id: this.$route.query.id,
                        sourceId,
                        source: this.editQuery.source
                    }
                });
            },
            // 评卷策略
            judgeSetting() {},
            // 成绩设置
            resultSetting() {
                if (!this.editQuery.scoreSetting.cm) {
                    this.editQuery.scoreSetting.cm = 100;
                }
            },
            // 得分率设置
            scoreSetting() {
                if (!this.editQuery.scoreSetting.pr) {
                    this.editQuery.scoreSetting.pr = 60;
                }
            },
            // 切屏
            csN() {
                if (!this.editQuery.preventSetting.csN) {
                    this.editQuery.preventSetting.csN = 3;
                }
            },
            noD() {
                if (!this.editQuery.preventSetting.noD) {
                    this.editQuery.preventSetting.noD = 5;
                }
            },
            ltD() {
                if (!this.editQuery.preventSetting.ltD) {
                    this.editQuery.preventSetting.ltD = 10;
                }
            },
            bsD() {
                if (!this.editQuery.preventSetting.bsD) {
                    this.editQuery.preventSetting.bsD = 3;
                }
            },
            rankSettingChange(e) {
                this.key = +new Date();
                this.$forceUpdate();
            }
        }
    };
</script>
