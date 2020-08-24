/*global  Router */
// jQuery(function ($) {
	'use strict';

	// Handlebars.registerHelper('eq', function (a, b, options) {
	// 	return a === b ? options.fn(this) : options.inverse(this);
	// });

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	
  function uuid() {
    /*jshint bitwise:false */
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  }

  function pluralize(count, word) {
    return count === 1 ? word : word + 's';
  }

  function store(namespace, data) {
    if (arguments.length > 1) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      var store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    }
  }

  function bindEvents() {
    
    // $('#new-todo').on('keyup', create.bind(App));
    document.getElementById('new-todo').addEventListener('keyup', create.bind(App));
    // $('#toggle-all').on('change', toggleAll.bind(App));
    document.getElementById('toggle-all').addEventListener('change', toggleAll.bind(App));
    // $('#footer').on('click', '#clear-completed', destroyCompleted.bind(App));
    document.getElementById('footer').addEventListener('click', function(e) {
      var clearCompletedButton = document.getElementById('clear-completed');
        if (e.target === clearCompletedButton){
          destroyCompleted();
        }
    });
    
    // the id for the ul in index/html is todo-list
    var todolist = document.getElementById('todo-list');
    
    // toggle
    todolist.addEventListener('change', function(e) {
      if(e.target.className === 'toggle') {
        toggle(e);
      }
    });
    
    
    // edit
    todolist.addEventListener( 'dblclick', function(e) {
     console.log(e.target.nodeName);
      if(e.target.nodeName === 'LABEL') {
        edit(e);
      }
    });
    
    //editKeyup
    todolist.addEventListener('keyup', function(e){
      if(e.target.className === 'edit'){
        editKeyup(e);
      }
    });
    
    //update
    todolist.addEventListener('focusout', function(e){
      if(e.target.className === 'edit'){
        update(e);
      }
    });
    
    //destroy
    todolist.addEventListener('click', function(e){
      if(e.target.className === 'destroy'){
        destroy(e);
      }
    });
    
    
//     $('#todo-list')
//       .on('change', '.toggle', toggle.bind(App))
//       .on('dblclick', 'label', edit.bind(App))
//       .on('keyup', '.edit', editKeyup.bind(App))
//       .on('focusout', '.edit', update.bind(App))
//       .on('click', '.destroy', destroy.bind(App));
  } // end of bindEvents function
  
  function create(e) {
    // var $input = $(e.target);
    // var val = $input.val().trim();
    var input = e.target;
    var val = input.value.trim();

    if (e.which !== ENTER_KEY || !val) {
      return;
    }

    App.todos.push({
      id: uuid(),
      title: val,
      completed: false
    });

    input.value = '';

    render();
  }
  
  function destroy(e) {
    App.todos.splice(indexFromEl(e.target), 1);
    render();
	} 
  
  function destroyCompleted() {
			App.todos = getActiveTodos();
			App.filter = 'all';
			render();
	}
  
  function edit(e) {
		// var $input = $(e.target).closest('li').addClass('editing').find('.edit');
		// $input.val($input.val()).focus();
    
    // assign target and closest to myLi variable
    var myLi = e.target.closest('li');
    //add className
    myLi.classList.add('editing');
    // // Without jQuery
    // // Select the first instance of .edit within myLi ===> label we wanna edit
    // var myLi = e.target.closest('li');
    // // next... myLi.querySelector(''.edit');
    // example use queryselector all then use queryselector 

    //
    var myInput = myLi.querySelector('.edit');
    console.log('myInput:', myInput);
   
    myInput.focus();
    
	}
  
  function editKeyup(e) {
    if (e.which === ENTER_KEY) {
      e.target.blur();
    }

    if (e.which === ESCAPE_KEY) {
      // console.log(todoLi);
      // $(e.target).data('abort', true).blur();
      // .data Description: Store arbitrary data associated with the matched elements.
      //.data( key, value )
      // solution could be Element.setAttribute(name, value); it is not
      // soultion could set attribute using dataset
      // from mdn article.dataset.columns = 5 would change that attribute to "5".
      // create a var for element.target
      var todoLi = e.target;
      // console.log(todoLi); 
      // <--- prove that when you hit escape e.target is 

      todoLi.dataset.abort = true;
      todoLi.blur();
    }
  }  
  
  function getActiveTodos() {
    return App.todos.filter(function (todo) {
      return !todo.completed;
    });
	}
  
  function getCompletedTodos() {
    return App.todos.filter(function (todo) {
      return todo.completed;
    });
	}
  
  function getFilteredTodos() {
    if (App.filter === 'active') {
      return getActiveTodos();
    }

    if (App.filter === 'completed') {
      return getCompletedTodos();
    }

    return App.todos;
  }
  
  function indexFromEl(el) {
    
    	// var id = $(el).closest('li').data('id'); original code
    
    // find the closest li on el
    // find the closest li, var id = el.closest('li')
    // then find its data set .. .dataset.id;
    
      var id = el.closest('li').dataset.id;
			var todos = App.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
	}
  
  function init() {
			App.todos = store('todos-jquery');
      // need to assign a variable for the todo-template
      // need to assign a variable for the footer-template
      // var todoTemplateElement = document.getElementById('todo-template');
      // var footerTemplateElement = document.getElementById('footer-template');
			// App.todoTemplate = Handlebars.compile($('#todo-template').html());
			// App.footerTemplate = Handlebars.compile($('#footer-template').html());    
			// App.todoTemplate = Handlebars.compile(todoTemplateElement.innerHTML);
			// App.footerTemplate = Handlebars.compile(footerTemplateElement.innerHTML);
			bindEvents();

      new Router({
				'/:filter': function (filter) {
					App.filter = filter;
					render();
				}.bind(App)
			}).init('/all');      
	}
   // $('#todo-list').html(App.todoTemplate(todos)); off
    // $('#main').toggle(todos.length > 0);  off
    // $('#toggle-all').prop('checked', getActiveTodos().length === 0); off
    // renderFooter(); off
    
    
    
    // my version 
    // var id = App.todos[i].id;
    // var title = App.todos[i].title.value;
    // App.todos.forEach() {};
    // var id = App.todos[i].id;

  function render() {
    var todos = getFilteredTodos();
    var todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach( function (todo, position) {
        var todoLi  = document.createElement('li');
        todoLi.dataset.id = todos[position].id;
        var title = todos[position].title;
      
        if (todos[position].completed) {
          todoLi.classList.add('completed');
        }
        var divWithClassOfView = document.createElement('div');
        divWithClassOfView.classList.add('view');
        // todoLi.appendChild(divWithClassOfView);
      
        var checkboxInput = document.createElement('input');
        checkboxInput.type ='checkbox';
        checkboxInput.classList.add('toggle');
        if(todo.completed){
          checkboxInput.setAttribute('checked', true);
        }
      
        var label = document.createElement('label');
        label.innerText = title;
      
        var destroyButton = document.createElement('button');
        destroyButton.classList.add('destroy');
      
        var editInput = document.createElement('input');
        editInput.type ='text';
        editInput.value = title;
        // editInput.classList.add('edit');
        editInput.classList.add('edit');
      
      // insert checkboxInout, label, and destroy button into the divWithClassOfView
        divWithClassOfView.appendChild(checkboxInput);
        divWithClassOfView.appendChild(label);
        divWithClassOfView.appendChild(destroyButton);
      
      // insert the divWithClassOfView into the li 
        todoLi.appendChild(divWithClassOfView);
      
      // dont forget to append the edit input
        todoLi.appendChild(editInput);
      // insert the li into the UL/todoList
        todoList.appendChild(todoLi);
      
        
        
        
      // create input <input class="toggle" type="checkbox">         done
      // create label <label>123</label>                             done
      // create a button <button class="destroy"></button>           done
      // create another input <input class="edit" value="123">       done
      // append the div to the Li                                    done
      // append the editInput to the li as well                      done
      // append the li to the Ul                                     done
        // console.log(todoLi.id);
        // console.log(title);
        // console.log(todos[position].completed);
        // console.log('divWithClassOfView:',divWithClassOfView);
      
    }, App);
    
    
    
    
    
    // var todoList = document.getElementById('todo-list');
    // todoList.innerHTML = App.todoTemplate(todos);
     var mainElement = document.getElementById('main');
    if ( todos.length > 0) {
      mainElement.style.display = 'block';
    } else {
      mainElement.style.display = 'none';
    }
    var toggleAllElement = document.getElementById('toggle-all');
    if (toggleAllElement.checked) {
      getActiveTodos().length === 0;
    }
    // $('#toggle-all').prop('checked', getActiveTodos().length === 0);
    renderFooter();
    document.getElementById('new-todo').focus();
    store('todos-jquery', App.todos);
    // $('#new-todo').focus();
    // store('todos-jquery', App.todos);
	}
  
  function renderFooter() {
    // inject mini templates into individual elements using .innerHTML
    //
    // before removing the handlebar footer template
    // recreate the footer template in index.html by adding 
    // the  <span>  <ul> <li> <button> code with same id's within the footer tag in the #todoapp <section>
    //
    // create a template for each element in footer ^^^
    // then inject data into each element by assingin the value using .innerHTML =
    
    var footer = document.getElementById('footer');
    var todoCount = App.todos.length;
    var activeTodoCount = getActiveTodos().length;
    var template;
    var activeTodoCount = activeTodoCount;
    var activeTodoWord = pluralize(activeTodoCount, 'item');
    var completedTodos= todoCount - activeTodoCount;
    var filter= App.filter;
    
    
    // grab span element, create a spanTemplate, assign spanelement.innerHTML to spanTemplate
    // inject template into html element 
    
    var spanTemplate = `<strong>${activeTodoCount}</strong> ${activeTodoWord} left`;
    var theSpan = document.getElementById("todo-count");
    theSpan.innerHTML = spanTemplate;
    
    // find the 'all' filter element by using querySector 
    // mdn use a DOMString containing one or more selectors to match. 
    // we watch to search for "a[href='#/all']"
          //  example code   
          //    Add a red border to the first <a> element
          //    that has a target attribute inside a <div> element:
          //         var x = document.getElementById("myDIV");
          //         x.querySelector("a[target]").style.border = "10px solid red";
    
    var allFilter = document.querySelector("a[href='#/all']");
    console.log(allFilter);
    if ( App.filter === 'all'){
      allFilter.className = "selected";
    } else {
      allFilter.className = "not-selected";
    }
    
    var activeFilter = document.querySelector("a[href='#/active']");
    console.log(activeFilter);
    if ( App.filter === 'active'){
      activeFilter.className = "selected";
    } else {
      activeFilter.className = "not-selected";
    }
    
    // w3 school example for adding classes
    //     Add the "mystyle" class to a <div> element:
    // document.getElementById("myDIV").classList.add("mystyle");
    // different way to add classes compared to all and active, 
    // this way allows me to remove a class as well 
    
    var completedFilter = document.querySelector("a[href='#/completed']");
    console.log(completedFilter);
    if ( App.filter === 'completed'){
      completedFilter.classList.add("selected");
    } else {
      completedFilter.classList.remove("selected");
    }
    
    //show or hide button depending on # of completed todos
    // find the clearCompleted element on the footer using querySelector
    var clearCompletedButton = document.querySelector("[id='clear-completed']");
    console.log(clearCompletedButton);
    if ( completedTodos > 0){
      clearCompletedButton.style.display = 'block';
    } else {
      clearCompletedButton.style.display = 'none';
    }
    
    if (todoCount > 0) {
      footer.style.display = 'block';
    } else {
      footer.style.display = 'none';
    }
    
  
    // $('#footer').toggle(todoCount > 0).html(template);
  }
  
  function toggle(e) {
    var i = indexFromEl(e.target);
    App.todos[i].completed = !App.todos[i].completed;
    render();
	}
  
  function toggleAll(e) {
    // var isChecked = $(e.target).prop('checked');
    var isChecked = e.target.checked;

    App.todos.forEach(function (todo) {
      todo.completed = isChecked;
    });

    render();
	}
//   function update(e) {
// 			var el = e.target;
// 			var $el = $(el);
// 			var val = $el.val().trim();

// 			if (!val) {
// 				destroy(e);
// 				return;
// 			}

// 			if ($el.data('abort')) {
// 				$el.data('abort', false);
// 			} else {
// 				App.todos[indexFromEl(el)].title = val;
// 			}

// 			render();
// 	}
  function update(e) {
			var el = e.target;
			
			var val = el.value.trim();

			if (!val) {
				destroy(e);
				return;
			}

			if (el.dataset.abort) {
				el.dataset.abort = false;
			} else {
				App.todos[indexFromEl(el)].title = val;
			}

			render();
	}  
  
	var App = {};

	init();
  
// });