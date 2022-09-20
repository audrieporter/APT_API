const PORT = 8675
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sources = [
    {
        name: 'infosecurity',
        address: 'https://www.infosecurity-magazine.com/advanced-persistent-threats',
    },
    {
        name: 'hackernews',
        address: 'https://www.thehackernews.com/search/label/Advanced%20Persistent%20Threat',
    },
]
const articles = []

sources.forEach(source => {
    axios.get(source.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Iranian", "Iran")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    sourcename: source.name
                })
            })
            $('a:contains("North Korean")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    sourcename: source.name
                })
            })
            $('a:contains("Chinese")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    sourcename: source.name
                })
            })
            $('a:contains("Russian")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    sourcename: source.name
                })
            })
            $('a:contains("APT")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    sourcename: source.name
                })
            })
        })

})        
    

app.get('/', (req,res) => {
    res.json('Welcome to my APT API.')
})

app.get('/news', (req,res) => {
    res.json(articles)
    .catch((err) => console.log(err))
})
         
        

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
