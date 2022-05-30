<style lang="scss" src="./style.scss">
</style>

<template>
    <div class="veln__transfer__page">
        <i class="el-icon-arrow-left icon__arrow" @click="prev"/>
        <el-input v-model.trim="pageNumber" class="vtp__npt" @keyup.enter.native="enter"/>
        <span class="split__line">/</span>
        <span class="total__page">{{ totalPages }}</span>
        <i class="el-icon-arrow-right icon__arrow" @click="next"/>
    </div>
</template>

<script>
    export default {
        name: 'VelnTransferPage',
        props: {
            total: {
                type: [String, Number],
                default: 0,
                validator: function(value) {
                    return Number.isInteger(Number(value));
                }
            },
            pageNum: {
                type: [String, Number],
                default: 1,
                validator: function(value) {
                    return Number.isInteger(Number(value));
                }
            },
            pageSize: {
                type: [String, Number],
                default: 10,
                validator: function(value) {
                    return Number.isInteger(Number(value));
                }
            }
        },
        data() {
            return {
                pageNumber: this.pageNum,
                totalPages: 0
            };
        },
        watch: {
            pageNumber(val) {
                if (!val) {
                    return;
                }
                if (isNaN(val)) {
                    const num = parseFloat(val);
                    if (isNaN(num)) {
                        this.pageNumber = '';
                    } else {
                        this.pageNumber = num;
                    }
                }
            },
            pageNum(val) {
                this.pageNumber = val;
            },
            total: {
                handler(val) {
                    this.totalPages = Math.ceil(Number(val) / Number(this.pageSize));
                },
                immediate: true
            }
        },
        methods: {
            prev() {
                if (this.pageNumber <= 1) {
                    return;
                }
                this.pageNumber--;
                this.$emit('current-change', this.pageNumber);
            },
            next() {
                if (this.pageNumber >= this.totalPages) {
                    return;
                }
                this.pageNumber++;
                this.$emit('current-change', this.pageNumber);
            },
            enter() {
                if (this.pageNumber < 1) {
                    this.pageNumber = 1;
                }
                if (this.pageNumber > this.totalPages) {
                    this.pageNumber = this.totalPages;
                }
                this.$emit('current-change', this.pageNumber);
            }
        }
    };
</script>
