form = document.querySelector('form');
itemName = document.querySelector('#name')
itemCost = document.querySelector('#cost')
error = document.querySelector('#error')

form.addEventListener('submit',(e)=>{

    e.preventDefault();
    if(itemName.value && itemCost.value){
    const item = {
            name : itemName.value,
            cost : parseInt(itemCost.value)
        };
        db.collection('expenses').add(item).then(res => {

            itemName.value = "";
            itemCost.value = "";
            error.textContent = "";
        
        });
        
    
    }
    else{
        error.textContent = "Please enter the values"
    }

});

