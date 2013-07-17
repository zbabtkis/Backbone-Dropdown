var Dropdown = (function() {
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
            var choose = this.findWhere(value),
                selected = this.findWhere({isSelected: true})

            if(selected) selected.set('isSelected', false, {silent: true});
            
            choose.set('isSelected', true);
        }
    });
    
    var template = "<div class='current'><span class='item'><%= current %></span></div><ul class='dd-list'><% _.each(items, function(item) { %><li data-label='<%= item.label %>' data-value='<%= item.value %>'><%= item.label%></li><% }); %></ul>";
    
    var View = Backbone.View.extend({
        tagName: 'div',
        className: 'dropdown',
        template: _.template(template),
        events: {
            'click li':'chooseItem',
            'click .current': 'openList'
        },
        initialize: function() {
            this.collection = new Collection();
            
            _.bindAll(this, 'close');
                        
            this.listenTo(this.collection, 'change', this.render);
            
            return this;
        },
        render: function() {            
            var current = this.collection.findWhere({isSelected: true}),
                currentLabel = current ? current.get('label') : "",
                html = this.template({items: this.collection.toJSON(), current: currentLabel});
                                
            this.$el.html(html);
            
            this.$el.addClass(Dropdown._options.animated ? 'animated' : 'no-animation');
            this.$el.addClass((this.options && this.options.theme) ? this.options.theme : Dropdown._options.theme);
            
            return this;
        },
        chooseItem: function(e) {
            var value = $(e.currentTarget).data('value'),
                label = $(e.currentTarget).data('label');
            
            this.$('ul').removeClass('active');
            
            $('body').off('click', this.close);
                        
            this.collection.select({value: value, label: label});
        },
        openList: function(e) {
            var _this = this;
            e.stopPropagation();
            
            $('body').on('click', this.close);
            
            this.$('ul').toggleClass('active');
        },
        close: function() {
            this.$('ul').removeClass('active');
        },
        value: function(val) {
            if(val) {
                return this.set(val);
            }
                
            var selected = this.collection.findWhere({isSelected: true});
            return selected ? selected.get('value') : '';
        },
        set: function(val) {
            this.collection.select({value: val});
        }
    });

    return View;
}());

Dropdown._options = {};

Dropdown.configure = function(options) {
    _.extend(Dropdown._options, options);
}