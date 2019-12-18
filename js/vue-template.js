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
