�򵥵ı���֤



$('#form').easyValidate({
                    config:{
                        email:{
                            rules:[
                                {type:'required', errorTxt:'���䲻��Ϊ��'},
                                {type:'email', errorTxt:'���䲻�Ϸ�'}
                            ]
                        },
                        name:{
                            rules:[
                                {type:'required', errorTxt:'�ǳƲ���Ϊ��'},
                                {type:'length', min:5, max:15, errorTxt:'�ǳ���5~15λ�ַ����'}
                            ],
                            infoTxt:'����5~15Ӣ����ĸ'
                        },
		        phone:{
			   rules:[
				{type:'regex", regex:'^(13[0-9]{9})$', errorTxt:'�ֻ����벻�Ϸ�'}
                           ]
			}
                    },
                    button:$('.sbtn_big')��
		    display:{
			errorColor:'#da4141',
                	infoColor:'#d1ccc6',
                	opacity:0.8
		    },
	            position:'topRight'
                });