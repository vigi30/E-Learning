//Budget controller
var budgetController =(function(){

var Expenses = function(id,description,value){
    this.id=id,
    this.description= description,
    this.value=value,
    this.percentage = -1
};

Expenses.prototype.calcPercentage = function(totalIncome){
    
    if(totalIncome > 0){
        this.percentage = Math.round((this.value/totalIncome) *100);
    }else{
        this.percentage =-1;
    }

};

Expenses.prototype.getPercentage  = function(){
    return this.percentage;
};
var Income = function(id,description,value){
    this.id=id,
    this.description= description,
    this.value=value
};


var data ={
    allitems: {
        exp:[],
        inc:[]
    },
    total:{
        exp: 0,
        inc : 0,
        budget: 0,
        percentage:-1
    }
};


var calculateTotal =function(type){
    var sum=0;
    data.allitems[type].forEach(function(cur){
                sum+=cur.value;

        });
     data.total[type]=sum;   
};

return {
    
    addItem : function(type, des, val){
        //console.log("additem  function "+type + des + val);
        if(data.allitems[type].length > 0){
            ID= data.allitems[type][data.allitems[type].length -1].id + 1;
        }
        else{
            ID =0;
        }
        
        if(type === 'inc'){
            newItem = new Income(ID,des,val)
        }
        else if(type==='exp'){
            newItem= new Expenses(ID,des,val)
        
        }
        data.allitems[type].push(newItem);
        return newItem;
    },


    calculateBudget: function(){
        //calculate total income and expenses.
        calculateTotal('exp');
        calculateTotal('inc');
        //calculate the budget -- income -expenses.
        data.total.budget= data.total.inc - data.total.exp;
        if(data.total.inc > 0){
        //calculate the percentage of income that we spent. 
        data.total.percentage = Math.round((data.total.exp/data.total.inc )* 100);
        }
        else{
            data.total.percentage = -1;
        }
    },
    
    getBudget : function(){
        return{
            budget : data.total.budget,
            totaIncome : data.total.inc,
            totalExpense : data.total.exp,
            percentage: data.total.percentage
        };
    },
    deleteItem: function(type,id){
        var ids;
        ids=data.allitems[type].map(function(cur){
        return cur.id;

        });
        index = ids.indexOf(id);
        
        data.allitems[type].splice(index,1);
       // console.log(data);
    },

    calculatePercentage: function(){
        data.allitems.exp.forEach(function(cur){
            
            cur.calcPercentage(data.total.inc);
        });
    },

    getPercentages: function(){
        var allPercentage=data.allitems.exp.map(function(cur){
            return cur.percentage;
        });
        return allPercentage;
    },
    testing: function(){
        console.log(data);
    }
}

})();
//UI controller
var UIController =(function(){
    
    var domItem = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue :'.add__value',
        inputButton : '.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetValue : '.budget__value',
        totalIncome: '.budget__income--value',
        totalExpense: '.budget__expenses--value',
        expensepercentage : '.budget__expenses--percentage',
        month : '.budget__title--month',
        parentContainer: '.container ',
        subExpPercentage: '.item__percentage'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    
    return {
        getDOMItem : function(){
            return domItem;
        },
       
        getDomValue : function(){
            return{
                type: document.querySelector(domItem.inputType).value,
                description : document.querySelector(domItem.inputDescription).value,
                value :  parseFloat(document.querySelector(domItem.inputValue).value)

            }
        },
         
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(domItem.month).textContent = months[month] + ' ' + year;
        },
        
        addItemList : function(obj,type){
            var html,newHtml,element;
            // 1.get the income or expense html code
            if(type==='inc'){
                element=domItem.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            else if(type==='exp'){
                element=domItem.expenseContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //2. replace the values with place holder value
            newHtml= html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            //3. add it to UI
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
   
        },
        clearItemList: function(){
            fields= document.querySelectorAll(domItem.inputDescription+ ','+domItem.inputValue);
            filedsArr = Array.prototype.slice.call(fields);// to convert a list into an array use call and prototype method
            //console.log(filedsArr);
            filedsArr.forEach(function(current,index,array){
               // console.log(current);
                current.value = "";
                                            });
            filedsArr[0].focus();

        },
        displayBudget : function(obj) {
            var type;
            obj.budget>0 ? type='exp' : type='inc';
            document.querySelector(domItem.budgetValue).textContent = formatNumber(obj.budget,type);
            document.querySelector(domItem.totalIncome).textContent = formatNumber(obj.totaIncome,'inc');
            document.querySelector(domItem.totalExpense).textContent = formatNumber(obj.totalExpense,'exp');
            if(obj.percentage > 0){
            document.querySelector(domItem.expensepercentage).textContent = obj.percentage +'%';
            }
            else{
                document.querySelector(domItem.expensepercentage).textContent = '---';
            }
            // document.querySelector(domItem.month).textContent = Date​.get​UTCMonth()
            
        },
        deleteItem : function(itemId){
            //console.log("UI item  : "+itemId);
            el=  document.getElementById(itemId);
            //console.log(el);
            el.parentNode.removeChild(el);

        },

        displayExpPercentage : function(percentages){

           var lists=  document.querySelectorAll(domItem.subExpPercentage)
            console.log(lists[0]);
           nodeListForEach(lists,function(current,index){ 
            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }
           })
            

          
        },
        changeType : function(){
            
            var changeValue= document.querySelectorAll(domItem.inputType+','+domItem.inputDescription+ ','+domItem.inputValue)
            nodeListForEach(changeValue,function(cur){
                document.querySelector(domItem.inputType).classList.toggle('red-focus');
                document.querySelector(domItem.inputDescription).classList.toggle('red-focus');
                document.querySelector(domItem.inputValue).classList.toggle('red-focus');
            })

            document.querySelector(domItem.inputButton).classList.toggle('red');
        }
       
        
};
})();


