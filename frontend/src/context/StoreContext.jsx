import { createContext, useEffect, useState } from "react";
import  axios  from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-del-backend-zgss.onrender.com"
  const [token,setToken] = useState("");
  const [food_list,setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));  //(for frontend to show that items are added)
    }
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});  //axios.post(url, data, config); and  (for database to make sure items added)
    }
  };

  const removeFromCart = async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 })); //(for frontend to show that items are removed)
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});  //axios.post(url, data, config); and (for database to make sure items removed)
    }
  };

  const getTotalCartAmount = ()=>{
     let totalAmount = 0;
     for(const item in cartItems){
      if(cartItems[item]>0){
        let itemInfo = food_list.find((product)=> product._id ===item);
        totalAmount += itemInfo.price * cartItems[item];
      }
     }
     return totalAmount;
  }

  const fetchFoodList =  async()=>{
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data);
    
  }

  //with this we can make sure after reload items which are added not reset
  const loadCartData = async (token)=>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
  }

  //if we reload our page then we will not logout
  useEffect(()=>{
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token")); 
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  },[])
  
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
