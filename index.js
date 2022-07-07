const mysql = require('mysql');
const inquirer = require('inquirer'); // 命令行用户交互
const colors = require('colors-console'); // 可改变控制台输出文本颜色
let promptList = [
    {
        type: "list",
        name: "env",
        message: "使用上下键选择要查询的环境后回车：",
        prefix: "",
        choices: [
            "env1",
            "env2",
            "env3",
            "env4",
        ],
    }, {
        type: "confirm",
        message: "直接回车可返回最新的三条OTP(如需查询更多条请输入y)",
        name: "queryMore",
        prefix: "",
        default: false,
    }, {
        type: "list",
        message: "使用上下键选择需要查询到的数据条数后回车：",
        name: "queryNumber",
        prefix: "",
        choices: [
            10,
            15,
            20,
            50,
        ],
        when: function (answer) {
            return answer.queryMore
        }
    },
];
// 32.1.169.*是我瞎编的IP，如有雷同纯属巧合，如有侵权，请联系本人删除，谢谢
const dataBaseConfig = {
    env1: {
        host: "32.1.169.53" // 32.1.169.53，可自行替换为相应测试环境的host IP地址
    },
    env2: {
        host: "32.1.169.54"
    },
    env3: {
        host: "32.1.169.55"
    },
    env4: {
        host: "32.1.169.56"
    },
};
function getOtp() {
    console.log(colors("cyan", "************************************ 欢迎使用OTP快捷查询工具 ************************************"));
    console.log(colors("cyan", "************************* Author：PengWanheng Email: vanhom_peng@163.com ************************"));

    inquirer.prompt(promptList).then(answer => {
        console.log(`您选择的环境是：${answer['env']}`);
        answer.queryMore && console.log(`希望查询到的数据条数：${answer['queryNumber']}`);
        const connection = mysql.createConnection({
            host: dataBaseConfig[answer['env']].host,	//连接的数据库地址。（默认:localhost）
            port: 3306,
            user: 'admin',		//mysql的连接用户名，换成自己的即可
            password: '123456',		// 对应用户的密码，换成自己的即可
            //database: 'test'  		//所需要连接的数据库的名称（可选）
        });
        connection.connect();
        connection.query(`SELECT t.otp_code,t.mobile_no FROM test.otp_table t order by id desc limit ${answer['queryNumber'] || 3};`, function (error, results, fields) {
            if (error){} throw error;
            console.table(results);
            setTimeout(() => { getOtp(); }, 1000); // 回调此方法，继续执行等待查询
        });
        connection.end()
    })
}
getOtp();

