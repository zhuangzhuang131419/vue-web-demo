<template>
    <div class="scholl-info">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="渠道名称：">
          <el-input size="small" v-model="formInline.channelName" placeholder="渠道名称" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="渠道ID：">
          <el-input size="small" v-model="formInline.channelID" placeholder="渠道ID"></el-input>
        </el-form-item>
<!--        <el-form-item label="管理员：">-->
<!--          <el-input size="small" v-model="formInline.manager" placeholder="管理员"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="schoolShowList" size="small" style="width: 100%;">
        <el-table-column label="ID"  width="80" prop="id"></el-table-column>
        <el-table-column label="渠道名称" width="180" prop="channel_name"></el-table-column>
        <el-table-column label="渠道ID"  width="120" prop="channel_id"></el-table-column>
        <el-table-column label="研发"  width="180" prop="development"></el-table-column>
        <el-table-column label="产品"  width="100" prop="product"></el-table-column>
        <el-table-column label="法务"  width="100" prop="law"></el-table-column>
        <el-table-column label="创建时间"  width="300" prop="create_at"></el-table-column>
        <el-table-column label="上次更改时间"  width="300" prop="last_update_at"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button @click.native.prevent="toAddRow()" size="small">增加</el-button>
            <el-button @click.native.prevent="toEditRow(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button @click.native.prevent="toDeleteRow(scope.row.id)" type="danger" size="small">删除</el-button>
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
        <el-dialog title="学校信息" :inline="true" :visible.sync="modalVisible" width="30%" :before-close="closeAddModal">
         <el-form ref="form" :model="form" label-width="100px" size="mini" class="demo-dynamic">
            <el-form-item label="学校名称：" prop="name"
              :rules="[{ required: true, message: '请输入学校名称', trigger: 'blur' }]">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="管理员：">
             <el-input v-model="form.manager"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：">
             <el-input v-model="form.contact"></el-input>
            </el-form-item>
            <el-form-item label="佣金：">
             <el-input v-model="form.commission"></el-input>
            </el-form-item>
            <el-form-item label="省份：" prop="province"
              :rules="[{ required: true, message: '请输入所在省份', trigger: 'blur' }]">
             <el-input v-model="form.province"></el-input>
            </el-form-item>
            <el-form-item label="详细地址：" prop="address"
              :rules="[{ required: true, message: '请输入学校地址', trigger: 'blur' }]">
             <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAddModal">取 消</el-button>
            <el-button type="primary" @click="addRow">确 定</el-button>
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
        channelID: ''
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
    api.getBDQTrackerInfoList().then((res) => {
      console.log(res);
      this.schoolList = res.data;
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
        'channel_id': '',
        'channel_name': '',
        'development': '',
        'product': '',
        'law': '',
        'create_at': '',
        'last_update_at': ''
      };
      this.form.id = this.schoolList.length;
      this.modalVisible = true;
    },
    addRow () {
      var para = {'channel_name': 'HSBC', 'channel_id': '555', 'product': 'p', 'development': 'd', 'law': 'l'};

      // para.append('channel_name', 'HSBC');
      // para.append('channel_id', '555');
      // para.append('product', 'p');
      // para.append('development', 'd');
      // para.append('law', 'l');

      api.insert(JSON.stringify(para));
      this.schoolList.push(this.form);
      this.modalVisible = false;
    },
    toEditRow (row) {
      this.form = row;
      this.modalVisible = true;
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
    },
    change (e) {
      console.log('Force update');
      this.$forceUpdate();
    }
  },
  computed: {
    pageCount () {
      return this.schoolList.length;
    },
    schoolShowList () {
      let ths = this;
      let returnList = ths.schoolList.filter(function (item) {
        return (ths.formInline.channelID === '' || item.channel_id.indexOf(ths.formInline.channelID) !== -1) &&
          (ths.formInline.channelName === '' || item.channel_name.indexOf(ths.formInline.channelName) !== -1);
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

    .pagination {
      padding: 10px 0;
    }
  }
</style>
