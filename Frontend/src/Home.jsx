import React from 'react'
import Footer from './Components/Footer/Footer'
import Nav from './Components/Nav'
import { assets } from './assets/assets'

function Home() {
  return (
    <div>
    <Nav/>

       <div className='mt-10 py-24'>

       </div>
    
        <div className="bg-gray-100 text-center py-12 mt-10">
        <h2 className="text-3xl font-semibold" style={{ color: '#5E4033' }}>
        Best Sellers
        </h2>
        </div>
       
        <div className="bg-gray-100 text-center py-12 mt-10">
        <h2 className="text-3xl font-semibold" style={{ color: '#5E4033' }}>
         Who We Are
        </h2>
       <p className="text-lg mt-4 px-8" style={{ color: '#5E4033' }}>
    At Cake Vista, we believe every celebration deserves a touch of sweetness...<br/>
    Our cakes are crafted with love, premium ingredients, and a passion for creativity.<br/>
    Whether it's a birthday, wedding, or a simple treat-yourself moment, we bring joy to every bite!
       </p>
</div>

        <Footer/>
    </div>
  )
}

export default Home

