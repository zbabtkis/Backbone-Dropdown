/**
 *
 * Backbone Dropdown Widget 1.0.0
 * Simple dropdown selection tool built with Backbone.js.
 * http://zacharybabtkis.com/demos/backbone-dropdown
 *
 * Copyright 2013, Zachary Babtkis
 * Licenced under MIT License.
 * http://opensource.org/licenses/MIT
 *
 */

/**
 * @class factory for Dropdown widgets.
 *
 * @attribute _options
 * @method    configure
 */

var Dropdown = (function() {
    /**
     * CONSTANTS
     */
    var CLASS_ANIMATE   = "animated"
      , CLASS_NOANIMATE = "no-animation"
      , CLASS_ACTIVE    = "active"
      , TEMPLATE        = "<div class='current'><span class='item'><%= current %></span></div>"
                        + "<ul role='listbox' class='dd-list'><% _.each(items, function(item) { %>"
                        + "<li role='option' id='<%= item.label.replace(\" \", \"-\") %>' data-label='<%= item.label %>' data-value='<%= item.value %>'>"
                        + "<%= item.label%></li><% }); %></ul>";
    
    var Model = Backbone.Model.extend({
        defaults: {
            label: 'Default',
            value: 1,
            isSelected: false
        }
    });
    
    var Collection = Backbone.Collection.extend({
        model: Model,
        select: function(value) {
            var choose   = this.findWhere({value: value}),
                selected = this.getCurrent();
            
            if(selected) selected.set('isSelected', false, {silent: true});
            
            choose.set('isSelected', true);
        },
        getCurrent: function() {
            return this.findWhere({isSelected: true});
        }
    });
    
    var View = Backbone.View.extend({
        tagName: 'div',
        
        className: 'dropdown',
        
        template: _.template(TEMPLATE),
        
        events: {
            'click li':'_chooseItem',
            'click .current': 'open'
        },
        
        initialize: function() {
            
            _.bindAll(this, 'close');
            
            this.collection = new Collection();
            this.listenTo(this.collection, 'change:isSelected', this.render);
            
            _.defaults(this.options, Dropdown.configure());                 // Set view defaults specified by arguments or configure method.
            
            Dropdown._register(this);
            
            return this;
            
        },
        
        render: function() {            
            var current        = this.collection.findWhere({isSelected: true})
              , themeClass     = this.options.theme
              , animationClass = this.options.animated ? CLASS_ANIMATE : CLASS_NOANIMATE
              , html           = this.template({
                  items: this.collection.toJSON()                           // For rendering list of all models.
                , current: current ? current.get('label') : null            // For rendering currently selected model.
              });
                                
            this.$el.html(html)
                .addClass(animationClass + " " + themeClass);
            
            return this;
        },
        
        // Sets clicked model on collection.
        _chooseItem: function(e) {
            var value = $(e.currentTarget).data('value');
                                    
            this.value(value);                                               // Tell the collection which model to select.
            this.close();
                        
            return this;
        },
        
        open: function(e) {   
            e.stopPropagation();
                
            
            $('body').on('click', this.close);                               // Clicks outside of list close list.
            this.$('ul').addClass(CLASS_ACTIVE);
            
            return this;
        },
        
        close: function() {
            $('body').off('click', this.close);
            this.$('ul').removeClass(CLASS_ACTIVE);
            
            return this;
        },
        
        // Convenience method for setting/getting current value.
        value: function(val) {
            var selected;
            
            if(val) {
                this.collection.select(val);                                  // Set val if argument provided.
            }
            
            selected = this.collection.getCurrent();                          // Get currently selected model.
            
            return selected ? selected.get('value') : '';                     // Return the value of currently selected model.
        }
    });

    // Return widget class.
    return View;
}());

/**
 * @ private
 * Holds current global options
 */
Dropdown._options  = {};
/**
 * @private
 * Holds all widgets currently in DOM.
 */
Dropdown._elements = [];

/**
 * @private
 * Register new element in _elements.
 */
Dropdown._register = function(el) { this._elements.push(el); }

/**
 * @public
 * Set global configuration options.
 */
Dropdown.configure = function(options) {
    
    if(options) {
        _.extend(this._options, options);
    }
        
    return this._options;
}