<script setup>
defineProps({
  value: JSON,
});

const jsonColor = (json) => {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
};
</script>

<template>
  <div class="col-sm-12">
    <pre class="json-view" v-html="jsonColor(value)"></pre>
  </div>
</template>

<style>
.json-view {
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
}

body.dark-only .json-view {
  background-color: #262932 !important;
  box-shadow: 1px 1px 2px 1px rgba(29, 28, 28, 0.08);
}

body.dark-only .string {
  color: #ffffff99;
}

.string {
  color: #2f2f3b;
}

.number {
  color: rgb(53, 88, 247);
}

.boolean {
  color: #7366ff;
}

.null {
  color: rgb(247, 222, 247);
}

.key {
  color: #fd5d93;
  font-weight: bold;
}
</style>
