var HomeTemplate = [
  // Put in a div with class content.  Ratchet will style this appropriately.
  '<nav class="bar bar-standard">',
  '<header class="bar bar-nav">',
 
  '<button id="btnAddTask" class="btn pull-right">Add Task</button>',
  '<h1 class="title">ToDo List Junior App</h1>',
  '</header>',
  '</nav>',
 
  '<div class="bar bar-standard bar-header-secondary">',
  ' <ul id="lst" class="table-view">',
  ' </ul>',
  '</div>'
  // Join the array with a new-line for a quick and easy html template.
].join('\n');

var AddTaskTemplate = [
  
  '<nav class="bar bar-standard">',
  '<header class="bar bar-nav">',
 
  '<button id="btnBack" class="btn btn-link btn-nav pull-left">Back</button>',
  '<h1 class="title">Add Task</h1>',
  '</header>',
  '</nav>',
  
  '<div class="bar bar-standard bar-header-secondary">',
  '<form>',
  '<input id="txtName" type="text" placeholder="Full name">',
  '<input id="txtTitle" type="text" placeholder="Title">',
  '<textarea id="txtDesc" placeholder="Description" rows="3"></textarea>',
  '<button id="btnAdd" class="btn btn-positive btn-block">Save Task</button>',
  '</form>',
  '</div>'
 
].join('\n');


var TaskCollection = Backbone.Firebase.Collection.extend({
  url: "https://burning-fire-1723.firebaseio.com/ToDo"
});

var HomeView = Jr.View.extend({
 initialize: function() {
      this.listenTo(this.collection,'add',this.addOne);
    },
  addOne: function(todoList){
      console.log(todoList);
      var name = todoList.attributes.name;
      var title = todoList.attributes.title;
      var desc = todoList.attributes.description;
      $('#lst').append('<li class="table-view-cell">'+title+': '+desc+' by '+name+'</li>');
  },
  render: function(){
    this.$el.html(HomeTemplate);  
    return this;
  },
  events: {
    'click #btnAddTask': 'onClickAddTask'
  },
  onClickAddTask: function() {

    Jr.Navigator.navigate('addTask',{
      trigger: true,
      animation: {
        // This time slide to the right because we are going back
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.RIGHT
      }
    });
  }
});




var AddTaskView = Jr.View.extend({
 
  initialize: function() {
      this.listenTo(this.collection);
    },
  render: function(){
    this.$el.html(AddTaskTemplate);  
    return this;
  },
  events: {
    'click #btnBack': 'onClickBack',
    'click #btnAdd': 'onClickAdd'
  },
  onClickBack: function() {

    Jr.Navigator.navigate('home',{
      trigger: true,
      animation: {
        // This time slide to the right because we are going back
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.LEFT
      }
    });
  },
  onClickAdd: function() {
    
   var name = $('#txtName').val();
   var title = $('#txtTitle').val();
   var desc = $('#txtDesc').val();
   this.collection.create({name: name,title: title,description:desc});
   
   AppRouter.navigate("/home", true);
   return false;
  }
});


var AppRouter = Jr.Router.extend({
  routes: {
    'home': 'home',
    'addTask': 'addTask'
  },

  home: function(){
    var collection = new TaskCollection();
    var homeView = new HomeView({ collection: collection });
    this.renderView(homeView);
  },
  addTask: function(){
    var collection = new TaskCollection();
    var addTaskView = new AddTaskView({ collection: collection });
    this.renderView(addTaskView);
  }
  
});

var appRouter = new AppRouter();
Backbone.history.start();
Jr.Navigator.navigate('home',{
  trigger: true
});
