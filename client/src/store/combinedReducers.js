import { combineReducers } from "redux";
import usersReducers from "./usersSlice";
import ordersReducers from "./ordersSlice";

export default combineReducers({
  users: usersReducers,
  orders: ordersReducers,
});
