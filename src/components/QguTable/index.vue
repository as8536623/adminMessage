<style lang="scss">
    .el-table-wrap {
        width: 99%;
    }
</style>

<template>
    <div class="el-table-wrap">
        <el-table
            v-if="list"
            ref="table"
            v-loading="loading"
            border
            fit
            :data="list"
            :span-method="spanMethod"
            :row-class-name="rowClassName"
            v-bind="$attrs"
            :highlight-current-row="highlightCurrentRow"
            @selection-change="handleSection"
            @select-all="selectAll"
            @select="select"
            @row-click="rowClick"
            @sort-change="sortChange"
            @cell-mouse-enter="mouseEnter"
        >
            <template v-for="(column) in tableColumns">
                <el-table-column
                    v-if="column.type==='checkbox' && showColumn(column.hidden)"
                    :key="column.field"
                    class="qgu__table__not__drag"
                    :label="column.text"
                    :width="column.width"
                    :min-width="column.minWidth"
                    type="selection"
                    :selectable="column.enabled"
                    :fixed="column.fixed"
                    :sortable="column.sortable"
                    :render-header="column['render-header']"
                    :align="column.align || 'center'"
                />
                <el-table-column
                    v-else-if="column.type==='radio' && showColumn(column.hidden)"
                    :key="column.field"
                    class="qgu__table__not__drag"
                    :label="column.text"
                    :width="column.width"
                    :min-width="column.minWidth"
                    type="selection"
                    :selectable="column.enabled"
                    :fixed="column.fixed"
                    :sortable="column.sortable"
                    :render-header="column['render-header']"
                    :align="column.align || 'center'"
                >
                    <template slot-scope="scope">
                        <el-radio v-model="radio" class="qgu__table__radio" :label="scope.row.id"/>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else-if="column.render && showColumn(column.hidden)"
                    :key="column.field"
                    :label="column.text"
                    :width="column.width"
                    :prop="column.field"
                    :min-width="column.minWidth"
                    :class="column.fixed ? 'qgu__table__not__drag':''"
                    :fixed="column.fixed"
                    :sortable="column.sortable"
                    :render-header="column['render-header']"
                    :align="column.align || 'left'"
                >
                    <template slot-scope="scope">
                        <my-render :sc="scope" :row="scope.row" :render="column.render"/>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else-if="showColumn(column.hidden)"
                    :key="column.field"
                    :label="column.text"
                    :width="column.width"
                    :prop="column.field"
                    :align="column.align || 'left'"
                    :fixed="column.fixed"
                    :sortable="column.sortable"
                    :min-width="column.minWidth"
                    :class="column.fixed ? 'qgu__table__not__drag':''"
                    :render-header="column['render-header']"
                />
                <el-table-column
                    v-else-if="column.hasFilter"
                    :key="column.field"
                    :label="column.text"
                    :width="column.width"
                    :prop="column.field"
                    :align="column.align || 'left'"
                    :fixed="column.fixed"
                    :sortable="column.sortable"
                    :min-width="column.minWidth"
                    :class="column.fixed ? 'qgu__table__not__drag':''"
                    :render-header="column['render-header']"
                    :filters="column.filter"
                    :filter-method="filterHandler"
                    :filter-multiple="column.filterMultiple"
                    :formatter="formatterValue"
                />
                <el-switch
                    v-else-if="column.type==='ELSwitch'"
                    :key="column.field"
                    v-model="column.value"
                />
            </template>
        </el-table>
        <el-pagination
            v-if="havePagination && !simplePage && total !== 0"
            background
            :current-page="page.pageNum"
            :page-size="page.pageSize"
            :page-sizes="pageSizeArr"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <!-- todo 待考虑 -->
        <simple-page
            v-if="havePagination && simplePage && total !== 0"
            :page-size="page.pageSize"
            :page-num="page.pageNum"
            :total="total"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
    import MyRender from './MyRender.vue';
    import Sortable from 'sortablejs';
    import SimplePage from './components/page';
    import QguButton from '../QguButton/index.vue';
    import QguInput from '../QguInput/index.vue';
    import QguSelect from '../QguSelect/index.vue';
    import QguDatePicker from '../QguDatePicker/index.vue';
    import QguRadioGroup from '../QguRadioGroup/index.vue';
    import {insertAfter} from '@/utils/dom';

    export default {
        name: 'QguTable',
        components: {
            MyRender,
            SimplePage,
            // eslint-disable-next-line vue/no-unused-components
            QguButton,
            // eslint-disable-next-line vue/no-unused-components
            QguInput,
            // eslint-disable-next-line vue/no-unused-components
            QguSelect,
            // eslint-disable-next-line vue/no-unused-components
            QguDatePicker,
            // eslint-disable-next-line vue/no-unused-components
            QguRadioGroup
        },
        props: {
            simplePage: {
                type: Boolean,
                default: false
            },
            splitProps: {
                type: String,
                default: () => ''
            },
            data: {
                type: [Array, Object],
                required: true
            },
            columns: {
                type: Array,
                default: () => [],
                required: true
            },
            pageSizeArr: {
                type: Array,
                default: () => [5, 10, 20, 30, 50]
            },
            loading: {
                type: Boolean,
                default: () => true
            },
            page: {
                type: [Object],
                default: () => null
            },
            total: {
                type: [Number],
                default: 0
            },
            highlightCurrentRow: {
                type: [Boolean],
                default: false
            },
            // TODO 结合pageSize，去掉这个配置项
            havePagination: {
                type: [Boolean],
                default: true
            },
            // todo 考虑
            spanMethod: {
                type: Function,
                default: () => {}
            },
            rowClassName: {
                type: Function,
                default: () => {}
            },
            columnSortable: {
                type: [Object, Boolean],
                default: false
            }
        },
        data() {
            return {
                list: this.data || [],
                tableColumns: this.columns,

                // 列拖拽Sortable实例
                columnSortableInstance: null,
                radio: null
            };
        },
        watch: {
            data() {
                this.list = this.data;
            },
            columns(val) {
                this.tableColumns = val;
                const data = this.list;
                this.list = [];
                this.$nextTick(() => {
                    this.list = data;
                });
            },
            radio(val, old) {
                if (val === old) {
                    return;
                }

                this.list.map(item => {
                    if (item.id === val) {
                        this.radioChange(item);
                    }
                });
            }
        },
        mounted() {
            this.columnSortable && this.initColumnSortable();
        },
        beforeDestroy() {
            this.columnSortableInstance && this.columnSortableInstance.destroy();
        },
        methods: {
            showColumn(hidden) {
                if (typeof hidden === 'function') {
                    return hidden();
                }

                return typeof hidden === 'undefined' || !hidden;
            },
            radioChange(item) {
                this.$emit('selection-change', [item]);
            },
            radioSelect(item) {
                this.radio = item && item.id ? item.id : null;
            },
            handleSizeChange(val) {
                this.$emit('size-change', val);
            },
            handleCurrentChange(val) {
                this.$emit('current-change', val);
            },
            handleSection(section) {
                this.$emit('selection-change', section);
            },
            toggleSelection(arr) {
                setTimeout(() => {
                    const result = [];
                    this.list.map((item, index) => {
                        if (arr.indexOf(item.id) > -1) {
                            result.push(index);
                        }
                    });

                    result.forEach(index => {
                        this.$refs.table.toggleRowSelection(this.list[index], true);
                    });
                }, 0);
            },
            select(selection, row) {
                this.$emit('select', selection, row);
            },
            rowClick(row, column) {
                this.$emit('row-click', row, column);
            },
            sortChange(column, prop, order) {
                this.$emit('sort-change', column, prop, order);
            },
            mouseEnter(row, column, cell, event) {
                this.$emit('cell-mouse-enter', row, column, cell, event);
            },
            selectAll(selection) {
                this.$emit('select-all', selection);
            },
            /**
             * TODO 是否要放在里面
             * 内部调用排序方法，还原由Sortable拖拽改变的DOM顺序，然后修改数据，再由数据驱动改变DOM
             * @function
             * @private
             * @param {String} type 排序类型，row 或 column
             * @param {HTMLElement} container 容器元素DOM
             * @param {Array} data 数据数组
             * @param {Object} e Sortable事件对象
             */
            sort(type, container, data, e) {
                const tempData = [...data];
                const newIndex = e.newIndex;
                const oldIndex = e.oldIndex;
                const temp = tempData[oldIndex];
                container.removeChild(e.item);
                const children = container.children;
                if (children.length > 0) {
                    oldIndex > 0
                        ? insertAfter(e.item, children[oldIndex - 1])
                        : container.insertBefore(e.item, children[0]);
                } else {
                    container.appendChild(e.item);
                }

                // 固定类型的列不运行拖拽和放置
                if (type === 'column' && data[newIndex] && data[newIndex].type) {
                    return;
                }
                tempData.splice(oldIndex, 1);
                tempData.splice(newIndex, 0, temp);

                // 修复ele中重新设置表格配置时要重新描绘表格
                if (type === 'column') {
                    this.tableColumns = [];
                    this.$nextTick(() => {
                        this.tableColumns = tempData;
                        /**
                         * 列拖拽排序完成时触发
                         * @event on-column-sort
                         * @param {object} e Sortable事件对象
                         * @param {Array} columns 列定义数组
                         */
                        this.$emit('on-column-sort', e, this.tableColumns);
                    });
                } else {
                    this.tableData = [];
                    this.$nextTick(() => {
                        this.tableData = tempData;
                    });
                }
            },
            /**
             * TODO 是否要放在里面
             * 实例化列Sortable
             */
            initColumnSortable() {
                const tr = this.$refs.table.$refs.tableHeader.$el.getElementsByTagName(
                    'tr'
                )[0];
                if (!tr) { return; }

                const options = Object.assign(
                    {
                        forceFallback: false,
                        animation: 150
                    },
                    this.columnSortable,
                    {
                        handle: '.cell',
                        filter: '.qgu__table__not__drag',
                        onSort: e => {
                            this.sort('column', tr, this.tableColumns, e);
                        }
                    }
                );

                this.columnSortableInstance = new Sortable(tr, options);
            },
            setCurrentRow(row) {
                this.$refs.table.setCurrentRow(row);
            },
            clearSelection() {
                this.$refs.table.clearSelection();
            },
            toggleRowSelection(row, boolean = true) {
                this.$refs.table.toggleRowSelection(row, boolean);
            },
            formatterValue(row, column) {
                const property = column['property'];
                if (row[property] === 0) {
                    return '未开启';
                } else if (row[property] === 1) {
                    return '已开启';
                }
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            }
        }
    };
</script>

