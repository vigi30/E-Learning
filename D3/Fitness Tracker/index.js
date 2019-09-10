const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

var activity ='cycling'
console.log(btns);
var buttons=Array.from(btns);
buttons.forEach(btn =>{
    btn.addEventListener('click',e=>{
        //get activity
        activity =e.target.dataset.activity;

        // remove and add active class
        buttons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        // set id of input field
        input.setAttribute('id',activity)

        //set text of form span
        formAct.textContent =activity

        update(data);
    })
});

form.addEventListener('submit',(e)=>{

    e.preventDefault();
    const distance =parseInt(input.value)
    if(distance){
        db.collection('activity').add({
            distance,
            activity,
            date: new Date().toString()
        }).then(res => {
            error.textContent=""
            input.value ="";
            
    })

}
else{
    error.textContent ="Please enter the value";
}
});
