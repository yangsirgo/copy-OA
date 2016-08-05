/**
 * Created by ryf on 2016/8/4.
 */
/**
 * Created by chent696 on 6/15/2015.
 */
define(function(require,exports){

    /// TextBox=0 文本框
    /// TextArea=1 文本域
    /// Hidden=2 隐藏文本框
    /// DropdownList=3 下拉框
    /// Radio=4 单选按钮
    /// CheckBox=5 多选框
    /// UserKey=6 选人控件
    /// DepartmentKey=7 选部门控件
    /// Calendar=8 日历控件
    /// RichTextBox=9  富文本编辑框
    /// Grid=10 列表控件
    /// MoneyBox=11 金额控件
    /// UserInfoComponent=12 人员基础信息显示控件
    /// SubSet=13 级联控件
    /// TextDescription=14 文本说明控件
    /// SplitLineBar=15 分割线控件
    /// SumCalctor = 16 表格合计控件
    /// VacationSummaryComponent=20 数据应用假期组件
    /// OverTimeSummaryComponent=21 数据应用加班组件
    /// CancelVavationSummaryComponent=22 数据应用销假组件
    /// BudgetApplicationComponent = 30 [未使用:预算申请组件(财务预算模块)]
    /// BudgetVerifyComponent = 31 [未使用:预算核销组件(财务预算模块)]
    /// BudgetUsedComponent = 32   [未使用:预算报销组件(财务预算模块)]
    /// BudgetAdjustComponent = 33 [未使用:预算调整组件(财务预算模块)]
    /// PaymentPay = 34  费控-支
    /// PaymentIncome = 35 费控-收
    /// punchforget = 40 漏打卡
    /// fieldwork = 41 外勤
    /// CustomValueComponent=60 [未使用:客户定制开发，单值类型控件]
    /// CustomObjectComponent=61 [未使用:客户定制开发，对象属性型控件(可扩展性高)]
    /// CustomTableCompoent=62 [未使用:客户定制开发，表格型控件(个性控件)]
    /// CustomGroupComponent=63 [未使用:客户定制开发，控件组控件(组合型控件，便于前端在开发组件时处理交互取值)]
    ///bankSlip = 36
    var controlEnum = {
        "simpletextbox":0,
        "autoindex":19,
        "mutitextbox":1,
        "hidden":2,
        "selectoption":3,
        "select":3,
        "dropdown":3,
        "radio":4,
        "radiobutton":4,
        "checkbox":5,
        "selector":6,
        "userkey":6,
        "orgselector":7,
        "orgkey":7,
        "datetime":8,
        "calendar":8,
        "datepicker":8,
        "richtextbox":9,
        "customform":10,
        "customformnew":10,
        "grid":10,
        "list":10,
        "moneytextbox":11,
        "userinfocomponent":12,
        "subsetoption":13,
        "subset":13,
        "sumcalctor":16,
        "datediff":18,
        "rowautoserialno":19,
        "autoindex":19,
        "autocalculate":50,
        "vacationsummarycomponent":20,
        "overtimecomponent":21,
        "cancelvacationcomponent":22,
        "paymentpay":34,
        "paymentincome":35,
        "bankslip":36,
        "paymentreport":37,
        "punchforget":40,
        "fieldwork":41,
        "fullmember":42,
        "paymentapplication":1004,
        "paymentverification":1005,
        "paymentprojectapplication":1007,
        "paymentprojectverification":1008,
        "assetsReturned":24,
        "assetsReceived":23,
        "buOccupation":3201,
        "buVerification":3202,
        "buCost":3203
    };

    var controlDict = {
        "simpletextbox":"simpletextbox",
        //"sumcalctor":"simpletextbox",
        "autocalculate":"autocalculate",
        "autoindex":"autoindex",
        "mutitextbox": "mutitextbox",
        "hidden":"hidden",
        "selectoption":"selectoption",
        "select":"select",
        "radio":"radio",
        "checkbox":"checkbox",
        "selector":"selector",
        "userkey":"userkey",
        "orgselector":"orgselector",
        "orgkey":"orgkey",
        "datetime":"datetime",
        'rowautoserialno':'rowautoserialno',
        "calendar":"calendar",
        "richtextbox": "richtextbox",
        "customform":"customform",
        "customformnew":"customformnew",
        "grid":"grid",
        "list":"list",
        "moneytextbox":"moneytextbox",
        "userinfocomponent":"userinfocomponent",
        "subsetoption":"subsetoption",
        "subset":"subset",
        "vacationsummarycomponent":"vacationsummarycomponent",
        "overtimecomponent":"overtimecomponent",
        "cancelvacationcomponent":"cancelvacationcomponent",
        "paymentpay":"paymentpay",
        "paymentincome":"paymentincome",
        "sumcalctor":"sumcalctor",
        "bankslip":"bankslip",
        "paymentreport":"paymentreport",
        "punchforget":"punchforget",
        "fieldwork":"fieldwork",
        "fullmember":"fullmember",
        "datediff":"datediff",
        "paymentapplication":"paymentapplication",
        "paymentverification":"paymentverification",
        "paymentprojectapplication":"paymentprojectapplication",
        "paymentprojectverification":"paymentprojectverification",
        "assetsReturned":"assetsReturned",
        "assetsReceived":"assetsReceived",
        "buOccupation":"buOccupation",
        "buVerification":"buVerification",
        "buCost":"buCost"
    }
    exports.controlEnum = controlEnum;
    exports.controlDict = controlDict;
})