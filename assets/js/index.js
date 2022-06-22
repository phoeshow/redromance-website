class App {
  constructor() {
    this.initEl();
  }

  initEl() {
    this.elMap = {
      testBtn: document.getElementById('test'),
    };
  }

  bindEvent(elName, method, cb) {
    this.elMap[elName].addEventListener(method, cb);
  }

  render() {
    return null;
  }
}

const app = new App();

app.bindEvent('testBtn', 'click', function (e) {
  console.log(e);
});
