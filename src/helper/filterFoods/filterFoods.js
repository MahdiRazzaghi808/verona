function sortProductsByCategory(products) {
    const categoriesOrder = ['hamburger', 'pizza', 'friesSides', 'beverages'];

    const sortedProducts = [];

    categoriesOrder.forEach(category => {
        const categoryProducts = products.filter(product => product.category.en === category);
        sortedProducts.push(...categoryProducts);
    });

    return sortedProducts;
}


export { sortProductsByCategory }