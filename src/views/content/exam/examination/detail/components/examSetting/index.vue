<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="app-container examination-container  exam-arrange-container">
        <el-form
            :model="editQuery"
            label-width="200px"
        >
            <section v-if="this.$route.query.examType === 'ONLINE'" class="exam-basic-content">
                <section v-if="!showMore">
                    <el-form-item
                        v-if="editQuery.examSetting.elt === 'LIMIT'"
                        :label="$t('考试时长') + '：'"
                    >
                        <span>
                            {{ $t('限制考试时长') }}
                            <el-input v-model.number="editQuery.examSetting.el" type="text" disabled/>
                            {{ $t('分钟') }}
                        </span>
                    </el-form-item>
                    <el-form-item v-else :label="$t('考试时长') + '：'">{{ $t('不限制考试时长') }}</el-form-item>
                    <el-form-item
                        :label="$t('答题模式') + '：'"
                    >{{ ANSWER_MODEL_ENUM.getName(editQuery.examSetting.at) }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('补考设置') + '：'"
                    >{{ MAKE_UP_SETTING_ENUM.getName(editQuery.examSetting.mt) }}
                    </el-form-item>
                    <el-form-item :label="$t('评卷策略') + '：'">
                        {{ MARKING_STRATEGY_ENUM.getName(editQuery.judgeSetting.jt) }}
                        <span
                            v-if="editQuery.judgeSetting.jt === 'AUTO_JUDGE'"
                            class="desc"
                        >{{ $t('适合全部为客观题的试卷，系统对客观题自动评卷，若有主观题，则记为0分') }}</span>
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.scoreSetting.st === 'CONVERT'"
                        :label="$t('成绩设置') + '：'"
                    >
                        {{ $t('原试卷题目分数按比例折算成满分') }}
                        <el-input
                            v-model.number="editQuery.scoreSetting.cm"
                            type="text"
                            disabled
                        />
                        {{ $t('分') }}
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.scoreSetting.st === 'ORIGINAL'"
                        :label="$t('成绩设置') + '：'"
                    >
                        {{ $t('使用原试卷分数如果使用多份试卷，每份试卷的分值可能会不一致，请仔细检查') }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('及格条件') + '：'"
                    >
                        {{ $t('得分率不低于') }}
                        <el-input
                            v-model.number="editQuery.scoreSetting.pr"
                            type="text"
                            disabled
                        />
                        {{ $t('%') }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('多选/不定项评分规则') + '：'"
                    >{{ editQuery.scoreSetting.mst? SCORING_RULES_ENUM.getName(editQuery.scoreSetting.mst) : '--' }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('成绩发布设置') + '：'"
                    >{{ RESULT_PUBLISH_SETTING_ENUM.getName(editQuery.scoreSetting.spt) }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('排行榜显示设置') + '：'"
                    >{{ RANKING_LIST_SHOW_SETTING_ENUM.getName(editQuery.rankSetting.rst) }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('排行榜发布设置') + '：'"
                    >{{ RANKING_LIST_PUBLISH_ENUM.getName(editQuery.rankSetting.sht) }}
                    </el-form-item>
                    <el-form-item
                        :label="$t('考试权限设置') + '：'"
                    >{{ editQuery.examAuthType ? EXAM_AUTH_SETTING_ENUM.getName(editQuery.examAuthType) : '--' }}
                    </el-form-item>
                    <el-form-item
                        v-if="editQuery.preventSetting.cs || editQuery.preventSetting.no"
                        :label="$t('防舞弊设置') + '：'"
                    >
                        <section v-if="editQuery.preventSetting.cs">
                            {{ $t('切屏次数超过') }}
                            <el-form-item
                                class="el__form-inline"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.csN"
                                    type="text"
                                    disabled
                                />
                            </el-form-item>
                            {{ $t('次，强制交卷') }}
                        </section>
                        <div v-if="editQuery.preventSetting.no" style="margin-top: 10px;">
                            <el-form-item
                                class="el__form-inline"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.noD"
                                    type="text"
                                    disabled
                                />
                            </el-form-item>
                            {{ $t('分钟内，考试页面不操作算为舞弊并强制交卷') }}
                        </div>
                    </el-form-item>
                </section>
                <section v-else>
                    <veln-form-section :title="$t('基础设置')" :expand="true">
                        <el-form-item :label="$t('考试时长') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.elt" disabled>
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
                                            class="el__form-inline"
                                        >
                                            <el-input
                                                v-model.number="editQuery.examSetting.el"
                                                type="text"
                                                disabled
                                            />
                                            {{ $t('分钟') }}
                                        </el-form-item>
                                        <div v-else class="el__form-inline">
                                            <el-input
                                                v-model.number="editQuery.examSetting.el"
                                                type="text"
                                                disabled
                                            />
                                            {{ $t('分钟') }}
                                        </div>
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('答题模式') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.at" disabled>
                                <el-radio label="ALL">{{ $t('整卷模式') }}</el-radio>
                                <div>
                                    <el-radio label="EVERY">{{ $t('逐题模式') }}</el-radio>
                                    <div style="margin-left: 25px">
                                        <el-checkbox
                                            v-model="editQuery.examSetting.ce"
                                            disabled
                                        >{{ $t('允许返回修改答案') }}
                                        </el-checkbox>
                                    </div>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('补考设置') + '：'">
                            <el-radio-group v-model="editQuery.examSetting.mt" disabled>
                                <el-radio label="NO_MAKEUP">{{ $t('不允许补考') }}</el-radio>
                                <div>
                                    <el-radio label="AUTO_MAKEUP">{{ $t('自动安排补考') }}</el-radio>
                                    {{ $t('补考次数') }}
                                    <el-form-item
                                        class="el__form-inline"
                                    >
                                        <el-input
                                            v-model.number="editQuery.examSetting.mn"
                                            type="text"
                                            disabled
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
                                disabled
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
                                            >{{ item.user.name }}
                                            </el-tag>
                                        </div>
                                        <div>
                                            <el-checkbox
                                                v-model="editQuery.judgeSetting.vi"
                                                disabled
                                            >{{ $t('允许评卷人查看考生信息') }}
                                            </el-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('成绩设置')" :expand="false">
                        <el-form-item :label="$t('成绩设置') + '：'">
                            <el-radio-group v-model="editQuery.scoreSetting.st" disabled>
                                <el-radio label="CONVERT">
                                    {{ $t('原试卷题目分数按比例折算成满分') }}
                                    <el-form-item
                                        class="el__form-inline"
                                    >
                                        <el-input
                                            v-model.number="editQuery.scoreSetting.cm"
                                            type="text"
                                            disabled
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
                        >
                            {{ $t('得分率不低于') }}
                            <el-input
                                v-model.number="editQuery.scoreSetting.pr"
                                type="text"
                                disabled
                            />
                            {{ $t('%') }}
                        </el-form-item>
                        <el-form-item :label="$t('多选/不定项评分规则') + '：'">
                            <el-radio-group v-model="editQuery.scoreSetting.mst" disabled>
                                <div v-for="(item,index) in SCORING_RULES_ENUM.arr" :key="index">
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('成绩发布设置') + '：'" class="el__form__time">
                            <el-radio-group v-model="editQuery.scoreSetting.spt" disabled>
                                <div
                                    v-for="(item, index) in RESULT_PUBLISH_SETTING_ENUM.arr"
                                    :key="index"
                                >
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                    <!--<div style="margin-left: 25px" v-if="index === 1">
                                        <el-checkbox
                                            v-model="editQuery.scoreSetting.publish"
                                            disabled
                                        >{{$t('定时发布成绩')}}
                                        </el-checkbox>
                                        <veln-datetime
                                            v-model="editQuery.scoreSetting.pd"
                                            :minDatetime="getNow()"
                                            disabled
                                        ></veln-datetime>
                                    </div>-->
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('考试权限设置') + '：'">
                            <el-radio-group v-model="editQuery.examAuthType" disabled>
                                <div
                                    v-for="(item, index) in EXAM_AUTH_SETTING_ENUM.arr"
                                    :key="index"
                                >
                                    <el-radio :label="item.code">{{ item.name }}</el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('排行榜设置')" :expand="false">
                        <el-form-item :label="$t('排行榜显示设置') + '：'">
                            <el-radio-group v-model="editQuery.rankSetting.rst" disabled>
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
                                    >
                                        <el-input
                                            v-model.number="editQuery.rankSetting.rsn"
                                            type="text"
                                            disabled
                                        />
                                    </el-form-item>
                                    {{ $t('名的排名情况') }}
                                    <span class="desc">{{ $t('填0则显示全部排名') }}</span>
                                </div>
                                <div style="margin-top: 5px">
                                    <el-radio label="SHOW_MAX">{{ $t('显示最高成绩的排名') }}</el-radio>
                                    {{ $t('显示前') }}
                                    <el-form-item
                                        class="el__form-inline"
                                    >
                                        <el-input
                                            v-model.number="editQuery.rankSetting.rsn2"
                                            type="text"
                                            disabled
                                        />
                                    </el-form-item>
                                    {{ $t('名的排名情况') }}
                                    <span class="desc">{{ $t('填0则显示全部排名') }}</span>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('排行榜发布设置') + '：'">
                            <el-radio-group v-model="editQuery.rankSetting.sht" disabled>
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
                        <!--<el-form-item :label="$t('')">-->
                        <!--<el-checkbox-->
                        <!--v-model="editQuery.preventSetting.sv"-->
                        <!--disabled-->
                        <!--&gt;{{$t('进入考试时需要短信验证身份')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.rc" disabled>{{$t('开启实时摄像抓拍的功能')}}
                            </el-checkbox>
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
                            <el-checkbox v-model="editQuery.preventSetting.cs" disabled>{{ $t('切屏次数超过') }}</el-checkbox>
                            <el-form-item
                                class="el__form-inline"
                            >
                                <el-input
                                    v-model.number="editQuery.preventSetting.csN"
                                    type="text"
                                    disabled
                                />
                            </el-form-item>
                            {{ $t('次，强制交卷') }}
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.no" disabled>
                                <el-form-item
                                    class="el__form-inline"
                                >
                                    <el-input
                                        v-model.number="editQuery.preventSetting.noD"
                                        type="text"
                                        disabled
                                    />
                                </el-form-item>
                                {{ $t('分钟内，考试页面不操作算为舞弊并强制交卷') }}
                            </el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('')">-->
                        <!--<el-checkbox v-model="editQuery.preventSetting.lt" disabled>-->
                        <!--{{$t('迟到')}}-->
                        <!--<el-form-item-->
                        <!--class="el__form-inline"-->
                        <!--&gt;-->
                        <!--<el-input-->
                        <!--type="text"-->
                        <!--v-model.number="editQuery.preventSetting.ltD"-->
                        <!--disabled-->
                        <!--&gt;</el-input>-->
                        <!--</el-form-item>-->
                        <!--{{$t('分钟后禁止参加考试')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                        <el-form-item :label="$t('')">
                            <el-checkbox v-model="editQuery.preventSetting.bs" disabled>
                                {{ $t('答卷时间少于') }}
                                <el-form-item
                                    class="el__form-inline"
                                >
                                    <el-input
                                        v-model.number="editQuery.preventSetting.bsD"
                                        type="text"
                                        disabled
                                    />
                                </el-form-item>
                                {{ $t('分钟禁止交卷') }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('')">
                            <el-checkbox
                                v-model="editQuery.preventSetting.ri"
                                disabled
                            >{{ $t('生成试卷时打乱相同题型下的试题的顺序以及试题选项的顺序') }}
                            </el-checkbox>
                        </el-form-item>
                    </veln-form-section>
                    <veln-form-section :title="$t('考试消息设置')" :expand="false">
                        <el-form-item :label="$t('考试通知') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.S" disabled>{{ $t('电子邮件') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.eMsg.E" disabled>{{ $t('手机短信') }}</el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('考试作废通知') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.S" disabled>{{ $t('电子邮件') }}
                            </el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.caMsg.E" disabled>{{ $t('手机短信') }}
                            </el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('考试移除人员通知') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.M" disabled>{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.S" disabled>{{$t('电子邮件')}}-->
                        <!--</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.reMsg.E" disabled>{{$t('手机短信')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item :label="$t('考试结束时间变更') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.M" disabled>{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.S" disabled>{{$t('电子邮件')}}-->
                        <!--</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.eeMsg.E" disabled>{{$t('手机短信')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                        <el-form-item :label="$t('发布成绩') + '：'">
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.S" disabled>{{ $t('电子邮件') }}
                            </el-checkbox>
                            <el-checkbox v-model="editQuery.messageSetting.pmMsg.E" disabled>{{ $t('手机短信') }}
                            </el-checkbox>
                        </el-form-item>
                        <!--<el-form-item :label="$t('补考通知') + '：'">-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.M" disabled>{{$t('站内信')}}</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.S" disabled>{{$t('电子邮件')}}-->
                        <!--</el-checkbox>-->
                        <!--<el-checkbox v-model="editQuery.messageSetting.muMsg.E" disabled>{{$t('手机短信')}}-->
                        <!--</el-checkbox>-->
                        <!--</el-form-item>-->
                    </veln-form-section>
                </section>
                <el-form-item v-if="!showMore" :label="$t('')">
                    <el-button type="primary" @click="showMore = true">{{ $t('更多设置') }}</el-button>
                </el-form-item>
            </section>
            <section v-if="this.$route.query.examType === 'OFFLINE'" class="exam-basic-content">
                <section v-if="!showMore">
                    <el-form-item
                        :label="$t('成绩设置') + '：'"
                    >
                        {{ $t('原试卷题目分数按比例折算成满分') }}
                        <el-input
                            v-model.number="editQuery.scoreSetting.cm"
                            type="text"
                            disabled
                        />
                        {{ $t('分') }}
                    </el-form-item>
                    <el-form-item :label="$t('考试通知') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.eMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.eMsg.S" disabled>{{ $t('电子邮件') }}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.eMsg.E" disabled>{{ $t('手机短信') }}</el-checkbox>
                    </el-form-item>
                    <el-form-item :label="$t('考试作废通知') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.caMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.caMsg.S" disabled>{{ $t('电子邮件') }}
                        </el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.caMsg.E" disabled>{{ $t('手机短信') }}
                        </el-checkbox>
                    </el-form-item>
                    <!--<el-form-item :label="$t('考试移除人员通知') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.reMsg.M" disabled>{{$t('站内信')}}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.reMsg.S" disabled>{{$t('电子邮件')}}
                        </el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.reMsg.E" disabled>{{$t('手机短信')}}
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item :label="$t('考试结束时间变更') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.eeMsg.M" disabled>{{$t('站内信')}}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.eeMsg.S" disabled>{{$t('电子邮件')}}
                        </el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.eeMsg.E" disabled>{{$t('手机短信')}}
                        </el-checkbox>
                    </el-form-item>-->
                    <el-form-item :label="$t('发布成绩') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.pmMsg.M" disabled>{{ $t('站内信') }}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.pmMsg.S" disabled>{{ $t('电子邮件') }}
                        </el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.pmMsg.E" disabled>{{ $t('手机短信') }}
                        </el-checkbox>
                    </el-form-item>
                    <!--<el-form-item :label="$t('补考通知') + '：'">
                        <el-checkbox v-model="editQuery.messageSetting.muMsg.M" disabled>{{$t('站内信')}}</el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.muMsg.S" disabled>{{$t('电子邮件')}}
                        </el-checkbox>
                        <el-checkbox v-model="editQuery.messageSetting.muMsg.E" disabled>{{$t('手机短信')}}
                        </el-checkbox>
                    </el-form-item>-->
                </section>
            </section>
        </el-form>
    </article>
</template>
<script>
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
    import VelnFormSection from '@/components/VelnFormSection';
    import moment from 'moment';
    import {getExamSetting} from '@/api/exam/exam/exam';

    export default {
        name: 'ExamSetting',
        components: {
            VelnFormSection
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
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
                        id: this.id,
                        examType: this.$route.query.examType
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
                showMore: false
            };
        },
        created() {
            this.init();
        },
        methods: {
            formatSetting(data) {
                if (!data.preventSetting.bsD) {
                    data.preventSetting.bsD = 3;
                }
                if (!data.preventSetting.ltD) {
                    data.preventSetting.ltD = 10;
                }
                if (!data.preventSetting.csN) {
                    data.preventSetting.csN = 3;
                }
                if (!data.preventSetting.noD) {
                    data.preventSetting.noD = 5;
                }

                return data;
            },
            init() {
                getExamSetting(this.id).then(re => {
                    const result = re.data;
                    if (result && result.success) {
                        const data = this.formatSetting(result.data);
                        this.editQuery = Object.assign(
                            {},
                            this.editQuery,
                            data
                        );
                        this.editQuery.exam.examType = this.$route.query.examType;
                        if (this.editQuery.scoreSetting.pd) {
                            this.editQuery.scoreSetting.publish = true;
                        }
                        this.editQuery.sourceId = this.$route.query.sourceId;
                        this.editQuery.rsn2 = this.editQuery.rankSetting.rsn2 || 10;

                        if (this.editQuery.rankSetting.rst === 'SHOW_MAX') {
                            this.editQuery.rsn2 = this.editQuery.rankSetting.rsn2 = this.editQuery.rankSetting.rsn;
                            this.editQuery.rankSetting.rsn = 10;
                        } else {
                            this.editQuery.rsn2 = this.editQuery.rankSetting.rsn2 = 10;
                        }
                    } else {
                        this.$errorMsg(this.$t(result.msg || '系统异常'));
                    }
                });
            },
            getNow() {
                return moment().format('YYYY-MM-DD HH:mm');
            }
        }
    };
</script>
