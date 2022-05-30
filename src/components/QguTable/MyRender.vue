<script>
    export default {
        functional: true,
        props: {
            row: {
                type: Object,
                default() {
                    return null;
                }
            },
            render: {
                type: Function,
                default() {
                    return () => {};
                }
            },
            sc: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        render: (h, ctx) => {
            const arr = [];
            const params = {
                row: ctx.props.row,
                index: ctx.props.sc.$index
            };
            arr.push(ctx.props.render(h, params));
            return h('div', arr, '');
        }
    };
</script>
