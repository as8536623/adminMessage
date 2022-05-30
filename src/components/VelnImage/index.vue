<style lang="scss">
</style>

<template>
    <img :key="imgSrc" :src="imgSrc" alt="image" @error="getDefaultImg" @click="handleClick">
</template>

<script>
    export default {
        name: 'VelnImage',
        props: {
            type: {
                type: String,
                default: 'normal'
            },
            src: {
                type: String,
                default: ``
            }
        },
        data() {
            return {
                imgSrc: this.src
            };
        },
        watch: {
            src(val) {
                this.imgSrc = val;
            }
        },
        mounted() {
            if (!this.imgSrc) {
                this.getDefaultImg();
            }
        },
        methods: {
            getDefaultImg() {
                let src = '';
                switch (this.type) {
                    case 'normal':
                        src = `${process.env.STATIC_API}/qgyun-static/images/default.png`;
                        break;
                    case 'user':
                        src = `${process.env.STATIC_API}/qgyun-static/images/default_user.png`;
                        break;
                    case 'km':
                        src = `${process.env.STATIC_API}/qgyun-static/images/default_km.png`;
                        break;
                    case 'face':
                        src = `${process.env.STATIC_API}/qgyun-static/images/face_default_cover.png`;
                        break;
                }
                this.imgSrc = src;
            },
            handleClick() {
                this.$emit('click');
            }
        }
    };
</script>
