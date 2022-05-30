<style lang="scss" src='./style.scss'>
</style>

<template>
    <div id="VelnUpload" class="veln__uploader">
        <slot/>
    </div>
</template>

<script>
    import {getToken} from '@/utils/auth';

    // const webUploaderCDN = `${process.env.STATIC_API}/qgyun-static/js/webUploader/0.1.5/webuploader.min.js`;
    // const jqueryCDN = `${process.env.STATIC_API}/qgyun-static/js/jquery/3.4.1/jquery.min.js`;
    //
    // import load from './dynamicLoadScript';

    export default {
        name: 'VelnUpload',
        props: {
            id: {
                type: String,
                default: '',
                required: true
            },
            appCode: {
                type: String,
                default: ''
            },
            funCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                formData: {
                    appCode: this.appCode,
                    funCode: this.funCode
                },
                uploadConfig: {
                    //  验证整体文件是否已存在
                    checkFileUrl: `${process.env.FS_API}/file/checkFile`,
                    //  ajax验证每一个分片是否存在
                    checkChunkExistUrl: `${process.env.FS_API}/file/checkChunkExist`,
                    //  ajax将所有片段合并成整体
                    // mergeChunkUrl: `${process.env.FS_API}/file/mergeChunk`,
                    mergeChunkUrl: `${process.env.FS_API}/file/mergeFileChunk`,
                    //  文件上传处理
                    uploadUrl: `${process.env.FS_API}/file/uploadChunk`,
                    //  “秒传”
                    uploadByExistUrl: `${process.env.FS_API}/file/uploadByExist`
                },
                uploader: null,
                time: 0
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            register() {
                const that = this;
                if (!window.WebUploader && this.time > 10) {
                    return;
                }
                if (!window.WebUploader) {
                    this.time++;
                    setTimeout(() => {
                        this.register();
                    }, 200);
                    return;
                }
                window.WebUploader.Uploader.register(
                    {
                        'before-send-file': 'beforeSendFile', // 整个文件上传前
                        'before-send': 'beforeSend', // 每个分片上传前
                        'after-send-file': 'afterSendFile' // 分片上传完毕
                    },
                    {
                        beforeSendFile: function(file) {
                            var deferred = window.WebUploader.Base.Deferred();
                            that.uploader
                                .md5File(file, 0, 10 * 1024 * 1024)
                                .progress(function(percentage) {
                                    console.log('正在读取文件信息...');
                                })
                                .then(function(val) {
                                    console.log('获取文件信息成功...');
                                    file.fileMd5 = val;
                                    // deferred.resolve();

                                    // 检查整体文件是否已存在
                                    window.$.ajax({
                                        url: that.uploadConfig.checkFileUrl,
                                        async: false,
                                        headers: {
                                            Authorization: getToken()
                                        },
                                        data: {
                                            fileMd5: file.fileMd5
                                        },
                                        cache: false,
                                        dataType: 'json'
                                    }).then(
                                        function(response, textStatus, jqXHR) {
                                            if (response.data === true) {
                                                console.log(
                                                    '文件已存在，“秒传”处理'
                                                );
                                                window.$.ajax({
                                                    url:
                                                        that.uploadConfig
                                                            .uploadByExistUrl,
                                                    async: false,
                                                    headers: {
                                                        Authorization: getToken()
                                                    },
                                                    data: window.$.extend(
                                                        that.formData,
                                                        {
                                                            fileId: response.msg,
                                                            fileName: file.name
                                                        }
                                                    ),
                                                    cache: false,
                                                    dataType: 'json'
                                                }).then(
                                                    function(
                                                        response,
                                                        textStatus,
                                                        jqXHR
                                                    ) {
                                                        if (
                                                            response.success ===
                                                            true
                                                        ) {
                                                            console.log('秒传完成');
                                                            that.$emit(
                                                                'progress',
                                                                1,
                                                                file
                                                            );
                                                            that.$emit(
                                                                'success',
                                                                response
                                                            );
                                                        } else {
                                                            console.log(
                                                                '文件上传失败！'
                                                            );
                                                        }
                                                        that.uploader.reset();
                                                    },
                                                    function(
                                                        jqXHR,
                                                        textStatus,
                                                        errorThrown
                                                    ) {
                                                        // 任何形式的验证失败，都触发重新上传
                                                        alert(
                                                            '秒传时出错，请重试。'
                                                        );
                                                    }
                                                );
                                            } else {
                                                //  文件不存在，继续
                                                deferred.resolve();
                                            }
                                        },
                                        function(jqXHR, textStatus, errorThrown) {
                                            // 任何形式的验证失败，都触发重新上传
                                            // 分块不存在或不完整，重新发送该分块内容
                                            deferred.resolve();
                                        }
                                    );
                                });
                            return deferred.promise();
                        },

                        beforeSend: function(block) {
                            var deferred = window.WebUploader.Base.Deferred();
                            block.file.chunks = block.chunks;
                            window.$.ajax({
                                url: that.uploadConfig.checkChunkExistUrl,
                                headers: {
                                    Authorization: getToken()
                                },
                                data: {
                                    fileMd5: block.file.fileMd5, // 文件唯一标记
                                    chunkIndex: block.chunk, // 当前分块下标
                                    chunkSize: block.end - block.start // 当前分块大小
                                },
                                cache: false,
                                timeout: 5000, //  指定超时时长，超时时，同分片未上传过
                                dataType: 'json'
                            }).then(
                                function(response, textStatus, jqXHR) {
                                    if (response.data === true) {
                                        // 分块存在，跳过
                                        deferred.reject();
                                        console.log('分片文件是否存在检查：');
                                    } else {
                                        // 分块不存在或不完整，重新发送该分块内容
                                        deferred.resolve();
                                    }
                                },
                                function(jqXHR, textStatus, errorThrown) {
                                    // 任何形式的验证失败，都触发重新上传
                                    // 分块不存在或不完整，重新发送该分块内容
                                    deferred.resolve();
                                }
                            );
                            return deferred.promise();
                        },

                        afterSendFile: function(file) {
                            // 第一步：先检查文件路径下是否存在该文件，如果存在则修改旧文件名称和文件状态
                            var deferred = window.WebUploader.Base.Deferred();

                            // 合并文件分片
                            var mergeFile = function(
                                block,
                                data,
                                timePoke,
                                deferred
                            ) {
                                window.$.ajax({
                                    url: that.uploadConfig.mergeChunkUrl,
                                    method: 'post',
                                    headers: {
                                        'Content-type': 'application/json;charset=UTF-8',
                                        Authorization: getToken()
                                    },
                                    data: JSON.stringify(window.$.extend(that.formData, {
                                        fileName: block.name,
                                        fileMd5: block.fileMd5,
                                        chunkCount: block.chunks,
                                        chunkSize: that.uploader.options.chunkSize
                                    })),
                                    async: false, // 同步
                                    dataType: 'json',
                                    success: function(response) {
                                        // 合并成功之后的操作
                                        if (response.success === true) {
                                            console.log(
                                                '分片文件合并完成，文件上传已完成。'
                                            );
                                            that.$emit('success', response);
                                            deferred.resolve();
                                        } else {
                                            console.log('文件上传失败！');
                                        }
                                    }
                                });
                            };
                            mergeFile(file, null, null, deferred);

                            return deferred.promise();
                        }
                    }
                );
                this.initUploader();
            },
            init() {
                this.register();
                // const that = this;
                // //  dynamic load window.WebUploader from cdn
                // load(jqueryCDN, () => {
                //     window.$.getScript(webUploaderCDN, function(
                //         data,
                //         textStatus,
                //         jqxhr
                //     ) {
                //         that.register();
                //     });
                // });
            },
            initUploader() {
                const that = this;
                this.uploader = window.WebUploader.create({
                    // 选择文件，自动上传(自动上传设置成uploader()方法上传，不然所有的拦截信息没用)
                    auto: true,
                    //  图片压缩（默认压缩，图片时生效），false或具体配置属性，不可为`true`
                    compress: {
                        width: 1600,
                        height: 1600,
                        //  图片质量，只有type为`image/jpeg`的时候才有效。
                        // quality: 90,
                        //  是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                        allowMagnify: false,
                        //  是否允许裁剪。
                        crop: false,
                        //  是否保留头部meta信息。
                        preserveHeaders: true,
                        //  如果发现压缩后文件大小比原来还大，则使用原来图片
                        //  此属性可能会影响图片自动纠正功能
                        noCompressIfLarger: false
                    },
                    // resize: false,
                    server: that.uploadConfig.uploadUrl,
                    //  选择文件的按钮。可选。
                    //  内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: `#VelnUpload`,
                    //  低版本流程器支持（可选）
                    // swf: '/js/webUploader/uploader.swf',
                    duplicate: true, // 是否可重复选择同一文件
                    chunked: true, // 分片处理
                    chunkRetry: 3, // 如果某个分片由于网络问题出错，允许自动重传的次数
                    chunkSize: 5 * 1024 * 1024, // 5M
                    threads: 3 // 上传并发数，允许同时最大上传进程数量。越大效率越高，但会增加客户端、服务器压力
                    //  accept: {
                    //      // 限制上传文件格式
                    //      extensions: 'doc,docx,xls,xlsx,pdf',
                    //      mimeTypes: '.doc,.xls,.docx,.xlsx,.pdf'
                    //  }
                });

                // 上传文件携带token
                this.uploader.on('uploadBeforeSend', function(
                    block,
                    data,
                    headers
                ) {
                    var tokenHeaders = {
                        Authorization: getToken()
                    };
                    window.$.extend(headers, tokenHeaders);
                });

                // 上传文件 进度
                this.uploader.on('uploadProgress', function(file, percentage) {
                    that.$emit('progress', percentage, file);
                });

                // 上传 成功
                this.uploader.on('uploadSuccess', function(file, response) {
                    that.$emit('progress', 1, file);
                    that.$emit('complete', response, file);
                });

                // 上传 失败
                this.uploader.on('uploadError', function(file, reason) {
                    that.$emit('fail', reason, file);
                    that.uploader.reset();
                });

                //  当某个文件的分块在发送前触发，统一设置附带参数，大文件在开启分片上传时，此事件可能会触发多次
                this.uploader.on('uploadBeforeSend', function(
                    block,
                    data,
                    headers
                ) {
                    data.fileMd5 = block.file.fileMd5;
                    // block.file.chunks = block.chunks;// 当前文件总分片数量
                    data.chunkIndex = block.chunk;
                    data.chunkSize = that.uploader.options.chunkSize;
                });

                //  当有文件添加进来的时候
                this.uploader.on('fileQueued', function(file) {
                    // 执行上传
                    that.uploader.upload(file.id);
                    that.$emit('before-upload', file);
                });
            }
        }
    };
</script>
