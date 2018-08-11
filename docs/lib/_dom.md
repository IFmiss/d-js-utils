# dom对象
dom对象是d-utlis里的一个属性，此属性下包含了已有的和dom相关的一些方法和工具

## hasClass
`hasClass`是判断元素中是否存在某一个className
##### 参数
  - `el` dom元素
  - `className` class名称
```js
/**
 * 判断元素是否存在某个class类
 * @param { Element } el dom元素
 * @param { String } className class名称
 */
```

## addClass
`addClass`给元素添加className
##### 参数
  - `el` dom元素
  - `className` class名称
```js
/**
 * 元素添加class
 * @param { Element } el dom元素
 * @param { (String | Array) } className class名称，可以是多个
 */
```

## rmClass
`addClass`删除元素的某个className
##### 参数
  - `el` dom元素
  - `className` class名称
```js
/**
 * 元素删除class
 * @param { Element } el dom元素
 * @param { (String | Array) } className class名称，可以是多个
 */
```

## getComputedStyle
`getComputedStyle`获取元素的css属性内容
##### 参数
  - `el` dom元素
  - `cssProp` css的属性名称
```js
/**
 * 获取元素的css属性内容
 * @param { Element } el dom元素
 * @param { String } cssProp css的属性名称
 * @returns { String } css对应的属性的值
 */
```