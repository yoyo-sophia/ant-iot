import react,{ Component } from 'react'
import connect from 'dva'
import { Card, Tree, Col, } from 'antd'
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

@connect(({ menu, authority, loading }) => ({
  authority,
  menuData: menu.menuData
}))

class api_setting extends Component{

  state = {

  };

  componentDidMount(){

  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && item.children.some(child => child.name)) {
      return (
        <TreeNode
          title={item.name}
          key={item.menu_id}>
          {this.getNavMenuItems(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.menu_id} isLeaf/>;
  };

  // 扁平化菜单数据
  getItem = (data) => {
    data.map(item => {
      if (!item.children) {
        this.state.newMenuList.push(item);
      } else {
        this.state.newMenuList.push(item);
        this.getItem(item.children);
      }
    });
  };



  render(){
    return(
      <PageHeaderWrapper title="接口设置">
        <Card>
          <div>api设置</div>
        </Card>
      </PageHeaderWrapper>
    )
  }

}

export default api_setting