
需要兩個AI路由

api/v1/dialog
接受OPITON和POST request

Input範例1：

{
	topic: '到Subway點餐',
	history: [],
	prompt: '請問12吋蛋沙拉堡的英文怎麼說？'
}

Input範例2：

{
	topic: '到Subway點餐',
	history: ['請問12吋蛋沙拉堡的英文怎麼說？'],
	prompt: '我要如何跟店員說我在練英文？'
}

AI Output範例1(JSON)：

{
	topic: '到Subway點餐',
	response: '12吋蛋沙拉堡的英文，是12 inches egg mayo sub.'

}

AI Output範例2(JSON)：

{
	topic: '到Subway點餐',
	response: 'You can say to staff that "I\'m practicing English, please use English to response me, thank you."'

}



api/v1/step-hint
接受OPITON和POST request

Input範例：
(...待補)

Output範例(JSON)：

(...待補)