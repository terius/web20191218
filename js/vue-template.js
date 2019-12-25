Vue.component("v-footer", {
  props: {
    name: "",
    id: 0
  },
  computed: {
    pid() {
      if (!this.id) {
        return defaultId;
      }
      return this.id;
    }
  },
  template: `<footer class="nav">
  <ul>
    <li>
      <a href="/page/index.html">
        <div>
          <img v-if="name=='index'" src="../img/icon01_pre.png" />
          <img v-else src="../img/icon01.png" />
          <h1>首页</h1>
        </div>
      </a>
    </li>
    <li>
      <a :href="'/page/blog.html?id=' + pid">
        <div>
        <img v-if="name=='blog'" src="../img/icon02_pre.png" />
        <img v-else src="../img/icon02.png" />
          <h1>博客</h1>
        </div>
      </a>
    </li>
    <li class="publish">
      <a href="/page/BlogType.html">
        <div>
          <img src="../img/icon03.png" />
        </div>
      </a>
    </li>
    <li>
      <a href="/page/MessageCenter.html">
        <div>
          <img src="../img/icon04.png" />
          <h1>消息</h1>
        </div>
      </a>
    </li>
    <li>
      <a href="/page/PersonCenter.html">
        <div>
          <img src="../img/icon05.png" />
          <h1>我的</h1>
        </div>
      </a>
    </li>
  </ul>
</footer>`
});

Vue.component("v-blog-type", {
  props: {
    list: Array,
    isShow: Boolean
  },
  data() {
    return {
      selectItems: []
      //  isShow: false
    };
  },
  computed: {
    parentList() {
      return com.getNodupInArray(this.list, "parent_type");
    }
  },
  methods: {
    getTypes(parentType) {
      return this.list.filter(d => d.parent_type == parentType);
    },
    selectItem(guid) {
      if (com.checkArrayExistValue(this.selectItems, guid)) {
        com.removeItem(this.selectItems, guid);
      } else {
        this.selectItems.push(guid);
      }
      console.log(this.selectItems, "this.selectItems");
    },
    checkInItem(guid) {
      return com.checkArrayExistValue(this.selectItems, guid);
    },
    open() {
      this.isShow = true;
      this.$emit("update:isShow", true);
    },
    close() {
      this.isShow = false;
      this.$emit("update:isShow", false);
    }
  },
  template: `<div class="coverbox indexcoverbox" v-show="isShow">
  <div class="cover" @click="close()"></div>
  <div class="covercont">
    <div class="coverscroll">
    <span class="close-tab" @click="close()">关闭</span>
     <div  v-for="(parenttype,index) in parentList" :key="index">
      <h1 class="covertit">{{parenttype}}</h1>
      <ul class="coverul">
        <li v-for="item in getTypes(parenttype)">
          <div @click="selectItem(item.guid)" :class="{selecttype:checkInItem(item.guid)}">{{item.name}}</div>
        </li>
      </ul>
      </div>
     </div>
    <div class="pubbtn coversure" @click="close()">确定</div>
  </div>
</div>`
});
