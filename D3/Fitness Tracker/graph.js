// creating dimensions

const margin = {top :40, right : 20,bottom: 50 ,left : 100};
const graphWidth = 560 - margin.left -margin.right;
const graphHeight = 400 - margin.top -margin.bottom;


const svg = d3.select('.canvas')
.append('svg')
.attr('width',graphWidth +margin.left +margin.right)
.attr('height',graphHeight+margin.top+margin.bottom)

const graph = svg.append('g')
.attr('width',graphWidth)
.attr('height',graphHeight)
.attr('transform',`translate(${margin.left},${margin.top})`);

// creating scale
const x = d3.scaleTime()
.range([0,graphWidth])

const y =d3.scaleLinear()
.range([graphHeight,0])

// create acis group
const xAxisGroup =graph.append('g')
.attr('class','x-axis')
.attr('transform',`translate(0,${graphHeight})`);

const yAxisGroup = graph.append('g')
.attr('class','y-axis'); 

//Line path generator

const line = d3.line()
.x(data =>{
    new Date(data.date)
})
.y(data =>{
    data.distance
});

// Line path element
const path = graph.append('path');


// create dotted line group and append to graph
const dotLines = graph.append('g')
.attr('class','lines')
.style('opacity',0);
// create x dotted line and append to dotted line group
const dotX= dotLines.append('line')
.attr('stroke','#aaa')
.attr('stroke-width', 1)
.attr('stroke-dasharray',4);

// create y dotted line and append to dotted line group
const dotY = dotLines.append('line')
.attr('stroke','#aaa')
.attr('stroke-width', 1)
.attr('stroke-dasharray',4);

// update function

const update = (data)=>{
   
    data = data.filter(item => item.activity === activity)
    data.sort((a,b) => new Date(a.date) - new Date(b.date))



    // set scale domain

   x.domain(d3.extent(data,data => new Date(data.date)));
   y.domain([0,d3.max(data,data=>data.distance)]);


/*    // update path data
   path.data([data])
   .attr('fill','none')
   .attr('stroke','#00bfa5')
   .attr('stroke-width',2)
   .attr('d',line);
 */


   //create axes

   const xAxis = d3.axisBottom(x)
   .ticks(4)
   .tickFormat(d3.timeFormat('%b %d '))

   const yAxis =d3.axisLeft(y)
   .ticks(4)
   .tickFormat(data=> `${data}m`);
   
   // place this axis into axes group
   xAxisGroup.call(xAxis);
   yAxisGroup.call(yAxis);

    //rotate axis text
    xAxisGroup.selectAll('text')
    .attr('transform',`rotate(-40)`)
    .attr('text-anchor','end');

    //join the data to svg group.
    const circles = graph.selectAll('circle')
                    .data(data);
    
    //update the current element in the dom
    circles.attr('cx',data => x(new Date(data.date)))
    .attr('cy',data => y(data.distance))
    


    //enter selection
    circles.enter()
    .append('circle')
    .attr('cx',data => x(new Date(data.date)))
    .attr('cy',data => y(data.distance))
    .attr('r',4)
    .attr('fill','grey');

    //exit 
    circles.exit().remove();


    graph.selectAll('circle')
    .on('mouseover', (data,index,array)=>{

        console.log(`data: ${data}     array : ${array}  $`);
        d3.select(array[index])
        .transition().duration(100)
        .attr('r',10)
        .attr('fill','#fff');

        dotX.attr('x1',x(new Date(data.date)))
        .attr('y1', graphHeight)
        .attr('x2', x(new Date(data.date)))
        .attr('y2', y(data.distance))
        .attr('stroke','white')
        .attr('stroke-width',3)

        dotY.attr('x1',0)
        .attr('y1', y(data.distance))
        .attr('x2', x(new Date(data.date)))
        .attr('y2', y(data.distance))
        .attr('stroke','white')
        .attr('stroke-width',3)
        
        // set x dotted line coors(x1,x2,y1,y2)
        dotLines.style('opacity',1);
        // set x dotted line coors(x1,x2,y1,y2)
        // show the dotted line group
    })
    .on('mouseleave',(data,index,array)=>{
        d3.select(array[index])
        .transition().duration(100)
        .attr('r',5)
        .attr('fill','grey')

        dotLines.style('opacity',0);
    })
}

// data and firestore

var data = [];
    db.collection('activity').onSnapshot(res =>{
        res.docChanges().forEach(change =>{
           const doc ={...change.doc.data(), id: change.doc.id}
          
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
