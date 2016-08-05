/**
 * Created by ryf on 2016/8/4.
 */
/**
 * Created by chent696 on 6/15/2015.
 */
define(function(require,exports){

    /// TextBox=0 �ı���
    /// TextArea=1 �ı���
    /// Hidden=2 �����ı���
    /// DropdownList=3 ������
    /// Radio=4 ��ѡ��ť
    /// CheckBox=5 ��ѡ��
    /// UserKey=6 ѡ�˿ؼ�
    /// DepartmentKey=7 ѡ���ſؼ�
    /// Calendar=8 �����ؼ�
    /// RichTextBox=9  ���ı��༭��
    /// Grid=10 �б�ؼ�
    /// MoneyBox=11 ���ؼ�
    /// UserInfoComponent=12 ��Ա������Ϣ��ʾ�ؼ�
    /// SubSet=13 �����ؼ�
    /// TextDescription=14 �ı�˵���ؼ�
    /// SplitLineBar=15 �ָ��߿ؼ�
    /// SumCalctor = 16 ���ϼƿؼ�
    /// VacationSummaryComponent=20 ����Ӧ�ü������
    /// OverTimeSummaryComponent=21 ����Ӧ�üӰ����
    /// CancelVavationSummaryComponent=22 ����Ӧ���������
    /// BudgetApplicationComponent = 30 [δʹ��:Ԥ���������(����Ԥ��ģ��)]
    /// BudgetVerifyComponent = 31 [δʹ��:Ԥ��������(����Ԥ��ģ��)]
    /// BudgetUsedComponent = 32   [δʹ��:Ԥ�㱨�����(����Ԥ��ģ��)]
    /// BudgetAdjustComponent = 33 [δʹ��:Ԥ��������(����Ԥ��ģ��)]
    /// PaymentPay = 34  �ѿ�-֧
    /// PaymentIncome = 35 �ѿ�-��
    /// punchforget = 40 ©��
    /// fieldwork = 41 ����
    /// CustomValueComponent=60 [δʹ��:�ͻ����ƿ�������ֵ���Ϳؼ�]
    /// CustomObjectComponent=61 [δʹ��:�ͻ����ƿ��������������Ϳؼ�(����չ�Ը�)]
    /// CustomTableCompoent=62 [δʹ��:�ͻ����ƿ���������Ϳؼ�(���Կؼ�)]
    /// CustomGroupComponent=63 [δʹ��:�ͻ����ƿ������ؼ���ؼ�(����Ϳؼ�������ǰ���ڿ������ʱ������ȡֵ)]
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