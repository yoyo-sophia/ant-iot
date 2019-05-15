import React, { Component } from "react";
import dva from "dva";
import { Input, Select, Card } from "antd";
import { connect } from "dva/index";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";

@connect(({ authority, loading }) => ({
  authority,
  tableLoading: loading.effects["authority/fetch_account_detail"]
}))

class account_detail extends Component {

  state = {
    selectedRows: [],
    curPartnerMenuList: [],
    accountDetailInfo: JSON.parse(localStorage.getItem("accountAuthorityDetail"))
  };

  columns = [{
    title: "序号",
    dataIndex: "menu_id"
  }, {
    title: "账号",
    dataIndex: "nickname"
  },
    {
      title: "拥有权限",
      dataIndex: "name"
    }];

  componentDidMount() {
    const { dispatch } = this.props;
    const { accountDetailInfo } = this.state;
    dispatch({
      type: "authority/fetch_account_detail",
      payload: {
        partner_id: accountDetailInfo.id
      }
    });
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
    const { authority: { accountDetailData }, tableLoading } = this.props;
    const { curPartnerMenuList, accountDetailInfo } = this.state;

    this.getItem(accountDetailData.data.rows);
    let newTableData = {
      rows: []
    };

    if (accountDetailData.data.rows.length) {
      let filterTable = curPartnerMenuList.filter(item => !item.is_top);
      newTableData = {
        rows: filterTable.filter(function(item, index, self) {
          return self.indexOf(item) === index;
        }).map((item, index) => {
          item.nickname = accountDetailInfo.nickname;
          item.id = index;
          return item;
        })
      };
    }

    return (
      <PageHeaderWrapper title="账号权限详情">
        <Card>
          <StandardTable
            selectedRows={[]}
            loading={tableLoading}
            data={newTableData}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    );

  }

}

export default account_detail;
