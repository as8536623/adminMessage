<style lang="scss" src="./style.scss">
</style>
<template>
    <article class="veln__address__container">
        <el-form :inline="true" class="demo-form-inline" :model="editQuery">
            <el-form-item label class="veln__address__province">
                <el-select
                    v-model="editQuery.provinceCode"
                    :placeholder="$t('请选择省')"
                    :disabled="disabled"
                    @change="chooseProvince"
                >
                    <el-option
                        v-for="(val, key, index) in provinces"
                        :key="index"
                        :value="key"
                        :label="val"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="showCity" label class="veln__address__city">
                <el-select
                    v-model="editQuery.cityCode"
                    :placeholder="$t('请选择市')"
                    :disabled="disabled"
                    @change="chooseCity"
                >
                    <el-option
                        v-for="(val, key, index) in cities"
                        :key="index"
                        :value="key"
                        :label="val"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="showArea" label>
                <el-select
                    v-model="editQuery.areaCode"
                    :placeholder="$t('请选择地区')"
                    :disabled="disabled"
                    @change="chooseArea"
                >
                    <el-option
                        v-for="(val, key, index) in areas"
                        :key="index"
                        :value="key"
                        :label="val"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label class="el__form__address__item">
                <el-input
                    v-model="editQuery.address"
                    type="text"
                    :placeholder="$t('请输入详细地址')"
                    :disabled="disabled"
                />
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import DISTRICTS from './districts';

    const DEFAULT_CODE = 100000;
    export default {
        name: 'VelnAddressPicker',
        props: {
            province: {
                type: String,
                default: ''
            },
            city: {
                type: String,
                default: ''
            },
            area: {
                type: String,
                default: ''
            },
            address: {
                type: String,
                default: ''
            },
            showCity: {
                type: Boolean,
                default: true
            },
            showArea: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                provinces: [],
                cities: [],
                areas: [],
                editQuery: {
                    province: '',
                    city: '',
                    area: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    address: this.address
                }
            };
        },
        watch: {
            province: {
                handler(val) {
                    this.editQuery.province = val;
                    this.provinceHandle(val);
                },
                immediate: true
            },
            address: {
                handler(val) {
                    this.editQuery.address = val;
                },
                immediate: true
            }
        },
        created() {
            this.provinces = this.getDistricts();
        },
        methods: {
            // 选择省
            chooseProvince() {
                const data = {
                    province: this.getName(
                        DEFAULT_CODE,
                        this.editQuery.provinceCode
                    ),
                    city: '',
                    area: '',
                    cityCode: '',
                    areaCode: '',
                    address: ''
                };
                this.editQuery = Object.assign({}, this.editQuery, data);
                this.showCity ? this.getCities() : null;
            },
            getDistricts(code = DEFAULT_CODE) {
                return DISTRICTS[code] || [];
            },
            // 获取省/市/区名称
            getName(parentCode, code) {
                return DISTRICTS[parentCode][code];
            },
            // 获取对应市
            getCities() {
                this.cities = this.getDistricts(this.editQuery.provinceCode);
            },
            // 选择市
            chooseCity() {
                const data = {
                    city: this.getName(
                        this.editQuery.provinceCode,
                        this.editQuery.cityCode
                    ),
                    area: '',
                    areaCode: '',
                    address: ''
                };
                this.editQuery = Object.assign({}, this.editQuery, data);
                this.areas = this.getDistricts(this.editQuery.cityCode);
            },
            // 地区
            chooseArea() {
                this.editQuery.area = this.getName(
                    this.editQuery.cityCode,
                    this.editQuery.areaCode
                );
                this.editQuery.address = '';
            },
            // 默认值省回显
            provinceHandle(val) {
                for (const [value] of Object.entries(DISTRICTS)) {
                    for (const [lKey, lValue] of Object.entries(DISTRICTS[value])) {
                        if (val === lValue) {
                            this.editQuery.provinceCode = lKey;
                            if (this.showCity) {
                                this.getCities();
                                if (this.city) {
                                    this.editQuery.city = this.city;
                                    this.cityHandle();
                                }
                            }
                            return;
                        }
                    }
                }
            },
            //  默认值市回显
            cityHandle() {
                for (const [lKey, lValue] of Object.entries(
                    DISTRICTS[this.editQuery.provinceCode]
                )) {
                    if (this.city === lValue) {
                        this.editQuery.cityCode = lKey;
                        if (this.showArea) {
                            this.chooseCity();
                            if (this.area) {
                                this.editQuery.area = this.area;
                                this.areaHandle();
                            }
                        }
                        return;
                    }
                }
            },
            // 默认值区回显
            areaHandle() {
                for (const [lKey, lValue] of Object.entries(
                    DISTRICTS[this.editQuery.cityCode]
                )) {
                    if (this.area === lValue) {
                        this.editQuery.area = lKey;
                        return;
                    }
                }
            }
        }
    };
</script>
