

const fs = require ('fs')
const http = require ('http')
const url = require("url")

const port = 3000;

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%VITAMIN%}/g, product.nutrients)
    output = output.replace(/{%CUANTITY%}/g, product.quantity)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
    const DataObj = JSON.parse(data)

const server = http.createServer ((req, res) => {
    
    const {query,pathname} = url.parse(req.url, true)

    //main page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type' : 'text/html'})

        const Html = DataObj.map(el => replaceTemplate(tempCard,el))
        const output = tempOverview.replace('{%PRODUCT_CARD%}', Html)

        res.end (output);
    //product page
    } else if (pathname === '/product'){

        const product = DataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        res.end(output)
    //api
    } else if(pathname === '/api') {
            res.writeHead(200, {'Content-type' : 'application/json'})
            res.end(data)
        } else {
        res.end('Page not FOUND')
    }
})

server.listen(port, '127.0.0.1', () => {
    console.log (`Server started http://localhost:%s`,port)
})

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

// console.log (textIn)

// const textOut = `Что вы знаете об авакадо: ${textIn}`

// fs.writeFileSync('./txt/output.txt', textOut)

//асинхронно

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=> {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) =>{
//         console.log(data2)
//             fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) =>{
//                 console.log (data3)
//                     fs.writeFile ('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                         console.log ('Файл перезаписан!')
//                     }
//                     )
//             })
//     })
// })

// console.log ('Теперь готово для чтения')