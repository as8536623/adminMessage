<style lang="scss" src='./style.scss'>
</style>
<template>
    <article class="veln__dynamic__group">
        <el-form ref="listQuery" label-width="100px" :model="data" :rules="rules">
            <el-form-item
                :label="$t('选择条件') + '：'"
                class="veln__dynamic__group--check"
                :class="Array.isArray(data.checkList) && data.checkList.length ?'':'veln-form-item'"
            >
                <el-checkbox-group v-model="data.checkList">
                    <el-checkbox label="dept">{{ $t('部门') }}</el-checkbox>
                    <el-checkbox label="post">{{ $t('岗位') }}</el-checkbox>
                    <!--<el-checkbox label="rank">{{$t('职级')}}</el-checkbox>-->
                    <el-checkbox label="age">{{ $t('年龄') }}</el-checkbox>
                    <el-checkbox label="entry">{{ $t('入职时间') }}</el-checkbox>
                </el-checkbox-group>
                <el-tooltip class="item" effect="dark" :content="$t('删除')" placement="top">
                    <svg-icon
                        class-name="veln__dynamic__del"
                        icon-class="del"
                        @click.native="delHandle"
                    />
                </el-tooltip>
            </el-form-item>

            <el-form-item
                v-if="data.checkList.includes('dept')"
                :label="$t('部门')+ '：'"
                prop="deptList"
            >
                <div class="veln__group__select" @click="selectDeptHandle">
                    <el-tag
                        v-for="tag in data.deptList"
                        :key="tag.name"
                        closable
                        type="info"
                        @close="deptCloseHandle(tag)"
                    >{{ tag.name }}</el-tag>
                    <svg-icon class-name="veln__dynamic__icon" icon-class="flow"/>
                </div>
            </el-form-item>

            <el-form-item
                v-if="data.checkList.includes('post')"
                :label="$t('岗位') + '：'"
                prop="postList"
            >
                <div class="veln__group__select" @click="selectPostHandle">
                    <el-tag
                        v-for="tag in data.postList"
                        :key="tag.name"
                        closable
                        type="info"
                        @close="postCloseHandle(tag)"
                    >{{ tag.name }}</el-tag>
                    <svg-icon class-name="veln__dynamic__icon" icon-class="flow"/>
                </div>
            </el-form-item>

            <!--<el-form-item :label="$t('职级')+ '：'" v-if="data.checkList.indexOf('rank') > -1">-->
            <!--<el-select v-model="data.rank" multiple >-->
            <!--<el-option-->
            <!--v-for="item in rankList"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <section v-if="data.checkList.includes('age')" class="veln__dynamic__section">
                <el-form-item
                    :label="$t('年龄')+ '：'"
                    class="veln__dynamic__form__item veln__dynamic__group--select"
                    prop="ageRange"
                >
                    <el-select v-model="data.ageRange" style="margin-right: 20px">
                        <el-option :label="$t('大于等于')" value="gt"/>
                        <el-option :label="$t('介于')" value="bt"/>
                        <el-option :label="$t('小于等于')" value="lt"/>
                        <el-option :label="$t('等于')" value="et"/>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="data.ageRange === 'bt'"
                    class="veln__dynamic__form__item veln__dynamic__group--range"
                    prop="leftAge"
                >
                    <el-input v-model.number="data.leftAge"/>
                    <span>{{ $t('岁') }}</span>
                    <span class="veln__dynamic__group--line">——</span>
                </el-form-item>
                <el-form-item
                    class="veln__dynamic__form__item veln__dynamic__group--range"
                    prop="rightAge"
                >
                    <el-input v-model.number="data.rightAge"/>
                    <span>{{ $t('岁') }}</span>
                </el-form-item>
            </section>
            <section v-if="data.checkList.includes('entry')" class="veln__dynamic__section">
                <!--<el-form-item :label="$t('入职时间')+ '：'" class="veln__dynamic__form__item veln__dynamic__group&#45;&#45;select"  prop="year">-->
                <!--<section class="veln__dynamic__group&#45;&#45;range">-->
                <!--<span class="veln__dynamic__group&#45;&#45;time">{{$t('入职时间')}}</span>-->
                <!--<el-input v-model.number="data.year"></el-input>-->
                <!--<span>{{$t('年')}}</span>-->
                <!--</section>-->
                <!--</el-form-item>-->
                <el-form-item
                    :label="$t('入职时间')+ '：'"
                    prop="entryRange"
                    class="veln__dynamic__form__item veln__dynamic__group--select"
                >
                    <el-select v-model="data.entryRange" style="margin-right: 20px">
                        <el-option :label="$t('大于等于')" value="gt"/>
                        <el-option :label="$t('介于')" value="bt"/>
                        <el-option :label="$t('小于等于')" value="lt"/>
                        <el-option :label="$t('等于')" value="et"/>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="data.entryRange === 'bt'"
                    class="veln__dynamic__form__item veln__dynamic__group--range"
                    prop="leftMonth"
                >
                    <el-input v-model.number="data.leftMonth"/>
                    <span>{{ $t('月') }}</span>
                    <span class="veln__dynamic__group--line">——</span>
                </el-form-item>
                <el-form-item
                    class="veln__dynamic__form__item veln__dynamic__group--range"
                    prop="rightMonth"
                >
                    <el-input v-model.number="data.rightMonth"/>
                    <span>{{ $t('月') }}</span>
                </el-form-item>
            </section>
        </el-form>

        <el-dialog
            v-if="deptVisible"
            :key="deptKey"
            append-to-body
            :title="$t('选择部门')"
            :visible.sync="deptVisible"
            width="339px"
            @close="deptClose"
        >
            <veln-organize-select
                ref="organize"
                :show-checkbox="true"
                :check-strictly="true"
                :check-on-click-node="true"
                :default-checked-keys="disabledDeptIds"
                :disabled-keys="disabledDeptIds"
            />
            <div class="dialog__btn__line">
                <el-button @click="deptVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="deptBackHandle">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>

        <el-dialog append-to-body :title="$t('选择岗位')" :visible.sync="postVisible" width="339px">
            <veln-position-select ref="position" :category="true"/>
            <div class="dialog__btn__line">
                <el-button @click="postVisible=false">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="postSelect">{{ $t('保存') }}</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import VelnOrganizeSelect from '@/components/VelnOrganizeSelect';
    import VelnPositionSelect from '@/components/VelnPositionSelect';
    import {validateInteger} from '@/utils/validate';
    export default {
        name: 'VelnDynamicGroup',
        components: {
            VelnOrganizeSelect,
            VelnPositionSelect
        },
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        checkList: [],
                        deptList: [],
                        postList: [],
                        ageRange: 'bt',
                        leftAge: '',
                        rightAge: '',
                        entryRange: 'bt',
                        year: '',
                        leftMonth: '',
                        rightMonth: ''
                    };
                }
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data() {
            const validateLeftAgeRange = (rule, value, callback) => {
                if (
                    this.data.ageRange === 'bt' &&
                    value &&
                    this.data.rightAge &&
                    Number(value) >= Number(this.data.rightAge)
                ) {
                    callback(new Error(this.$t('年龄范围不正确')));
                } else {
                    callback();
                }
            };
            const validateRightAgeRange = (rule, value, callback) => {
                if (
                    this.data.ageRange === 'bt' &&
                    value &&
                    this.data.leftAge &&
                    Number(value) <= Number(this.data.leftAge)
                ) {
                    callback(new Error(this.$t('年龄范围不正确')));
                } else {
                    callback();
                }
            };
            const validateLeftMonthRange = (rule, value, callback) => {
                if (
                    this.data.entryRange === 'bt' &&
                    value &&
                    this.data.rightMonth &&
                    Number(value) >= Number(this.data.rightMonth)
                ) {
                    callback(new Error(this.$t('时间范围不正确')));
                } else {
                    callback();
                }
            };
            const validateRightMonthRange = (rule, value, callback) => {
                if (
                    this.data.entryRange === 'bt' &&
                    value &&
                    this.data.leftMonth &&
                    Number(value) <= Number(this.data.leftMonth)
                ) {
                    callback(new Error(this.$t('时间范围不正确')));
                } else {
                    callback();
                }
            };
            return {
                rankList: [],
                deptVisible: false,
                postVisible: false,
                disabledDeptIds: [],
                rules: {
                    deptList: [
                        {
                            required: true,
                            message: this.$t('请选择部门'),
                            trigger: 'blur'
                        }
                    ],
                    postList: [
                        {
                            required: true,
                            message: this.$t('请选择岗位'),
                            trigger: 'blur'
                        }
                    ],
                    ageRange: [
                        {required: true, message: this.$t('请选择年龄范围')}
                    ],
                    leftAge: [
                        {
                            required: true,
                            message: this.$t('请输入年龄'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateLeftAgeRange, trigger: 'blur'}
                    ],
                    rightAge: [
                        {
                            required: true,
                            message: this.$t('请输入年龄'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateRightAgeRange, trigger: 'blur'}
                    ],
                    year: [
                        {
                            required: true,
                            message: this.$t('请输入入职时间'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'}
                    ],
                    entryRange: [
                        {required: true, message: this.$t('请选择入职范围')}
                    ],
                    leftMonth: [
                        {
                            required: true,
                            message: this.$t('请输入入职时间'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateLeftMonthRange, trigger: 'blur'}
                    ],
                    rightMonth: [
                        {
                            required: true,
                            message: this.$t('请输入入职时间'),
                            trigger: 'blur'
                        },
                        {validator: validateInteger, trigger: 'blur'},
                        {validator: validateRightMonthRange, trigger: 'blur'}
                    ]
                },
                deptKey: null
            };
        },
        methods: {
            // 选择部门
            selectDeptHandle() {
                this.disabledDeptIds = this.getDeptIds();
                this.deptVisible = true;
            },
            getDeptIds() {
                const ids = [];
                this.data.deptList.map(item => {
                    ids.push(item.id);
                });
                return ids;
            },
            // 选择部门后回调
            deptBackHandle(e) {
                const list = this.$refs.organize.getActive();
                const ids = [];
                this.data.deptList.map(item => {
                    ids.push(item.id);
                });
                if (Array.isArray(list) && list.length > 0) {
                    list.map(item => {
                        if (!ids.includes(item.id)) {
                            const data = {id: item.id, name: item.name};
                            this.data.deptList.push(data);
                        }
                    });
                }
                this.deptVisible = false;
                this.$refs.listQuery.validateField('deptList');
            },
            // 删除部门
            deptCloseHandle(tag) {
                const index = this.data.deptList.findIndex(item => {
                    return item.id === tag.id;
                });
                this.data.deptList.splice(index, 1);
            },
            deptClose() {
                this.deptKey = +new Date();
            },
            // 选择岗位
            selectPostHandle() {
                this.postVisible = true;
            },
            // 选择岗位后回调
            postSelect() {
                // this.data.postList = [];
                const $position = this.$refs.position;
                const result = $position.getActive();
                if (result.category) {
                    this.$warnMsg(this.$t('不能选择岗位类别'));
                    return;
                }
                const data = {
                    id: result.id,
                    name: result.name
                };
                this.data.postList.push(data);
                this.postVisible = false;
                this.$refs.listQuery.validateField('postList');
            },
            // 删除部门
            postCloseHandle(tag) {
                const index = this.data.postList.findIndex(item => {
                    return item.id === tag.id;
                });
                this.data.postList.splice(index, 1);
            },
            // 删除
            delHandle() {
                this.$emit('delDynamic', this.index);
            },
            // 表单验证
            formValidate() {
                let result = false;
                this.$refs.listQuery.validate(valid => {
                    if (valid) {
                        result = true;
                    }
                });
                return result;
            }
        }
    };
</script>
