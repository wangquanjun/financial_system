export function auxiliaryTitleFilter(type=0,status){
  let title = '';
  if(type == 1){
    title = status==1?'客户选择':'客户';
  }else if(type == 2){
    title = status==1?'存货选择':'存货';
  }else if(type == 3){
    title = status==1?'供应商选择':'供应商';
  }else if(type == 4){
    title = status==1?'部门选择':'部门';
  }else if(type == 5){
    title = status==1?'项目选择':'项目';
  }else if(type == 6){
    title = status==1?'职员选择':'职员';
  }
  return title;
}
export function auxiliaryItemFilter(list=[]){
  let title = '';
  if(list.length>0){
    title = '-'+list.join('-')
  }
  return title;
}