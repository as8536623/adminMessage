// Here is a list of the toolbar
// Detail list see https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols

const config = {
    toolbar: [
        'undo redo | fontsizeselect | blockquote hr | removeformat | link unlink',
        'bold italic underline code strikethrough forecolor backcolor | outdent indent | alignleft aligncenter alignright alignjustify | bullist numlist | image'
    ],
    fonts: 'Verdana=verdana,geneva,sans-serif;宋体=宋体;微软雅黑=微软雅黑;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Times New Roman=times new roman,times,serif;',
    // eslint-disable-next-line camelcase
    fontsize_formats: '12px 14px 16px 18px 20px 24px 28px 32px 36px 40px 48px 56px'
};

export default config;
