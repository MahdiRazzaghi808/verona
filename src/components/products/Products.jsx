import React, { useState, useEffect } from 'react';
// spring
import { useTransition, animated } from 'react-spring';
import Food from './Food';
// router
import { Link, useLocation } from 'react-router-dom';
// axios
import { fetchFrom } from '../../services/axios';
// language
import { useTranslation } from 'react-i18next';

function Products() {
    const location = useLocation();
    const pathName = location.pathname;
    const parts = pathName.split('/');
    parts.shift();

    const { t } = useTranslation();


    const [products, setProducts] = useState({
        all: [],
        hamburger: [],
        pizza: [],
        friesSides: [],
        beverages: [],
    });


    const [activeMenu, setActiveMenu] = useState('all');
    const [isMoving, setIsMoving] = useState(false);
    const [indexShow, setIndexShow] = useState(12);

    useEffect(() => {
        getData();

    }, []);

    const getData = async () => {
        const fetchUrl = parts[0] ? '/foods?_sort=id&_order=desc' : '/foods?hot=true';
        const res = await fetchFrom({ method: 'get', url: fetchUrl });

        const filterData = res.data.filter(v => !v.archive);

        const categorizedProducts = filterData.reduce((prev, next) => {
            prev[next.category['en']].push(next);
            return prev;
        }, { hamburger: [], pizza: [], friesSides: [], beverages: [] });

        categorizedProducts.all = filterData;
        setProducts(categorizedProducts);
    };


    const moreHandler = () => {
        setIndexShow(prev => prev + 12)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [isChangingMenu, setIsChangingMenu] = useState(false);

    const handleMenuChange = (newMenu) => {
        setIsChangingMenu(true);
        setTimeout(() => {
            setActiveMenu(newMenu);
            setIsChangingMenu(false);
        }, 1);
    };

    const [movingItems, setMovingItems] = useState([]);

    const handleRemove = (foodId) => {
        setIsMoving(true);
        setMovingItems(prevMovingItems => [...prevMovingItems, foodId]);
        setProducts((prevProducts) => {
            const updatedProducts = prevProducts[activeMenu].slice(0, indexShow).map((food) => {
                if (food.id === foodId) {
                    return { ...food, deleted: true };
                }
                return food;
            });
            return { ...prevProducts, [activeMenu]: updatedProducts };
        });
    };

    const handleMove = () => {
        setIsMoving(false);
    };

    const filteredProducts = products[activeMenu].slice(0, indexShow).filter(food => !food.deleted);

    const transitions = useTransition(
        filteredProducts.slice(0, indexShow),
        {
            key: food => food.id,
            from: { opacity: 0, transform: 'tY(50px)', position: 'absolute' },
            enter: { opacity: 1, transform: 'tY(0)', position: 'relative' },
            leave: { opacity: 0, transform: 'tY(50px)', position: 'absolute' },
            config: { tension: 50, friction: 10 },
            onRest: handleMove
        }
    );

    return (
        <section className="products">
            <div className="container">
                <div className="products__wrapper">
                    <div className="products__title">
                        {!parts[0] ? <h2>{t("hotMenu")}</h2> : <h2>{t("ourMenu")}</h2>}
                    </div>
                    {parts[0] &&
                        <div className="products__menu">
                            <ul>
                                <li><p onClick={() => handleMenuChange('all')} className={activeMenu === 'all' ? 'active' : ''}>{t("productsAll")}</p></li>
                                <li><p onClick={() => handleMenuChange('hamburger')} className={activeMenu === 'hamburger' ? 'active' : ''}>{t("productsBurger")}</p></li>
                                <li><p onClick={() => handleMenuChange('pizza')} className={activeMenu === 'pizza' ? 'active' : ''}>{t("productsPizza")}</p></li>
                                <li><p onClick={() => handleMenuChange('friesSides')} className={activeMenu === 'friesSides' ? 'active' : ''}>{t("productsFriesSides")}</p></li>
                                <li><p onClick={() => handleMenuChange('beverages')} className={activeMenu === 'beverages' ? 'active' : ''}>{t("productsBeverages")}</p></li>
                            </ul>
                        </div>
                    }
                    <div className="products__main">
                        {transitions((style, food) => {
                            const isFiltered = filteredProducts.includes(food);
                            const isNotExcluded = !movingItems.includes(food.id);
                            const shouldShow = !isChangingMenu && isFiltered && isNotExcluded;

                            return (
                                shouldShow && (
                                    <animated.div
                                        key={food.id}
                                        style={{ ...style, top: `${food.y}px`, left: `${food.x}px` }}
                                    >
                                        <Food
                                            {...food}
                                            onRemove={() => handleRemove(food.id)}
                                            isMoving={isMoving}
                                        />
                                    </animated.div>
                                )
                            );
                        })}
                    </div>

                    <div className="progress__btn-more">
                        {
                            !parts[0] ?
                                <Link className="btn" to='/menus'>{t("productsMoreBtn")}</Link>
                                :
                                !!(products[activeMenu].length > indexShow) && <button className="btn" onClick={moreHandler}>{t("productsMoreBtn")}</button>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Products;
