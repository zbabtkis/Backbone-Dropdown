Backbone Dropdown
=================
A simple Backbone.js based dropdown widget for your web app!

##Basic Use

To create a dropdown box, instantiate, render and append the element to the DOM.
```javascript
var widget = new Dropdown();
                
widget.render().$el.appendTo('#basic-use .example');
```
###Adding Models

Of course, the above example isn't very useful == what are you supposed to do with a dropdown that doesn't have any options to select from? To add options, add new backbone models to the dropdown collection before rendering.

```javascript
widget.collection.add([
    {label: 'Something', value: 'someval'},
    {label: 'Something Else', value: 'someotherval'}
]);


widget.render();
```

##Configure
To set global configuration options for dropdown widgets in your app, use the configure method on the Dropdown object.

```javascript
Dropdown.configure({
    theme: 'theme-green',  // Set default theme css class    : defaults to 'theme-green'.
    animated: true         // Animate widgets (true | false) : defaults to true.
});
```

You can pass the same argument into the constructor to set configuration options individually.

new Dropdown({theme: 'theme-yellow'})

*Theme options:*
* theme-yellow
* theme-green
* theme-red
* theme-blue

##API

Most of the Dropdown widgets inner workings are self explanatory and standard for Backbone. Lucky for you there are a couple convenience methods that will make your job easier!

###Set Value
You can set the value programatically, and the widget's view will update automatically.

```html
<select id='select-value'>
    <option value='someval'>Something</option>
    <option value='someotherval'>Something Else</option>
</select>
```
```javascript
$('#select-value').change(function() {
    var val = $(this).val();
    widget.value(val);
});
```

###Get Value
Use the value method without any arguments to get the current selected value.

```javascript
widget.value();
```

To view more documentation, visit http://www.zacharybabtkis.com/demos/backbone-dropdown
