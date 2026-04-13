require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const app = express()
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.render('index.ejs')
})

app.post('/checkout', async (req, res)=>{
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'scripts'
                    },
                    unit_amount:5.99 * 100
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        shipping_address_collection:{
            allowed_countries: ['US', 'BR']
        },
        success_url: `${process.env.BASE_URL}/complete`,
        cancel_url: `${process.env.BASE_URL}/cancel`
    })
    res.redirect(session.url)
})

app.get('/complete', (req,res)=>{
    res.render('scripts')
})

app.get('/cancel', (req,res)=>{
    res.redirect('index')
})

app.listen(3000, ()=> console.log('server started on port 3000'))
