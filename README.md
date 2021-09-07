# babel-plugin-catch
Add trycatch to your magic comment

## Installlation

```sh
npm install babel-plugin-catch or yarn add babel-plugin-catch
```

## Uasge


```javascript
  const test = (/* catch */) => {

  }
  class Test{
    test(/* catch */){

    }

    test = (/* catch */) => {

    }
  }
```
**.babelrc**

```javascript
{
  "plugins": [
    ["babel-plugin-catch", {
      catchCode?: (e) => {

      },
      finallyCode?: () =>{

      }
    }]
  ]
}
```

### Via CLI

```sh
$ babel --plugins babel-plugin-catch script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["babel-plugin-catch"]
});
```