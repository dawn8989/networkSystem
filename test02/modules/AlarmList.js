AlarmList = [
	{//把设备类型也加上
		DeviceName:'采集转码子系统_1',
		SubSys:'采集转码子系统',//所属子系统
		DeviceType:'转码服务器',//设备类型
		StartTime:'2015-05-22 00:00:00',
		Status:'True',
		Room:1,
		Box:23,
		BoxLocation:33,
		DeviceHeight:4,
		Source:['172.17.115.2', 'ThreadNum', 'MediaConvert.exe', "100", "80"],//把门限值也写进去,80是门限值,100是实测值
		Desc:'线程数过高',//只对软件报警的情况出现
		Solution:'检查机器性能'//只对软件报警的情况出现
	}
]

module.exports = AlarmList;

//例子
// {//把设备类型也加上
// 		DeviceName:
// 		SubSys://所属子系统
// 		DeviceType://设备类型
// 		StartTime:
// 		EndTime:
// 		Status:
// 		Source:[IP, AlarmType, AlarmValue]
// 		Source有两类：
// 		Source:[ip1, "线程数(报警类型)", "进程名如QQ", "100", "80"]//把门限值也写进去,80是门限值，100是实测值
// 		Source:[ip2, "CpuUsage", "20"]//这种情况是设备报警，IP有好几个
// 		Source:[ip3, "NetStatus", "连续ping不通的次数"]
// 		Source:[ip4, "LockStatus", "PortNum的值"]
//		Desc:'线程数过高',//只对软件报警的情况出现
//		Solution:'检查机器性能'//只对软件报警的情况出现

// }