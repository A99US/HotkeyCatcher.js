# HotkeyCatcher.js

js library to catch and record keyboard hotkeys and sequences.



### Section
 - **[Demo](#demo)**
 - **[Hotkey Catcher](#hotkey-catcher)**
 - **[How To Use It](#how-to-use-it)**
 - **[Binding And Unbinding Event Listener](#binding-and-unbinding-event-listener)**
 - **[Addkey Function](#addkey-function)**
 - **[Outline / Border "Problem"](#outline--border-problem)**
 - **[Injecting Hotkeys To Websites With Userscript](#injecting-hotkeys-to-websites-with-userscript)**
 - **[Dependency](#dependency)**
 - **[License](#license)**



## Demo

Try the **[Demo Page](https://a99us.github.io/HotkeyCatcher.js)**



## Hotkey Catcher

When you include this library to your page, it will automatically add a listener that will record your keyboard input on keydown. Basically everytime you press a key, this library will record it and save it into an array. Then in your listener callback, you can use this array to check what hotkey or sequence that you were pressing. This array will be living in global variable **"window.hotkeycatcher.result"**. This result array will reset everytime you press different mod keys (Ctrl, Alt, Shift and Meta/Win).

```html
<!--
GitHub Page
https://a99us.github.io/HotkeyCatcher.js/hotkeycatcher.min.js
JSDelivr CDN
https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js/hotkeycatcher.min.js
-->
<script type="text/javascript" src="https://a99us.github.io/HotkeyCatcher.js/hotkeycatcher.min.js"></script>
```

Important thing to know is that this library only catch keydown (no keyup) and it use event.keyCode, not event.key.

Let say you're pressing **"ctrl z c x c"**, then the result array will have values like this :

```javascript
window.hotkeycatcher.result = {
  hotkey: [
    "ctrl c",
    "ctrl x c",
    "ctrl c x c",
    "ctrl z c x c",
  ],
  code: [67, 88, 67, 90],
  key: ["c", "x", "c", "z"],
  modkey: "ctrl",
  onlymodkey: false,
  message: ""
}
```

### hotkey

Contain array of possible hotkeys and sequences. Last hotkey you pressed will be the first item of array. In the example above, pressing **"ctrl z c x c"** will return 4 possible hotkeys/sequence : **"ctrl c"**, **"ctrl x c"**, **"ctrl c x c"** and **"ctrl z c x c"**. If you only want to catch a simple hotkey, you can just call the first item of the array :

```javascript
let hotkey = window.hotkeycatcher.result.hotkey[0];
if(hotkey == "ctrl c"){
  // Code
}
else if(hotkey == "ctrl x"){
  // Code
}
else if(hotkey == "ctrl shift x"){
  // Code
}
```

But if you want to catch sequences, you can use js function **includes()** :

```javascript
let sequences = window.hotkeycatcher.result.hotkey;
let checkSeq = str => sequences.includes(str);
switch(true) {
  case checkSeq("ctrl c x c") :
    // Code will run, since array includes "ctrl c x c"
    break;
  case checkSeq("ctrl z x c") :
    // code block
    break;
  case checkSeq("up up down down left right left right b a enter") :
    // code block
    break;
  default:
    // code block
}
```

Here's the list of keys available in this library :

**`` 0 to 9, numpad0 to numpad9, a to z, f1 to f12, backspace, tab, clear, enter, ctrl, alt, shift, meta (Windows key), pause, capslock, esc, space, pageup, pagedown, end, home, left, up, right, down, printscreen, insert, help, delete, contextmenu, numpad*, numpad+, numpad-, numpad., numpad/, numlock, scrolllock, audiomute, audiodown, audioup, mediaplayer, app1, app2 ``**

And symbol keys will be represented by their own symbols, not word description of them :

**`` ; = , - . / [ \ ] ' ` ``**

If there is a certain key that's not available, you can raise an issue in this repository, or you can add your own key to this library using **[hotkeycatcher.addkey()](#addkey-function)** function.

All these keys are in lowercase and key combinations must only have 1 space between them and no space at the start and the end. The mod keys are recorded in the order of **ctrl**, **alt**, **shift** and then lastly **meta**. So for example **"ctrl shift z"** is the correct order, not **"shift ctrl z"**. Of course you you can press **shift** first before **ctrl**, but this library is recording the modkeys in the aforementioned order.

Another important thing to note, to register a sequence you have to keep holding the mod keys but you're allowed to press and release non-mod keys. For example, sequence of **"ctrl z x c"** means you're pressing **ctrl**, and while still holding **ctrl** (not releasing it) you're pressing **z**, **x** and **c**. For more clarity, you can test it on **[Demo Page](https://a99us.github.io/HotkeyCatcher.js)**.

### code
Contain array of keyCode of keys that you pressed excluding mod keys, or keyCode of mod keys that you pressed when it's not combined with non-mod keys. Every key you pressed will be added to front.

### key
Contain array of keys that you pressed excluding mod keys, or mod keys that you pressed when it's not combined with non-mod keys. Every key you pressed will be added to front.

### modkey
When you're pressing a combination of mod keys and non-mod keys, this item will tell you what mod keys you're pressing. In the example above, the value is **"ctrl"**. When you're not pressing any mod key or only pressing mod keys without non-mod keys, this item will be empty.

### onlymodkey
When you're only pressing mod keys (not combined with non-mod keys), this item will be true. Otherwise it will be false.

### message
It will contain any error message.



## How To Use It

```javascript
document.addEventListener("keydown", evt => {
  let e = evt || window.event;
  let sequences = window.hotkeycatcher.result.hotkey;
  let hotkey = sequences[0];
  let checkSeq = str => sequences.includes(str);
  let checkHk = str => str == hotkey;
  switch(true) {
    case checkSeq("ctrl a s") :
      e.preventDefault();
      alert("Save all of them !!!");
      break;
    case checkHk("ctrl s") :
      e.preventDefault();
      alert("Save it !!!");
      break;
    default:
      // code block
  }
};
```



## Binding And Unbinding Event Listener

Additionally you can also add and remove listener using this library. It use jquery listener function for coding simplicity and convenience.

One of the biggest convenience adding listener with jquery is the namespace feature. It's very useful especially when you're developing a page that's intended to be embedded or an iframe, so listener doesn't *"stack up"*. When reloading your embedded page, listener with the same namespace on the same element on the same event type will be replaced.

### Binding Event Listener

`` hotkeycatcher.bind( namespace, target1, target2. . . targetn, callback ); ``

Binding function takes 3 arguments. The last one will always be the callback. If the first argument is a string, it would be taken as the namespace. Other than that, if it is an array it would be taken as the target. You can add more that 1 target in argument. Callback is the only mandatory argument in binding.

- Namespace

Namespace is optional. Namespace can only be alphabet (lowercase or uppercase) and number. Important thing to note is that it **MUST** contain letter and start with letter.

```javascript
// With namespace
hotkeycatcher.bind( 'customlistener', ["document","keydown"], callback );
// Without namespace
hotkeycatcher.bind( ["document","keydown"], callback );
```

- Target

Target is optional. If it's not provided, listener will default to be added to document on keydown. You can bind the same callback to different elements and different event types by providing 2 or more target.

Target is an array where 1st item is the target element (jquery selector) and 2nd is the event type. If the 1st item is null or empty, it will choose default **document**. If the 2nd item is null or empty, it will choose default **keydown**. This library only accept **keydown** and **keyup**.

```javascript
let target;
// Without target
hotkeycatcher.bind( callback );
// With 1 target
target = [
    "#editor"
    // 2nd item not provide, default to "keydown"
];
hotkeycatcher.bind( target, callback );
// With multiple targets
hotkeycatcher.bind( "multipleElement", ["#divstory", "keydown"], [".dataspread", null], callback );
```

- Callback

Callback will be the function run by this listener. By adding listener with this library, the **hotkeycatcher.result** array will be passed to callback argument directly like so :

```javascript
let calback = (e, hotkey, result) => {
  // e is event variable
  // hotkey is window.hotkeycatcher.result.hotkey[0]
  // result is window.hotkeycatcher.result
  // You can rename these three arguments anything you want
  if(hotkey == "ctrl x"){
    // Code
  }
  else if(result.hotkey.includes("ctrl x c v")){
    // Code
  }
};
hotkeycatcher.bind( callback );
```


### Unbinding Event Listener

`` hotkeycatcher.unbind( namespace, target1, target2. . . targetn ); ``

Unbinding function takes 2 arguments. First one is the namespace, everything after that is the target. Using this function, you can unbind listener that you added with this library as well as with jquery directly.


- Namespace

Namespace is mandatory. Just like in binding function, namespace can only be alphabet (lowercase or uppercase) and number. It **MUST** contain letter and start with letter.

- Target

Target is optional. If it's not provided, function will default to choose **document** as element and will remove listener from both **keydown** and **keyup**. You can unbind the same namespace from different elements and different event types by providing 2 or more target.

Target is an array, just like in binding function. 1st item of target is the target element (jquery selector) and 2nd is the event type. If the 1st item is null or empty, it will choose default **document**. If the 2nd item is null or empty, it will choose default wildcard, removing listener from both **keydown** and **keyup**.


```javascript
// Only namespace, no target
// It will remove "customlistener" from document, from both keydown and keyup
hotkeycatcher.unbind( "customlistener" );
// Namespace and 1 target
// Listener removed from element with id divdata
hotkeycatcher.unbind( "customlistener", ["#divdata",null] );
// Namespace and multiple targets
// Listener removed from element with id divdata and class spanspread
hotkeycatcher.unbind( "customlistener", ["#divdata"], [".spanspread"] );
```



## Addkey Function

You can also add your own key and keyCode to this library like so :

```javascript
window.hotkeycatcher.addkey({
  // key: keyCode
  backspace: 8,
  tab: 9
});
```



## Outline / Border "Problem"

When you bind a listener to a certain element (like div, pre, p, etc), it will create a border / shadow around the element. This is not an issue or a bug. This is actually an accessibility feature. Just like when your cursor is inside an input text, there would be a dark shadow around the input text to let you know that the cursor is inside the input text. To recreate this, you can go to demo page, click any text of hotkey, and then press any key. A shadow will appear around the div element.

If you want to remove that shadow, you can add a css style like so :

```javascript
let divtarget = "#datapreview";
$(divtarget).css({
  'outline': 'none'
});
```

Be aware that it might break your website appearance.



## Injecting Hotkeys To Websites With Userscript

You can also add custom hotkey to websites with HotkeyCatcher.js using userscript. You can add **[This Script](https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js/hotkeycatcher-userscript.js)** to your userscript extension and add your own hotkeys.

In that userscript, there are shortcuts to change twitter image resolution. Open this **[image from NASA](https://pbs.twimg.com/media/FzOzOdAWcAAQTmZ?format=jpg&name=240x240)** and type **z, x, c, v, b, n or m** to change its resolution.




## Dependency

The input listener and **addkey** function don't have any dependency because it is written in pure javascript. The binding and unbinding need jquery.



## License

[MIT](https://github.com/A99US/HotkeyCatcher.js/blob/main/LICENSE)

