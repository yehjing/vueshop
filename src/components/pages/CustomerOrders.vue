<template>
  <div>
    <!-- Loading 套件 -->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 400px; background-size: cover; background-position: center"
            :style="{backgroundImage : `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.description }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.origin_price">{{ item.origin_price }}</div>
              <del class="h6" v-if="item.origin_price">原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5" v-if="item.price && item.origin_price">現在只要 {{ item.price | currency }} 元</div>
              <div class="h5" v-else> {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.description }}</p>
              <footer class="blockquote-footer mt-3">{{ product.content }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.origin_price">{{ product.origin_price }}</div>
              <del class="h6" v-if="product.origin_price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h4" v-if="product.price && product.origin_price">現在只要 {{ product.price | currency }} 元</div>
              <div class="h4" v-else>{{ product.price | currency }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price | currency }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 購物車列表 start -->
    <div class="my-5 row justify-content-center">
      <div class="col-md-6">
        <table class="table">
          <thead>
            <th>
              <button type="button" class="btn btn-outline-danger btn-sm">
                <i class="far fa-trash-alt"></i>
              </button>
            </th>
            <th>品名</th>
            <th>數量</th>
            <th class="text-right">單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <small class="text-success d-block" v-if="item.coupon">
                  已套用優惠券
                </small>
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total | currency }}</td>
            </tr>
            <tr v-if="cart.total !== cart.final_total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="couponCode" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 購物車列表 end -->
    <div class="my-5 row justify-content-center">
        <form class="col-md-6" @submit.prevent="createOrder">
          <div class="form-group">
            <label for="useremail">Email</label>
            <input type="email" class="form-control" name="email" id="useremail" placeholder="請輸入 Email"
              :class="{'is-invalid' : errors.has('email')}"
              v-model="form.user.email" v-validate="'required|email'">
            <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
          </div>
        
          <div class="form-group">
            <label for="username">收件人姓名</label>
            <input type="text" class="form-control" name="name" id="username" placeholder="輸入姓名"
              :class="{'is-invalid' : errors.has('name')}"
              v-model="form.user.name" v-validate="'required'">
            <span class="text-danger" v-if="errors.has('name')">姓名必須填入</span>
          </div>
        
          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input type="tel" class="form-control" id="usertel" placeholder="請輸入電話">
          </div>
        
          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input type="address" class="form-control" name="address" id="useraddress" placeholder="請輸入地址"
              v-model="form.user.address" v-validate="'required'"
              :class="{'is-invalid' : errors.has('address')}">
            <span class="text-danger" v-if="errors.has('address')">收件人地址不能留空</span>
          </div>
        
          <div class="form-group">
            <label for="useraddress">留言</label>
            <textarea name="" id="" class="form-control" cols="30" rows="10"></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      status: {
        loadingItem: ""
      },
      cart: {},
      couponCode: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  methods: {
    // 取得產品列表
    getProducts() {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    // 取得單一商品細節 開啟 Modal
    getProduct(id) {
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        // 先取得資料再開啟 Modal
        vm.product = response.data.product;
        // 點擊查看更多預設商品數量為 1
        vm.product.num = 1;
        $("#productModal").modal("show");
        // console.log(response.data);
        vm.status.loadingItem = "";
      });
    },
    // 加入購物車 => 會有2種行為 先加入購物車 再把購物車裡的資料取回
    addToCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(api, { data: cart }).then(response => {
        // console.log(response.data)
        vm.status.loadingItem = "";
        // 加入購物車後，記得要把購物車內容取回來
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
    // 取回購物車裡的資料
    getCart() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      // vm.isLoading = true;
      this.$http.get(api).then(response => {
        // console.log(response.data.data)
        vm.cart = response.data.data;
        // vm.isLoading = false;
      });
    },
    // 刪除購物車
    removeCartItem(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        vm.getCart();
        vm.isLoading = false;
      });
    },

    // 套用優惠券
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.couponCode
      };
      vm.isLoading = true;
      this.$http.post(api, { data: coupon }).then(response => {
        // console.log(response.data)
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      // vm.isLoading = true;
      this.$validator.validate().then((result) => {
        if (result) {
          this.$http.post(api, { data: vm.form }).then(response => {
            console.log(response.data);
            if(response.data.success) {
              vm.$router.push(`/customer_checkout/${response.data.orderId}`)
            }
            // vm.getCart();
            // vm.isLoading = false;
          });
        }else{
          console.log('欄位不完整')
        }
      });
    }
  },
  created() {
    this.getProducts();
    // 在開始時，先取得購物車內容
    this.getCart();
  }
};
</script>
<style scoped>
.blockquote-footer:before {
  content: "";
}
</style>
