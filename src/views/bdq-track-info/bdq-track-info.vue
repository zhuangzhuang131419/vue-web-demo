<template>
  <div class="scholl-info">
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item label="渠道名称：">
        <el-input size="small" v-model="formInline.channelName" placeholder="渠道名称"></el-input>
      </el-form-item>
      <el-form-item label="国家：">
        <el-input size="small" v-model="formInline.country" placeholder="国家"></el-input>
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-input size="small" v-model="formInline.paymentType" placeholder="支付方式"></el-input>
      </el-form-item>
      <el-form-item label="是否可转售：">
        <el-input size="small" v-model="formInline.resalable" placeholder="是否可转售"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit" v-if="false">提交</el-button>
        <el-button size="small" type="primary" @click.native.prevent="toAddRow()" >增加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="schoolShowList" size="small" style="width: 100%;">
      <el-table-column label="ID"  width="80" prop="id"></el-table-column>
      <el-table-column label="渠道名称" width="100" prop="channel_name"></el-table-column>
      <el-table-column label="产品"  width="400" prop="product"></el-table-column>
      <el-table-column label="HQ Country"  width="100" prop="HQ_country"></el-table-column>
      <el-table-column label="覆盖国家"  width="100" prop="country"></el-table-column>
      <el-table-column label="是否可转售"  width="80" prop="resalable" :formatter="formatBool"></el-table-column>
      <el-table-column label="支付方式"  width="100" prop="payment_type"></el-table-column>
      <el-table-column label="BD_Owner"  width="100" prop="BD_Owner"></el-table-column>
      <el-table-column label="PM"  width="100" prop="PM"></el-table-column>
      <el-table-column label="渠道运营Owner"  width="200" prop="channel_operation_owner"></el-table-column>
      <el-table-column label="备注"  width="300" prop="description"></el-table-column>
      <el-table-column label="创建时间"  width="200" prop="create_at"></el-table-column>
      <el-table-column label="上次更改时间"  width="200" prop="last_update_at"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click.native.prevent="toEditRow(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click.native.prevent="toDeleteRow(scope.row.id)" type="danger" size="small">删除</el-button>
          <el-button @click.native.prevent="toGetRowHistory(scope.row.id)" type="info" size="small">查询历史</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="pageCount">
      </el-pagination>
    </div>

    <div class="dialog">
      <el-dialog title="渠道信息" :inline="true" :visible.sync="modalVisible" width="40%" :before-close="closeAddModal">
        <el-form ref="form" :model="form" label-width="150px" size="mini" class="demo-dynamic">
          <el-form-item label="渠道名称：" prop="channel_name"
                        :rules="[{ required: true, message: '请输入渠道名称', trigger: 'blur' }]" :disabled="!isAdd">
            <el-input v-model="form.channel_name"></el-input>
          </el-form-item>
          <el-form-item label="产品：">
            <el-input type="textarea" autosize v-model="form.product" placeholder="请输入产品内容"></el-input>
          </el-form-item>
          <el-form-item label="HQ Country：" prop="HQ_country"
                        :rules="[{ required: true, message: '请输入渠道总部国家', trigger: 'blur' }]">
            <el-input v-model="form.HQ_country"></el-input>
          </el-form-item>
          <el-form-item label="Country：" prop="country"
                        :rules="[{ required: true, message: '请输入渠道覆盖国家', trigger: 'blur' }]">
            <el-input v-model="form.country"></el-input>
          </el-form-item>
          <el-form-item label="是否可转售：" prop="resalable"
                        :rules="[{ required: true, message: '是否可以转售', trigger: 'blur' }]">
            <el-radio-group v-model="form.resalable">
              <el-radio :label=true>是</el-radio>
              <el-radio :label=false>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payment_type">
            <el-radio-group v-model="form.payment_type">
              <el-radio v-for="payment_type in paymentTypes" :label="payment_type" :key="payment_type">{{payment_type}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="BD_Owner：" prop="BD_Owner"
                        :rules="[{ required: true, message: '请输入BD_Owner', trigger: 'blur' }]">
            <el-input v-model="form.BD_Owner"></el-input>
          </el-form-item>
          <el-form-item label="PM：">
            <el-input type="textarea" autosize v-model="form.PM" placeholder="请输入PM"></el-input>
          </el-form-item>
          <el-form-item label="渠道运营Owner：">
            <el-input type="textarea" autosize v-model="form.channel_operation_owner" placeholder="请输入渠道运营Owner"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" autosize v-model="form.description" placeholder="请输入备注内容"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeAddModal">取 消</el-button>
            <el-button type="primary" @click="addRow" v-if="isAdd">确 定 添 加</el-button>
            <el-button type="primary" @click="_editRow" v-if="!isAdd">确 定 编 辑</el-button>
          </span>
      </el-dialog>
    </div>
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
        form: {},
        // 是处于添加状态还是编辑状态
        isAdd: false,
        paymentTypes: ['Cards', 'Cash', 'Wallet', 'DCB', 'Points', 'BankTransfer', 'DirectDebit', 'GiftCards', 'AppStore']
      };
    },
    created () {
      this.$Progress.start();
      api.getBDQTrackerInfoList().then((res) => {
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
          'channel_name': '',
          'HQ_country': '',
          'country': '',
          'product': '',
          'resalable': '',
          'payment_type': '',
          'BD_Owner': '',
          'PM': '',
          'channel_operation_owner': '',
          'create_at': '',
          'last_update_at': '',
          'description': ''
        };
        this.modalVisible = true;
        this.isAdd = true;
      },
      addRow () {
        if (this.form.channel_name === '') {
          alert('请输入渠道名称');
          return;
        }

        var para = {
          'channel_name': this.form.channel_name,
          'HQ_country': this.form.HQ_country,
          'country': this.form.country,
          'product': this.form.product,
          'resalable': this.form.resalable,
          'payment_type': this.form.payment_type,
          'BD_Owner': this.form.BD_Owner,
          'PM': this.form.PM,
          'channel_operation_owner': this.form.channel_operation_owner,
          'description': this.form.description
        };

        api.insert(JSON.stringify(para));
        api.getBDQTrackerInfoList().then((res) => {
          this.schoolList = res.data === null ? [] : res.data;
          this.$Progress.finish();
        });
        // this.schoolList.push(this.form);
        this.modalVisible = false;
      },
      toEditRow (row) {
        console.log('编辑' + row);
        this.form = row;
        console.log('ID:' + this.form.id);
        this.modalVisible = true;
        this.isAdd = false;
      },
      toDeleteRow (rowId) {
        this.$confirm('请确认是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteRow(rowId);
        });
      },
      toGetRowHistory (rowId) {
        this.$Progress.start();
        api.getBDQTrackerInfoListByID(rowId).then((res) => {
          console.log(rowId + ' response: ' + res.data.record_id);
          this.$router.push({
            path: '/historyRecord',
            query: {
              recordId: String(res.data.record_id)
            }
          });
          this.$Progress.finish();
        });
      },
      closeAddModal () {
        this.modalVisible = false;
      },
      onSubmit () {
        console.log('onSubmit');
      },
      _deleteRow (rowId) {
        for (let i = 0; i < this.schoolList.length; i++) {
          let item = this.schoolList[i];

          if (item.id === rowId) {
            this.schoolList.splice(i, 1);
          }
        }
        api.deleteBDQRecord(rowId);
      },
      _editRow () {
        const para = {
          'id': this.form.id,
          'channel_name': this.form.channel_name,
          'HQ_country': this.form.HQ_country,
          'country': this.form.country,
          'product': this.form.product,
          'resalable': this.form.resalable,
          'payment_type': this.form.payment_type,
          'BD_Owner': this.form.BD_Owner,
          'PM': this.form.PM,
          'channel_operation_owner': this.form.channel_operation_owner,
          'description': this.form.description
        };

        api.updateBDQRecord(JSON.stringify(para));
        this.modalVisible = false;
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

        return returnList && returnList.slice((ths.currentPage - 1) * ths.pageSize, ths.currentPage * ths.pageSize);
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .scholl-info {
    padding: 0 20px;
    font-size: 20px;
    color: rgb(192, 204, 218);
    text-align: center;

    .pagination {
      padding: 10px 0;
    }
  }
</style>
