import React, { Component } from "react";
import dva from "dva";
import { Input, Select, Card } from "antd";
import { connect } from "dva/index";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";

@connect(({ authority, loading }) => ({
  authority,
  tableLoading: loading.effects['authority/fetch_account_detail']
}))

class account_detail extends Component {

  state = {
    selectedRows:[],
    curPartnerMenuList:[],
  };

  columns = [{
    title: "序号",
    dataIndex: "id"
  }, {
    title: "账号",
    dataIndex: "name"
  },
    {
      title: "拥有权限",
      dataIndex: "authorities"
    }];

  componentDidMount() {
    const { dispatch } = this.props;
    let detail_id = localStorage.getItem('accountAuthorityDetail');
    dispatch({
      type:'authority/fetch_account_detail',
      payload:{
        partner_id:detail_id
      }
    })
  };

  // 获取当前角色已有权限---扁平化数组
  getItem = (data) => {
    data.map(item => {
      if (!item.children) {
        this.state.curPartnerMenuList.push(item);
      } else {
        this.state.curPartnerMenuList.push(item);
        this.getItem(item.children);
      }
    });
  };

  render() {
    const { authority:{accountDetailData}, tableLoading } = this.props;
    const { selectedRows } = this.state;

    // 过滤table数据
    let filterAccountDetail = accountDetailData.data.rows.length ? this.getItem(accountDetailData.data.rows).filter(item => !item.is_top) : [];

    console.log(filterAccountDetail);

    return (
      <PageHeaderWrapper title="账号权限详情">
        <Card>
          <StandardTable
            selectedRows={selectedRows}
            loading={tableLoading}
            data={accountDetailData.data}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    );

  }

}

export default account_detail;
