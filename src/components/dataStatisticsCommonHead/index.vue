<style lang="scss" src='./style.scss' scoped>
</style>
<template>
    <article class="stu__info__setting">
        <div class="headerBox">
            <ul>
                <li
                    v-for="(item, index) in newStatisticsData"
                    :key="index"
                    :class="'bg'+index"
                >
                    <div class="contentBox">
                        <div class="title">
                            {{ statisticsDataTitle[index] }}
                        </div>
                        <div v-if="typeof item === 'number' || typeof item === 'string'" class="data">
                            {{ item }}
                        </div>
                        <div v-else class="data">
                            <el-select
                                v-model="newCustomerId"
                                placeholder="请选择"
                                @change="customerChange"
                            >
                                <el-option
                                    v-for="customer in item"
                                    :key="customer.customerId"
                                    :label="customer.customerName"
                                    :value="customer.customerId"
                                />
                            </el-select>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </article>
</template>
<script>
    export default {
        name: 'DataStatisticsCommonHead',
        components: {},
        props: {
            statisticsData: {
                type: Array,
                default() {
                    return [];
                }
            },
            statisticsDataTitle: {
                type: Array,
                default() {
                    return [];
                }
            },
            customerId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                newStatisticsData: this.statisticsData,
                newCustomerId: this.customerId
            };
        },
        watch: {
            statisticsData: {
                handler(val) {
                    this.newStatisticsData = val;
                },
                deep: true
            },
            customerId: {
                handler(val) {
                    this.newCustomerId = val;
                }
            }
        },
        methods: {
            customerChange(val) {
                this.$emit('change', val);
            }
        }
    };
</script>
