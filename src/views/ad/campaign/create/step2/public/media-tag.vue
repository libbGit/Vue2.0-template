<template>
  <el-form-item>
    <div slot="label"><el-checkbox :value="media_check" @input="update_media_check"></el-checkbox> 媒体定向</div>
    <div v-show="media_check">
      <div style="border:1px solid #eee; display: inline-block;">
        <template v-for="tags in tag_list" >
          <checkbox-list v-if="tags.type == 1"
            :title="tags.name"
            :value="platform_id"
            @input="update_platform_id"
            :items="transform_id_string(tags.tag)"
            :props="props" />
          <checkbox-list v-if="tags.type == 2"
            :title="tags.name"
            :value="mediatype_id"
            @input="update_mediatype_id"
            :items="transform_id_string(tags.tag)"
            :props="props" />
          <checkbox-list v-if="tags.type == 3"
            :title="tags.name"
            :value="channel_id"
            @input="update_channel_id"
            :items="transform_id_string(tags.tag)"
            :props="props" />
          <checkbox-list v-if="tags.type == 4"
            :title="tags.name"
            :value="position_id"
            @input="update_position_id"
            :items="transform_id_string(tags.tag)"
            :props="props" />
          <checkbox-list v-if="tags.type == 5"
            :title="tags.name"
            :value="adform_id"
            @input="update_adform_id"
            :items="transform_id_string(tags.tag)"
            :props="props" />
        </template>
      </div>
      <media-config :check="media_check" @pos:status="getPosStatus"/>
    </div>
  </el-form-item>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import CheckboxList from '@/views/public/checkbox-list'
  import MediaConfig from './media-config'

  export default {
    name: 'media-tag',
    data () {
      return {
        tag_list: [],
        props: {
          prop: 'id',
          label: 'name'
        }
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'media_check',
        'platform_id',
        'mediatype_id',
        'channel_id',
        'position_id',
        'adform_id',
      ])
    },
    watch: {
      // 不勾选怎默认选中所有点位，所以这需要取消条件限制
      media_check (value) {
        if ( !value ) {
          this.update_platform_id([])
          this.update_mediatype_id([])
          this.update_channel_id([])
          this.update_position_id([])
          this.update_adform_id([])
        }
      }
    },
    created() {
      this.fetch_media_filter();
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_media_check',
        'update_platform_id',
        'update_mediatype_id',
        'update_channel_id',
        'update_position_id',
        'update_adform_id',
      ]),
      fetch_media_filter() {
        fetch.post('/mediaPos/tagList')
          .then( res => {
            if( res.ret == 0) {
              this.tag_list = res.data
            }
            else {
              this.$message.error('获取点位标签列表出错！')
            }
          })
          .catch( err => {
            this.$message.error( err.message);
          });
      },
      transform_id_string(arr){
        return arr.map(item => {
          item.id = item.id + ''
          return item;
        })
      },

      getPosStatus(status){
        this.$emit("pos:status", status);
      }
    },
    components: {
      MediaConfig,
      CheckboxList
    }
  }
</script>
