import React from 'react'
// components
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import Products from '../../components/products/Products'


function Menus() {
    return (
        <>
            <Navbar />
            <div className='container' style={{ marginTop: "2rem", marginBottom: '2rem' }}>
                <Products />
            </div>
            <Footer />
        </>

    )
}

export default Menus