export function auxiliaryFilter(list=[]){
  let title = '';
  list.forEach(item=>{
    if(item == 1){
      title += '客户,';
    }else if(item == 2){
      title += '存货,';
    }else if(item == 3){
      title += '供应商,';
    }else if(item == 4){
      title += '部门,';
    }else if(item == 5){
      title += '项目,';
    }else if(item == 6){
      title += '职员,';
    }
  })
  if(title){
    title = title.substring(0,title.length-1)
  }
  return title;
}

export function directionFilter(type){
  let title = '';
  if(type == 1){
    title = '借';
  }else if(type == 2){
    title = '贷';
  }
  return title;
}

export function categoryFilter(type){
  let title = '';
  if(type == 1){
    title = '流动资产';
  }else if(type == 2){
    title = '非流动资产';
  }
  return title;
}
export function categoryEquityFilter(type){
  let title = '';
  if(type == 1){
    title = '所有者权益';
  }
  return title;
}
export function categoryCostFilter(type){
  let title = '';
  if(type == 1){
    title = '成本';
  }
  return title;
}
export function categoryProfitandlossFilter(type){
  let title = '';
  if(type == 1){
    title = '营业收入';
  }else if(type == 2){
    title = '期间费用';
  }else if(type == 3){
    title = '其它损失';
  }else if(type == 4){
    title = '营业成本及税金';
  }else if(type == 5){
    title = '以前年度损益调整';
  }else if(type == 6){
    title = '所得税';
  }else if(type == 7){
    title = '其它收益';
  }
  return title;
}
