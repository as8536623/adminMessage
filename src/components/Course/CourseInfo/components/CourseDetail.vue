<style lang="scss" scoped>
    @import "./style";
</style>

<template>
    <article class="detail__course">
        <!--        <h3 class="detail__course__title">-->
        <!--            课程简介-->
        <!--        </h3>-->
        <!--        <div class="detail__course__content">-->
        <!--            <div v-if="courseData.description" v-html="courseData.description">-->
        <!--                {{courseData.description}}-->
        <!--            </div>-->
        <!--            <div v-else>暂无</div>-->
        <!--        </div>-->
        <h3 class="detail__course__title">
            {{ $t('课程资料') }}
        </h3>
        <div class="detail__course__content course__file">
            <p v-if="fileList && fileList.length > 0" class="introduce__file__title">
                {{ '共有' + fileList.length + '份' }}
            </p>
            <default-page v-else/>
            <ul class="course__file__list">
                <li
                    v-for="item in fileList"
                    :key="item.fileId"
                    class="course__file__list__item"
                    style="cursor: pointer"
                    @click="previewFile(item)"
                >
                    <i class="file-icon" :data-type="item.iconType"/>
                    {{ item.srcName }}
                    <svg-icon
                        v-if="false"
                        icon-class="download"
                        class-name="download-icon"
                        @click="downloadFile(item)"
                    />
                </li>
            </ul>
        </div>
    </article>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';

    const fileType = {
        'mp3': 'audio',
        'mp4': 'video',
        'ppt': 'ppt',
        'pptx': 'ppt',
        'doc': 'word',
        'docx': 'word',
        'xls': 'excel',
        'xlsx': 'excel',
        'pdf': 'pdf',
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image'
    };

    export default {
        name: 'CourseDetail',
        components: {
            DefaultPage
        },
        props: {
            introduceType: {
                type: String,
                default: ''
            },
            courseFileList: {
                type: Array,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            return {
                fileList: []
            };
        },
        watch: {
            courseFileList: {
                handler(val) {
                    if (val) {
                        this.fileHandle(val);
                    }
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            fileHandle(data) {
                let arr = [];
                const list = data || [];
                if (list.length > 0) {
                    arr = list.map(item => {
                        const nameSplit = item.srcName.split('.');
                        const srcName = nameSplit[nameSplit.length - 1];
                        if (fileType.hasOwnProperty(srcName)) {
                            item.iconType = fileType[srcName];
                        } else {
                            item.iconType = 'uknown';
                        }
                        return item;
                    });
                }
                this.fileList = arr;
            },
            downloadFile(data) {
                const x = new XMLHttpRequest();
                const resourceUrl = data.downloadUrl;
                x.open('GET', resourceUrl, true);
                x.responseType = 'blob';

                x.onload = function(e) {
                    // ie10+
                    if (navigator.msSaveBlob) {
                        // const name = resourceUrl.substr(resourceUrl.lastIndexOf('/') + 1);
                        const name = data.srcName;
                        return navigator.msSaveBlob(x.response, name);
                    } else {
                        const url = window.URL.createObjectURL(x.response);
                        const a = document.createElement('a');
                        document.body.appendChild(a);
                        a.style.display = 'none';
                        a.href = url;
                        a.download = data.srcName;
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }
                };
                x.send();
            },
            previewFile(file) {
                const {fileId, viewUrl, length, convertType, srcType} = file;
                if (srcType !== 'image') {
                    const routeData = this.$router.resolve({
                        name: 'filePreview',
                        query: {fileId, viewUrl, length, convertType}
                    });
                    window.open(routeData.href, '_blank');
                } else {
                    window.open(viewUrl, '_blank');
                }
            }
        }
    };
</script>
