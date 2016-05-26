/**
 * Created by xiaos on 16/5/25.
 */
var todoList = (function () {
    var defaults = {
        todoTask:"todoTask",
        taskHeader:"taskHeader",
        taskDate:"taskDate",
        taskContent:"taskContent"
    },
        types ={
            1:"#pending",
            2:"#inProgress",
            3:"#complete"
        },
        data = {};

    var MyTodoList = function () {
        var _this = this;

        $('#todoDate').datepicker();

        //从本地数据库恢复数据
        data = JSON.parse(localStorage.getItem('xiaos')) || {};
        for (var prop in data){
            if (data.hasOwnProperty(prop)){
                var localData = data[prop];
                _this.CreateTask({
                    id:prop,
                    types:localData.types,
                    title:localData.title,
                    date:localData.date,
                    content:localData.content
                })
            }
        }

        //点击添加按钮
        $('#addButton').click(function () {
            var now=new Date(),
                id = ''+now.getYear()+now.getMonth()+now.getDay()+now.getHours()+now.getMinutes()+now.getSeconds(),
                title = $('#todoTitle'),
                content = $('#todoContent'),
                date = $('#todoDate');

            //创建任务
            _this.CreateTask({
                id:id,
                types:1,
                title:title.val(),
                date:date.val(),
                content:content.val()
            });

            data[id]= {
                types:1,
                title:title.val(),
                date:date.val(),
                content:content.val()
            };

            _this.saveData();

            title.val("");
            content.val("");
            date.val("");

        });


        //拖拽
        $.each(types,function (index,value) {
            $(value).droppable({
                drop: function(event, ui) {
                    var element = ui.helper,
                        id = element.attr('id'),
                        item = data[id];

                    item.types = index;

                    _this.removeTask({
                        id:id
                    });

                    _this.CreateTask({
                        id: id,
                        types: item.types,
                        title: item.title,
                        date: item.date,
                        content: item.content
                    });

                    _this.saveData();
                }
            });
        });


        $('#delete-div').droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    id = element.attr('id');
                _this.removeTask({
                    id: id
                });
                delete data[id];
                _this.saveData();
            }
        });


    };

    MyTodoList.prototype.CreateTask = function (params) {
        var parent = $(types[params.types]),
            wapper;

        if (!parent)return;

        wapper = $("<div />",{
            class:defaults.todoTask,
            id:params.id
        });

        $("<h4 />",{
            text:params.title
        }).appendTo(wapper);

        $("<div />",{
            class:defaults.taskContent,
            text:params.content
        }).appendTo(wapper);

        $("<div />",{
            class:defaults.taskDate,
            text:params.date
        }).appendTo(wapper);

        wapper.appendTo(parent);
        wapper.draggable();
    };

    MyTodoList.prototype.saveData = function () {
        localStorage.setItem('xiaos',JSON.stringify(data));
    };

    MyTodoList.prototype.removeTask = function (params) {
        var idStr = '#'+params.id;
        console.log('str:'+idStr+' 长度:'+idStr.length);
        $(idStr).remove();
    };

    return MyTodoList;
})();