//controller Event
var controller = (function(budgetCtrl,UIctrl){

    var setupEventListeners =function(){
        var DOM =UIctrl.getDOMItem();
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
        document.querySelector(DOM.parentContainer).addEventListener('click',ctrlDelItem);
        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changeType);
        
        document.addEventListener('keypress',function(event) {
            if(event.keyCode ===13 || event.which ===13){
                    ctrlAddItem();
            }
        });

          
    }; 
    var updatePercentages = function(){
        //1. calculate percentage  ---> expense / (total income * 100)
        budgetCtrl.calculatePercentage();

        //2. read percentage from the budget controller
        var percentages= budgetCtrl.getPercentages();
        

        //3. update the UI with new percentage.
        UIctrl.displayExpPercentage(percentages);
    }
    var ctrlDelItem = function(event){
        // Get the ID of an element
        var itemId,type,id;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
       console.log("itemid"+itemId);
        if(itemId){
        splitId=itemId.split('-');
        type =splitId[0];
        id=parseInt(splitId[1]);
        //console.log(splitId[0] + splitId[1]);


        }
        // delete from the data structure
        budgetCtrl.deleteItem(type,id);
        // delete from the UI
        UIctrl.deleteItem(itemId);
        // update the budget in the UI
        updateBudget();

        updatePercentages();
    }
    
    var updateBudget=function(){
        //4. calculate the budget
        budgetCtrl.calculateBudget();

        // 5.return the budget
        var getBudget = budgetCtrl.getBudget();

        //6.. display the budget on the UI
        UIctrl.displayBudget(getBudget);
    }

    var ctrlAddItem = function(){
        var newItem,input;
        //1. Getting input item
        input=UIctrl.getDomValue();
        if(input.description!=="" && input.value > 0 && !isNaN(input.value) ){
            
            //2. add new item to budget
            newItem= budgetCtrl.addItem(input.type,input.description,input.value);
            //console.log(newItem.id);
            //3. Add the item to the UI
            UIctrl.addItemList(newItem,input.type);
            //4.clearing the fields
    
            UIctrl.clearItemList();

            updateBudget();

            updatePercentages();
        }
        
  
      
    };
    

    return {
        init : function(){
        UIctrl.displayMonth();
        setupEventListeners();

        UIctrl.displayBudget({
            
                budget : 0,
                totaIncome : 0,
                totalExpense : 0,
                percentage:0
            
        });
        console.log("application has been started..");
        }
    };
})(budgetController,UIController);

controller.init();
