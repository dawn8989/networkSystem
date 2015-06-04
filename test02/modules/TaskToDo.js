TaskToDo = [
	{
		TaskId:1,
		Name:"本地_转码_1",
		Type:"1",
		InitTime:"2015-05-21 10:00:00",
		// StartTime:"2015-05-15 10:00:00",
		EndTime:"2015-05-21 17:59:59",
		Frequency:7200,
		NormalSize:700,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{
						Satellite:"中星6B",
						Repeater:"S16",
						Program:"宝贝家",
						CheckId:322,
						FileName:"中星6BCVS16 宝贝家",
						Url:"\\\\10.15.129.27\\cifs101\\322"
					},
					{
						Satellite:"中星6B",
						Repeater:"E16",
						Program:"车迷频道",
						CheckId:323,
						FileName:"中星6BCVE10 车迷频道",
						Url:"\\\\10.15.129.27\\cifs103\\323"
					}
				]
	},
	// {
	// 	TaskId:2,
	// 	Name:"数据中心_转码_2",
	// 	Type:"3",
	// 	InitTime:"2015-05-21 11:58:50",
	// 	// StartTime:"2015-05-15 11:58:50",
	// 	EndTime:"2015-05-21 15:30:00",
	// 	Frequency:14400,
	// 	NormalSize:600,
	// 	SizeThr:10,
	// 	LostTime:7200,
	// 	FileSavedTime:7,
	// 	// Flag:"True",//结束时间是否小于当前时间的标记位
	// 	Content:[
	// 				{
	// 					CheckId:210,
	// 					FileName:"中星6A 10A CCTV-1",
	// 					Url:"\\\\10.150.12.81\\video_file\\573weixing\\201505\\15\\210"
	// 				}
	// 			]
	// }
	{
		TaskId:2,
		Name:"本地_码流_3",
		Type:"2",
		InitTime:"2015-05-21 11:43:50",
		// StartTime:"2015-05-15 11:43:50",
		EndTime:"2015-05-21 15:30:00",
		Frequency:7200,
		NormalSize:600,
		SizeThr:10,
		LostTime:7200,
		FileSavedTime:7,
		// Flag:"True",//结束时间是否小于当前时间的标记位
		Content:[
					{	
						Satellite:"中星6A",
						Repeater:"11A",
						Tsfile:"新疆走出去",
						CheckId:1235,
						FileName:"中星6A 11A 新疆走出去",
						Url:"\\\\172.17.18.228\\fs1\\SaveTs\\1235\\Real\\20150515"
					}
				]
	}
]

module.exports = TaskToDo;