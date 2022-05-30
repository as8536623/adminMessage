<style scoped lang="scss">
    @import './style.scss';
</style>

<template>
    <div class="veln-document-player">
        <iframe
            v-if="!showCarousel"
            :src="viewUrl"
            class="document-iframe"
            frameborder="0"
        />
        <el-carousel
            v-if="showCarousel"
            class="veln-document-carousel"
            indicator-position="none"
            :autoplay="false"
            arrow="always"
            @change="changePage"
        >
            <el-carousel-item v-for="item in viewList" :key="item">
                <veln-image
                    class="veln-document-image"
                    :src="item"
                />
            </el-carousel-item>
        </el-carousel>
        <!--跳转-->
        <svg-icon icon-class="arrow_right" class-name="icon__arrow--right" @click="openTab"/>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {socketEmit} from '@/utils/socket';
    import {getCorpCode} from '@/utils/auth';

    export default {
        name: 'VelnDocumentPlayer',
        props: {
            src: {
                type: String,
                default: ''
            },
            convertType: {
                type: String,
                default: ''
            },
            total: {
                type: [String, Number],
                default: ''
            },
            saveProgress: {
                type: Boolean,
                default: true
            },
            itemId: {
                type: String,
                default: ''
            },
            courseId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                viewUrl: '',
                viewList: [],
                showCarousel: false
            };
        },
        computed: {
            ...mapGetters['corpCode']
        },
        watch: {
            src: {
                handler(v) {
                    if (v) {
                        this.viewUrl = `${this.src}&corpCode=${getCorpCode()}`;
                    }
                },
                immediate: true
            },
            convertType: {
                handler(type) {
                    if (type === 'linux') {
                        const list = [];
                        console.log('player src', this.src);
                        const preUrlArr = this.src.split('.');
                        preUrlArr.pop();
                        const preUrl = preUrlArr.join('.');
                        for (let i = 0; i < Number(this.total); i++) {
                            list.push(`${preUrl}/${i}.jpg`);
                        }

                        console.log('player list', list);
                        this.viewList = list;
                        this.showCarousel = true;
                    }
                },
                immediate: true
            }
        },
        mounted() {
            this.bindEvents();
        },
        beforeDestroy() {
            this.unbindEvents();
        },
        methods: {
            unbindEvents() {
                window.saveDocProcess = null;
            },
            bindEvents() {
                const that = this;
                window.saveDocProcess = (curr, total) => {
                    const params = {
                        courseId: this.courseId,
                        itemId: this.itemId,
                        location: curr,
                        end: false
                    };
                    if (that.saveProgress) {
                        socketEmit('STUDY_RECORD', params);
                    }

                    if (curr === total) {
                        setTimeout(() => {
                            that.$emit('ended');
                        }, 3000);
                    }
                };
            },
            changePage(curr) {
                if (!that.saveProgress) {
                    return;
                }
                const params = {
                    courseId: this.courseId,
                    itemId: this.itemId,
                    location: curr,
                    end: false
                };
                socketEmit('STUDY_RECORD', params);
                const that = this;
                if (curr === this.total) {
                    setTimeout(() => {
                        that.$emit('ended');
                    }, 3000);
                }
            },
            openTab() {
                window.open(this.viewUrl);
            }
        }
    };
</script>
