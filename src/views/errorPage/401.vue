<template>
    <div class="errPage-container">
        <el-button icon="arrow-left" class="pan-back-btn" @click="back">{{ $t('return') }}</el-button>
        <el-row>
            <el-col :span="12">
                <h1 class="text-jumbo text-ginormous">Oops!</h1>
                {{ $t('gifSource') }}<a href="https://zh.airbnb.com/" target="_blank">airbnb</a> {{ $t('page') }}
                <h2>{{ $t('youDoNotHavePermissionToGoToThisPage') }}</h2>
                <h6>{{ $t('contactLead') }}</h6>
                <ul class="list-unstyled">
                    <li>{{ $t('orYouCanGo') }}</li>
                    <li class="link-type">
                        <router-link to="/dashboard">{{ $t('backToTheHomePage') }}</router-link>
                    </li>
                    <li class="link-type"><a href="/">{{ $t('havingALook') }}</a></li>
                    <li><a href="#" @click.prevent="dialogVisible=true">{{ $t('letMeLookAtThePicture') }}</a></li>
                </ul>
            </el-col>
            <el-col :span="12">
                <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
            </el-col>
        </el-row>
        <el-dialog append-to-body title="$t('justLookAt')" :visible.sync="dialogVisible">
            <img class="pan-img" :src="ewizardClap">
        </el-dialog>
    </div>
</template>

<script>
    import errGif from '@/assets/401_images/401.gif';

    export default {
        name: 'Page401',
        data() {
            return {
                errGif: errGif + '?' + +new Date(),
                ewizardClap:
                    'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
                dialogVisible: false
            };
        },
        methods: {
            back() {
                if (this.$route.query.noGoBack) {
                    this.$router.push({path: '/dashboard'});
                } else {
                    this.$router.go(-1);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
