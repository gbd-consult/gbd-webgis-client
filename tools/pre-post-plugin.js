// easy pre/post compilation plugin

function PrePostPlugin(pre, post) {
  this.pre = pre;
  this.post = post;
}

PrePostPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compile', this.pre);
  compiler.plugin('done', this.post);
};

module.exports = PrePostPlugin;

