const dims = {width: 300,height : 300,radius:150};
const cent = {x: (dims.width/2+5), y : (dims.height/2+5)};

const svg = d3.select('.canvas')
        .append('svg')
        .attr('width',dims.width+150)
        .attr('height',dims.height+150);

const graph =svg.append('g')
    

const pie = d3.pie()
.sort(null)
.value(d=>d.cost);
// the value we are evaluating to create the pie angles


const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius/ 2);


//creating the scale range
const colours = d3.scaleOrdinal(d3['schemeSet3'])

//setting the time ticker value
const t = d3.transition().duration(800);


// creating legend group and setting legend properties
const legendGroup =svg.append('g')
.attr('transform',`translate(${dims.width +40},10)`)

const legend = d3.legendColor()
.shape('circle')
.scale(colours)
.shapePadding(10)

const tip = d3.tip()
.attr('class','tip card')
.html(d=>{
    
    let content = `<div class="name">${d.data.name}</div>`;
    content += `<div class="cost">${d.data.cost}</div>`
 content +=  `<div class="delete">Click Slice to delete</div>`
 return content;
});

graph.call(tip);

// update function

const update = (data) =>{
    
    //update the scale domain
    colours.domain(data.map(data => data.name))


    //update and call legend
    legendGroup.call(legend);
    legendGroup.selectAll('text').attr('fill','white');


    //join enhanced(pie) data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data));

    // handle the exit selection
    paths.exit()
    .transition(t)
    .attrTween('d',arcTweenExit)
    .remove();
 
    //handle the current DOM path updates
    paths.attr('d',arcPath)
    .transition(t)
    .attrTween('d',arcTweenUpdate)


    //append the enter selection to the DOM
    paths.enter()
        .append('path')
        .attr('class','arc')
        .attr('stroke','#fff')
        .attr('stroke-width',5)
        .attr('fill',data=>colours(data.data.name))
        .each(function(data){this._current=data})
       
        .transition(t)
        .attrTween('d',arcTweenEnter)

// add events
graph.selectAll('path')
.on('mouseover',(d,i,n)=>{
    tip.show(d,n[i]);
    handleMouseOver(d,i,n);
})
.on('mouseout',(d,i,n)=>{
    tip.hide();
    handleMouseOut(d,i,n);
})
.on('click',handleClick);

    };


// console.log(arcPath(angles[0]));

//Getting Data from Firestore databases

var data = [];
    db.collection('expenses').onSnapshot(res =>{
        res.docChanges().forEach(change =>{
           const doc ={...change.doc.data(), id: change.doc.id}
           console.log(doc);
           switch(change.type){
               case 'added':
                   data.push(doc);
                   break;
                case 'modified':
                    const index = data.findIndex(item => item.id === doc.id)
                    data[index] = doc;
                    break;
                case 'removed':
                    data = data.filter(item => item.id !== doc.id)
                            break;
                default:
                    break;
           }
        });
        
        update(data);
    });


    //Tweens

    const arcTweenEnter = data => {

        // define interpolation
        // d3.interpolate returns a function which we call i -- consist a value between starting and final value
        var i = d3.interpolate(data.endAngle,data.startAngle);
        
        // returns a function which takes in a time ticker t
        return function(t){
            // returns the value from passing the ticker into the interpolation
            data.startAngle = i(t);   
            return arcPath(data)
        }
    }  

    const arcTweenExit = data => {

        // define interpolation
        // d3.interpolate returns a function which we call i -- consist a value between starting and final value
        var i = d3.interpolate(data.startAngle,data.endAngle);
        
        // returns a function which takes in a time ticker t
        return function(t){
            // returns the value from passing the ticker into the interpolation
            data.startAngle = i(t);   
            return arcPath(data)
        }
    }  

    // use function keyword  to allow use of this
     function arcTweenUpdate(data){
        
     
        var i = d3.interpolate(this._current,data);
         this._current = i(1)
       
        // returns a function which takes in a time ticker t
        return function(t){
            // returns the value from passing the ticker into the interpolation
              return arcPath(i(t));
        }
    }



    //Event handlers
    const handleMouseOver = (data,index,element)=>{
        d3.select(element[index])
        .transition('changeSliceFill').duration(300) // name transitions doesnt interfere with other transition
        .attr('fill','#fff')
    }
    const handleMouseOut = (data,index,element)=>{
        d3.select(element[index])
        .transition('changeSliceFill').duration(300)
        .attr('fill',data=>colours(data.data.name))
    }
    const handleClick =(data)=>{
        const id = data.data.id;
        db.collection('expenses').doc(id).delete()
    }