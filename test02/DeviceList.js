DeviceList = [{
	Count:0,
	Name:'采集转码子系统_1',
	SubSys:'采集转码子系统',
	Time:'2015-05-22 00:00:00',
	AlarmStatus:'OFF',
	AlarmItem:[
		"CpuUsage", "NetUsage"//显示正在报警的监控项
	],
	Id:1,//子系统中的顺序，从1开始，递增1
	DeviceId:0,//设备ID,标志在数组中的顺序，从0开始，递增1
	// Ip:['172.17.120.139'],//有几个IP就往数组里写几个，用逗号隔开
	Ip:['192.168.109.70'],
	NetUsage:['15'],//有几个IP就往数组里写几个，可以瞎写
	NetStatus:['True'],//有几个IP就往数组里写几个
	ThresHold:{
		NetStatus:10,//替换为NetStatus
		CpuUsage:50,
		MemUsage:50,
		CpuTemp:90,
		NetUsage:80,
		AppModules:[//有几个要监测的软件，就写几个门限，按照excel中软件的顺序
			{
				ThreadNum:10,
				HandleNum:10,
				IOReadByte:20675,
				IOWriteByte:42233
			},
			{
				ThreadNum:10,
				HandleNum:10,
				IOReadByte:20675,
				IOWriteByte:42233
			}
		],
		Snmp:'False'
	},
	DeviceInfo:{
		DeviceType:'转码服务器',//这里名字随便起，转码服务器
		Room:1,//机房号，1代表新机房，多的那个，2代表男机房，就是综合设备间
		Box:18,//机柜序号
		BoxLocation:30,//在机柜中的位置
		DeviceHeight:10,//设备高度
		//CardLocation:xxx, 只有插卡类设备才有的参数
		Provider:'Bluetop',
		Remark:'None'
	},
	DeviceStatus:{
		CpuUsage:40,
		MemUsage:40,
		CpuTemp:80
	},
	AppModules:[//这里有几个软件，就写几个，跟上边软件门限处的数目和顺序保持一致
		{
			Name:'MediaConvert.exe',
			ThreadNum:'5',
			ThreadNumThr:10,
			HandleNum:'5',
			HandleNumThr:10,
			IORead:'100',
			IOWrite:'100',
			IOReadByte:'20672',
			IOReadByteThr:20675,
			IOWriteByte:'42232',
			IOWriteByteThr:42233,
			AlarmStatus:'OFF'
		},
		{
			Name:'MoveFileManager.exe',
			ThreadNum:'5',
			ThreadNumThr:10,
			HandleNum:'5',
			HandleNumThr:10,
			IORead:'100',
			IOWrite:'100',
			IOReadByte:'20672',
			IOReadByteThr:20675,
			IOWriteByte:'42232',
			IOWriteByteThr:42233,
			AlarmStatus:'OFF'
		}
	]
},
{
	Count:0,
	Name:'采集转码子系统_2',
	SubSys:'采集转码子系统',
	Time:'2015-05-22 00:00:00',
	AlarmStatus:'OFF',
	Id:2,//子系统中的顺序，从1开始，递增1
	DeviceId:1,//设备ID,标志在数组中的顺序，从0开始，递增1
	Ip:['172.17.115.1'],//有几个IP就往数组里写几个，用逗号隔开
	NetUsage:['15'],//有几个IP就往数组里写几个，可以瞎写
	NetStatus:['True'],//有几个IP就往数组里写几个
	ThresHold:{
		NetStatus:10,//替换为NetStatus
		CpuUsage:50,
		MemUsage:50,
		CpuTemp:90,
		NetUsage:80,
		AppModules:[//有几个要监测的软件，就写几个门限，按照excel中软件的顺序
			{
				ThreadNum:10,
				HandleNum:10,
				IOReadByte:20675,
				IOWriteByte:42233
			},
			{
				ThreadNum:10,
				HandleNum:10,
				IOReadByte:20675,
				IOWriteByte:42233
			}
		],
		Snmp:'False'
	},
	DeviceInfo:{
		DeviceType:'转码服务器',//这里名字随便起，转码服务器
		Room:1,//机房号，1代表新机房，多的那个，2代表男机房，就是综合设备间
		Box:19,//机柜序号
		BoxLocation:20,//在机柜中的位置
		DeviceHeight:10,//设备高度
		//CardLocation:xxx, 只有插卡类设备才有的参数
		Provider:'Bluetop',
		Remark:'None'
	},
	DeviceStatus:{
		CpuUsage:40,
		MemUsage:40,
		CpuTemp:80
	},
	AppModules:[//这里有几个软件，就写几个，跟上边软件门限处的数目和顺序保持一致
		{
			Name:'MediaConvert.exe',
			ThreadNum:'5',
			ThreadNumThr:10,
			HandleNum:'5',
			HandleNumThr:10,
			IORead:'100',
			IOWrite:'100',
			IOReadByte:'20672',
			IOReadByteThr:20675,
			IOWriteByte:'42232',
			IOWriteByteThr:42233,
			AlarmStatus:'OFF'
		},
		{
			Name:'MoveFileManager.exe',
			ThreadNum:'5',
			ThreadNumThr:10,
			HandleNum:'5',
			HandleNumThr:10,
			IORead:'100',
			IOWrite:'100',
			IOReadByte:'20672',
			IOReadByteThr:20675,
			IOWriteByte:'42232',
			IOWriteByteThr:42233,
			AlarmStatus:'OFF'
		}
	]
}
]

//输出放到最后
module.exports = DeviceList;