简单的表单验证



$('#form').easyValidate({
                    config:{
                        email:{
                            rules:[
                                {type:'required', errorTxt:'邮箱不能为空'},
                                {type:'email', errorTxt:'邮箱不合法'}
                            ]
                        },
                        name:{
                            rules:[
                                {type:'required', errorTxt:'昵称不能为空'},
                                {type:'length', min:5, max:15, errorTxt:'昵称由5~15位字符组成'}
                            ],
                            infoTxt:'输入5~15英文字母'
                        },
		        phone:{
			   rules:[
				{type:'regex", regex:'^(13[0-9]{9})$', errorTxt:'手机号码不合法'}
                           ]
			}
                    },
                    button:$('.sbtn_big')，
		    display:{
			errorColor:'#da4141',
                	infoColor:'#d1ccc6',
                	opacity:0.8
		    },
	            position:'topRight'
                });