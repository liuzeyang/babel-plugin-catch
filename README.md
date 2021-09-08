# babel-plugin-catch
Add trycatch to your magic comment

## Installlation

```sh
npm install babel-plugin-catch or yarn add babel-plugin-catch
```

## Usage


```javascript
  const test = (num/* catch */) => {

  }
  class Test{
    test(num, num2/* catch */){

    }

    test = (num, num2/* catch */) => {

    }
  }
```
**.babelrc**

```javascript
{
  "plugins": [
    ["babel-plugin-catch", {
      comment?: 'catch',
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