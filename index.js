const fs=require('fs');
const http=require('http');
const url=require('url');
const replaceTemplate =require('./modules/replaceTemplate')

//////////////
//files

//blocking , synchrounous way
// const reading=fs.readFileSync('./txt/input.txt','utf-8')
// console.log(reading)

// fs.writeFileSync("./txt/output.txt","example writing of the file and this is the just sample of the fime")


//non-blocking , asynchronous way
// fs.readFile('./txt/start.txt',"utf-8",(err,data1)=>{
//     console.log(data1)
//     fs.readFile(`./txt/${data1}.txt`,"utf-8",(err,data2)=>{
//         console.log(`bsdk ${data2}`)

     
//     })
    
// })
//////server


const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');



const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const server= http.createServer((req,res)=>{

    const{query,pathname}=url.parse(req.url,true);

    //overview page
    if(pathname==='/' || pathname==="/overview"){
        res.writeHead(200,{'Content-type':'text/html'})

        const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('') ;
        const output=tempOverview.replace('{%PRODUCT_CARD%}',cardsHtml)
        res.end(output)

    //product page
    }else if(pathname==="/product"){
        res.writeHead(200,{'Content-type':'text/html'})
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product)
        res.end(output)

    //api
    }else if(pathname==="/api"){
            res.writeHead(200,{'Content-type':'application/json'})
            res.end(data)
    }
    //not fount
    else{
        res.writeHead(404,{'Content-type':'text/html','my-own-header':'hellow-world'})
        res.end("<h1>page not found<h1>")
    }
 
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("Listiningi to port 8000")
})