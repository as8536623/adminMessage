<style lang="scss" src="./style.scss">
</style>

<template>
    <article class="km__detail__view">
        <div class="view__content__main">
            <div v-if="list.length" class="view__image__wrapper">
                <veln-image class="view__image" :src="list[active].qgFile.viewUrl"/>
            </div>
            <div v-show="active > 0" class="view__arrow left" @click="prev">
                <svg-icon icon-class="arrow_l" class-name="view__arrow__icon"/>
            </div>
            <div v-show="active < (list.length - 1)" class="view__arrow right" @click="next">
                <svg-icon icon-class="arrow_r" class-name="view__arrow__icon"/>
            </div>
            <div
                ref="audio"
                class="view__play"
                :class="{'rotation': rotating}"
                @click="handleChangePlay"
            />
        </div>
        <aside class="view__list">
            <header class="view__list__header">{{ $t('全部图片') }}（{{ list.length }}）</header>
            <div class="view__preview__list">
                <vue-scroll>
                    <template v-for="(item, index) in list">
                        <div
                            v-if="list.length"
                            :key="index"
                            class="view__preview__item"
                            :class="{'active': active===index}"
                            @click="changeActive(index)"
                        >
                            <veln-image class="view__preview__image" :src="item.qgFile.viewUrl"/>
                        </div>
                    </template>
                </vue-scroll>
            </div>
        </aside>
    </article>
</template>

<script>
    import {listByItemId} from '@/api/km/knowledgeItemRecord';

    export default {
        name: 'KmDetailView',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                rotating: false,
                active: 0,
                audioEl: null,
                isPlaying: false,
                voiceActive: 0,
                voiceKey: null
            };
        },
        mounted() {
            console.log(this.list);
            this.audioEl = document.getElementById('qguAudio');
            this.getRecordList();
            this.bindAudioEvent();
        },
        methods: {
            // 获取录音列表
            getRecordList() {
                const itemId = this.list[this.active].id;
                const params = {
                    itemId
                };

                listByItemId(params).then(re => {
                    const result = re.data;
                    if (result.success) {
                        this.list[this.active].voiceList = result.data || [];
                        this.playVoice(0);
                        this.voiceKey = +new Date();
                    } else {
                        this.$errorMsg(this.$t(result.msg || '操作失败'));
                    }
                });
            },
            bindAudioEvent() {
                this.audioEl.addEventListener(
                    'timeupdate',
                    this.audioTimeupdate,
                    false
                );
                this.audioEl.addEventListener(
                    'playing',
                    () => {
                        this.isPlaying = true;
                        this.rotating = true;
                        this.$refs.audio.style.animationPlayState = 'running';
                    },
                    false
                );
                this.audioEl.addEventListener(
                    'pause',
                    () => {
                        this.isPlaying = false;
                        this.$refs.audio.style.animationPlayState = 'paused';
                    },
                    false
                );
                this.audioEl.addEventListener(
                    'ended',
                    () => {
                        this.isPlaying = false;
                        this.rotating = false;
                        this.playVoice(this.voiceActive + 1);
                    },
                    false
                );
            },
            audioTimeupdate() {
            },
            changeActive(index) {
                this.active = index;
                if (!this.list[this.active]) {
                    return;
                }
                this.getRecordList();
            },
            prev() {
                this.changeActive(this.active - 1);
            },
            next() {
                this.changeActive(this.active + 1);
            },
            playVoice(index) {
                this.voiceActive = index;
                const audioItem = this.list[this.active].voiceList[index];
                if (!audioItem) {
                    return;
                }
                this.audioEl.src = this.list[this.active].voiceList[index].audioUrl;
                console.log(this.audioEl.src);
                this.audioEl.play();
            },
            handleChangePlay() {
                if (this.isPlaying) {
                    this.audioEl.pause();
                    return;
                }
                this.audioEl.play();
            }
        }
    };
</script>
