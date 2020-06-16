<template>
  <div class="withdraw">
<!--    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">-->
<!--      <el-form-item label="渠道名称：">-->
<!--        <el-input size="small" v-model="formInline.channelName" placeholder="渠道名称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="国家：">-->
<!--        <el-input size="small" v-model="formInline.country" placeholder="国家"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="支付方式：">-->
<!--        <el-input size="small" v-model="formInline.paymentType" placeholder="支付方式"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="是否可转售：">-->
<!--        <el-input size="small" v-model="formInline.resalable" placeholder="是否可转售"></el-input>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-table :data="schoolShowList" style="width: 100%;" max-height="750">>
      <el-table-column label="ID"  width="80" prop="id"></el-table-column>
      <el-table-column label="修改人" width="200" prop="editor"></el-table-column>
      <el-table-column label="修改时间"  width="250" prop="update_at"></el-table-column>
      <el-table-column label="修改字段"  width="250" prop="updated_field"></el-table-column>
      <el-table-column label="旧值"  width="250" prop="updated_field_old"></el-table-column>
      <el-table-column label="新值"  width="250" prop="updated_field_new"></el-table-column>
      <el-table-column label="操作"  width="250" prop="operation"></el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from 'src/api/index';

  export default {
    data () {
      return {
        formInline: {
          channelName: '',
          paymentType: '',
          country: '',
          resalable: ''
        },
        schoolList: [],
        currentPage: 1,
        pageSize: 10,
        modalVisible: false,
        form: {}
      };
    },
    created () {
      this.$Progress.start();
      const recordId = this.$route.query.recordId;
  
      console.log('recordID' + recordId);
      api.getHistoryRecord(recordId, '').then((res) => {
        console.log(res);
        this.schoolList = res.data === null ? [] : res.data;
        this.$Progress.finish();
      });
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val;
      },
      handleCurrentChange (val) {
        this.currentPage = val;
      },
      toAddRow () {
        this.form = {
          'id': '',
          'editor': '',
          'update_at': '',
          'updated_field': '',
          'updated_field_old': '',
          'updated_field_new': '',
          'operation': ''
        };
        this.modalVisible = true;
        this.isAdd = true;
      },
      closeAddModal () {
        this.modalVisible = false;
      },
      onSubmit () {
        console.log('onSubmit');
      },
      formatBool: function (row, column) {
        return row.resalable ? '是' : '否';
      }
    },
    computed: {
      pageCount () {
        return this.schoolList.length;
      },
      schoolShowList () {
        let ths = this;
        let returnList = ths.schoolList.filter(function (item) {
          return (ths.formInline.channelName === '' || item.channel_name.toLowerCase().indexOf(ths.formInline.channelName.toLowerCase()) !== -1) &&
            (ths.formInline.country === '' || item.country.toLowerCase().indexOf(ths.formInline.country.toLowerCase()) !== -1) &&
            (ths.formInline.resalable === '' || (item.resalable ? '是' : '否').toLowerCase().indexOf(ths.formInline.resalable.toLowerCase()) !== -1) &&
            (ths.formInline.paymentType === '' || item.payment_type.toLowerCase().indexOf(ths.formInline.paymentType.toLowerCase()) !== -1);
        });

        // return returnList && returnList.slice((ths.currentPage - 1) * ths.pageSize, ths.currentPage * ths.pageSize);
        return returnList.reverse();
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .withdraw {
    padding: 20px;
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
  }
</style>
