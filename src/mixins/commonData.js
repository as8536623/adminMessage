import {getIndustry, getJob, getSubject} from '@/utils/common';

export default {
    data() {
        return {
            industryList: [],
            jobList: [],
            subjectList: []
        };
    },
    async mounted() {
        await this.getIndustry();
        await this.getJob();
        await this.getSubject();
    },
    methods: {
        async getIndustry() {
            this.industryList = await getIndustry();
        },
        async getJob() {
            this.jobList = await getJob();
        },
        async getSubject() {
            this.subjectList = await getSubject();
        }
    }
};
