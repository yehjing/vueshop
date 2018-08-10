<template>
  <div>
    <div class="text-right">
      <button class="mt-4 btn btn-success" @click="openProductModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-right">原價</th>
          <th width="120" class="text-right">售價</th>
          <th width="100">是否啟用</th>
          <th width="140">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ item.origin_price }}
          </td>
          <td class="text-right">
            {{ item.price }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openProductModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- productModal start-->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image"
                    placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid" alt="" :src="tempProduct.imageUrl">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title"
                    placeholder="請輸入標題" v-model="tempProduct.title">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                      placeholder="請輸入分類" v-model="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                      placeholder="請輸入單位" v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                      placeholder="請輸入原價" v-model="tempProduct.origin_price">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price"
                      placeholder="請輸入售價" v-model="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                      id="is_enabled" v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      >
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- productModal end-->

    <!-- delProductModal start -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delProductModal end-->
  </div>
</template>

<script>
// 載入 jquery
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      // 此項商品是否為新增商品
      isNew: false
    };
  },
  methods: {
    // admin取得商品列表
    getProducts() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/products`;
      const vm = this;
      this.$http.get(api).then(response => {
        // console.log(response.data.products);
        // 把商品列表存入data陣列中
        vm.products = response.data.products;
      });
    },
    // 改成用 methods 觸發，可以等 ajax 觸發完後再開啟 Modal
    // 傳入2個參數
    openProductModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },
    // 商品建立(新增)
    updateProduct() {
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product`;
      let httpMethod = "post";
      const vm = this;
      if (vm.isNew === false) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }
      // 注意 post 傳2個參數，此 API 是傳物件形式 不能直接傳 vm.tempProduct
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        console.log(response.data);
        // 如果新增成功
        if (response.data.success) {
          $("#productModal").modal("hide");
          // 重新取得遠端資料
          vm.getProducts();
        } else {
          console.log("新增失敗");
        }
      });
    },
    openDelProductModal(item) {
      const vm = this;
      $("#delProductModal").modal("show");
      vm.tempProduct = Object.assign({}, item);
    },
    // 刪除商品
    delProduct(){
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then(res => {
        // console.log(res,vm.tempProduct.id)
        $("#delProductModal").modal("hide");
        // 重新取得商品列表
        this.getProducts();
      })
    },
    // 檔案上傳
    uploadFile() {
      // console 查看檔案位置 在 this.$refs.files.files array 裡
      // console.log(this);
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      // 建立一個 formData 物件
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      // 定義路徑
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
      // 送出 formData
      this.$http.post(api, formData, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.success) {
          // 如果成功就把路徑存到 tempProduct.imageUrl 裡
          // vm.tempProduct.imageUrl = res.data.imageUrl;
          // console.log(vm.tempProduct);
          // 把路徑強制寫入跟圖片網址做雙向綁定
          vm.$set(vm.tempProduct, 'imageUrl', res.data.imageUrl);
        }
      })
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
