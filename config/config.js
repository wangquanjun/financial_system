export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: true
      }
    ]
  ],
  routes: [
    {
      path: "/",
      component: "./user/login"
    },
    {
      path: "/crm",
      component: "./crm",
      routes: [
        {
          path: "/crm/home",
          component: "./home"
        },
        {
          path: "/crm/dashboard",
          component: "./dashboard"
        },
        {
          path: "/crm/role",
          component: "./role"
        },
        {
          path: "/crm/role/:id",
          component: "./role/$id.js"
        },
        {
          path: "/crm/user",
          component: "./user/list"
        },
        {
          path: "/crm/user/:id",
          component: "./user/$id.js"
        },
        {
          path: "/crm/worker",
          component: "./worker"
        },
        {
          path: "/crm/worker/:id",
          component: "./worker/$id.js"
        },
        {
          path: "/crm/voucher",
          component: "./voucher"
        },
        {
          path: "/crm/voucher/word",
          component: "./voucher/word.js"
        },
        {
          path: "/crm/voucher/list",
          component: "./voucher/list.js"
        },
        {
          path: "/crm/voucher/:id",
          component: "./voucher/$id.js"
        },
        {
          path: "/crm/auxiliary/customer",
          component: "./auxiliary/customer.js"
        },
        {
          path: "/crm/auxiliary/stock",
          component: "./auxiliary/stock.js"
        },
        {
          path: "/crm/auxiliary/supplier",
          component: "./auxiliary/supplier.js"
        },
        {
          path: "/crm/auxiliary/department",
          component: "./auxiliary/department.js"
        },
        {
          path: "/crm/auxiliary/project",
          component: "./auxiliary/project.js"
        },
        {
          path: "/crm/auxiliary/worker",
          component: "./auxiliary/worker.js"
        },
        {
          path: "/crm/subject/assets",
          component: "./subject/assets.js"
        },
        {
          path: "/crm/subject/liabilities",
          component: "./subject/liabilities.js"
        },
        {
          path: "/crm/subject/equity",
          component: "./subject/equity.js"
        },
        {
          path: "/crm/subject/cost",
          component: "./subject/cost.js"
        },
        {
          path: "/crm/subject/profitandloss",
          component: "./subject/profitandloss.js"
        }
      ]
    }
   
  ],
  cssLoaderOptions: {
    localIdentName: "[local]"
  },
  devServer: {
    proxy:{
        '/api':{
            target:'http://localhost:3010/',//mengchao
            pathRewrite: {'^/api': ''},
            changeOrigin: true
        }
    }
  },
  hash:true
};

