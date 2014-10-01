(function() {

    var viewSelector = new Backbone.ViewKit.ViewSelector();
    var headerViewStack = new Backbone.ViewKit.ViewStack({
        transitions: {
            push: new Backbone.ViewKit.Transitions.Fade(),
            pop: new Backbone.ViewKit.Transitions.Fade({ reverse: true })
        }
    });
    var contentViewStack = new Backbone.ViewKit.ViewStack({
        transitions: {
            push: new Backbone.ViewKit.Transitions.Slide(),
            pop: new Backbone.ViewKit.Transitions.Slide({ reverse: true })
        }
    });
    var TemplateView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            var template = _.template($(this.template).html());
            this.$el.html(template());
            return this;
        }
    });
	var ContainerView = TemplateView.extend({
		header: headerViewStack,
		content: contentViewStack,
        template: "#container-template",
		initialize: function() {
            this.initRender();
		},
		events: {
			'tap .push': 'push',
			'tap .pop': 'pop',
		},
		push: function() {
			this.header.getView().push();
			this.content.getView().push();
		},
		pop: function() {
			this.header.getView().pop();
			this.content.getView().pop();
		},
        initRender: function() {
            var template = _.template($(this.template).html());
            this.$el.html(template());
            return this;
        },
	});


    var TabsView = TemplateView.extend({
        template: '#tabs-template',
        events: {
            'tap [data-tab]': 'selectTab'
        },
        selectTab: function(e) {
            var index = parseInt($(e.target).data('tab'), 10);
            viewSelector.selectView(index);
        }
    });

    var FooHeaderView = TemplateView.extend({
        template: '#foo-header-template',
        className: 'header',
        push: function() {
            var barHeader = new BarHeaderView();
            headerViewStack.pushView(barHeader);
        }
    });
    var FooView = TemplateView.extend({
        template: '#foo-template',
        className: 'page',
        push: function() {
            var bar = new BarView();
            contentViewStack.pushView(bar);
        }
    });

    var BarHeaderView = TemplateView.extend({
        template: '#bar-header-template',
        className: 'header',
        push: function() {
            var bazHeader = new BazHeaderView();
            headerViewStack.pushView(bazHeader);
        },
        pop: function() {
            headerViewStack.popView();
        }
    });
    var BarView = TemplateView.extend({
        template: '#bar-template',
        className: 'page',
        push: function() {
            var baz = new BazView();
            contentViewStack.pushView(baz);
        },
        pop: function() {
            contentViewStack.popView();
        }
    });

    var BazHeaderView = TemplateView.extend({
        template: '#baz-header-template',
        className: 'header',
        pop: function() {
            headerViewStack.popView();
        }
    });
    var BazView = TemplateView.extend({
        template: '#baz-template',
        className: 'page',
        pop: function() {
            contentViewStack.popView();
        }
    });

    var QuxHeaderView = TemplateView.extend({
        template: '#qux-header-template'
    });
    var QuxView = TemplateView.extend({
        template: '#qux-template'
    });

    $(function() {
        var tabs = new TabsView();
        var fooHeader = new FooHeaderView();
        var bazHeader = new BazHeaderView();
        var quxHeader = new QuxHeaderView();
        var foo = new FooView();
        var baz = new BazView();
        var qux = new QuxView();

        headerViewStack.pushView(fooHeader);
        contentViewStack.pushView(foo);
		var container = new ContainerView();
        viewSelector.setViews([container, qux]);
        viewSelector.selectView(0);

        $('#tabs').html(tabs.el);
        $('#container').html(container.el);
        $('#header').html(container.header.el);
        $('#content').html(container.content.el);
    });

})();
