IPTable = {//一直往下排
	'172.17.120.139':0,//这里的数值是DeviceList中的DeviceId值，按数组中元素的顺序一直往下排
	'172.17.115.1':1,//如果某台设备有多个IP的话，那么相同设备的IP对应的都是那个设备的DeviceId
	'192.168.109.70':0
}

module.exports = IPTable;