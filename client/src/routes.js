import App from './components/App'
import Home from './components/Home'
import Buckets from './components/Buckets'
import Bucket from './components/Bucket'
import SignUp from './components/SignUp';
import Login from './components/Login';
import Item from './components/Item'
import ItemForm from './components/ItemForm';


const routes = [
  {
      path: '/',
      element: <App />,
      children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "/signup",
            element: <SignUp />
          },
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/buckets",
            element: <Buckets />
          },
          {
            path: "/buckets/:id",
            element: <Bucket />
          },
          {
            path: "/buckets/:bucket_id/items/:id",
            element: <Item />
          },
          {
            path: "/items/:new",
            element: <ItemForm />
          }
          ]
  }
]

export default routes;