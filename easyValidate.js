(function($) {
    $.fn.easyValidate = function(option) {
        var setting = {
            position:'topRight',
            display:{
                errorColor:'#da4141',
                infoColor:'#d1ccc6',
                opacity:0.8
            }
        };

        $.extend(setting, option);
        var me = this;
        var elements = new Array();
        var executor = {};

        var init = function(){
            for (var elementKey in setting.config) {
                elements.push(wrap(elementKey));
            }
        };

        var wrap = function(key) {
            var $element = me.find('#'+key);
            var _param = setting.config[key];

            if(_param.infoTxt) {
                $element.focus(function() {
                    buildInfoTxt($(this), _param.infoTxt);
                });
            }

            var tagName = $element[0].tagName.toLocaleLowerCase();
            var tagType = $element.attr('type').toLowerCase();

            if('input' == tagName && 'text' == tagType || 'textarea' == tagName)  {
                $element.blur(function() {
                    validate();
                });
            }

            var validate = (function(){
                var index = 0;
                var promptTxt = '';
                var next = function(){
                    var rule = _param.rules[index++];
                    if(rule) {
                        var isValidate = executeRule($element, rule);
                        if(!isValidate) {
                            promptTxt = promptTxt + rule.errorTxt + '<br />';
                        }
                        return isValidate & next();
                    }

                    return true;
                };

                return function(){
                    index = 0;
                    promptTxt = '';
                    removePrompt($element);
                    var result = next();
                    if(!result) {
                        bulidErrorTxt($element, promptTxt);
                    }

                    return result;
                };
            })();

            return {
                element:$element,
                validate:validate
            };
        };


        executor['required'] = function($element, rule) {
            var type = elementType($element);
            switch (type) {
                case 'text':
                    var value = $element.val();
                    var placeholder = $element.attr('placeholder');
                    return $.trim(value) ? (value == placeholder ? false : true)  : false;
                case 'textarea':
                    var value  = $element.val() || $element.text();
                    var placeholder = $element.attr('placeholder');
                    return $.trim(value) ? (value == placeholder ? false : true)  : false;
                case 'select':
                    var value = $element.val();
                    return value > 0;
                case 'checkbox':
                    return $element.attr('checked') ? true : false;
                default :
                    return true;
            }
        };

        executor['length'] = function($element, rule) {
            var value = $element.val() || $element.text();

            return !value || (!rule.min || value.length >= rule.min) && (!rule.max || rule.length <= rule.max)
        };

        executor['email'] = function ($element, rule) {
            var value = $element.val() || $element.text();
            return !value || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
        }

        executor['regex'] = function($element, rule) {
            var value = $element.val() || $element.text();
            var express = new RegExp(rule.regex);
            return !value || express.test(value);
        };

        /*
        *return the element type
        * */
        function elementType($element) {
            var tagName = $element[0].tagName.toLowerCase();
            var tagType = $element.attr('type').toLowerCase();

            if('input' == tagName)
                return tagType;
            else
                return tagName;
        };

        function executeRule($element, rule, next) {
            var result = executor[rule.type]($element, rule);

            return result;
        }

        function buildInfoTxt($element, infoTxt) {
            removePrompt($element);

            var divInfo = $('<div></div>');
            divInfo.addClass('prompt');
            divInfo.addClass('prompt_info_'+$element.attr('id'));
            $('body').append(divInfo);

            var divContent =  $('<div></div>');
            divContent.addClass('prompt_content');
            divInfo.append(divContent);
            divContent.html(infoTxt);

            var divArrow = $('<div></div>');
            for(var i = 10; i >=1; i--)
            {
                divArrow.append('<div class="line'+i+'"><!-- --></div>');
            }
            divArrow.addClass('prompt_arrow');
            divInfo.append(divArrow);


            divContent.css('background', setting.display.infoColor);
            divArrow.find('div').css('background', setting.display.infoColor);


            positionPrompt($element, divInfo);
        }

        function bulidErrorTxt($element, errorTxt) {
            removePrompt($element);

            var divError = $('<div></div>');
            divError.addClass('prompt');
            divError.addClass('prompt_error_'+$element.attr('id'));
            $('body').append(divError);

            var divContent =  $('<div></div>');
            divContent.addClass('prompt_content');
            divError.append(divContent);
            divContent.html(errorTxt);

            var divArrow = $('<div></div>');
            for(var i = 10; i >=1; i--)
            {
                divArrow.append('<div class="line'+i+'"><!-- --></div>');
            }
            divArrow.addClass('prompt_arrow');
            divError.append(divArrow);


             divContent.css('background', setting.display.errorColor);
             divArrow.find('div').css('background', setting.display.errorColor);


            positionPrompt($element, divError);
        }

        function positionPrompt($element, divPrompt)
        {
            // GET EACH ELEMENTS DIMENSIONS AND POSITION
            var fieldWidth = $element.width();
            var fieldHeight = $element.height();
            var fieldTopPosition = $element.offset().top;
            var fieldLeftPosition = $element.offset().left;

            // GET PROMPT POSITION DEPENDENT ON SETTINGS
            if( setting.position == 'topRight'){
                fieldTopPosition = fieldTopPosition - divPrompt.height();
                fieldLeftPosition = fieldLeftPosition + fieldWidth - 30;
            }
            if( setting.position == 'topLeft'){
                fieldTopPosition = fieldTopPosition - divPrompt.height();
                fieldLeftPosition = fieldLeftPosition;
            }

            // DEFINE LAYOUT WITH CSS
            divPrompt.css({
                position : 'absolute',
                top : fieldTopPosition,
                left : fieldLeftPosition,
                opacity : 0
            });

            // SHOW PROMPT
            return divPrompt.animate({
                opacity : setting.display.opacity
            });
        }


        function removePrompt ($element) {
            $('.prompt_error_'+$element.attr('id')).remove();
            $('.prompt_info_'+$element.attr('id')).remove();
        }

        init();
        setting.button.click(function(){
            var validated = true;
            elements.forEach(function(element) {
                validated = validated & element.validate();
            });

            if(validated) {
                if(setting.success && 'function' == setting.success)
                setting.success.call(setting.btn);
            }
        });
    };
    $.easyValidate = function(element, option) {
        return element.easyValidate(option);
    };
})(jQuery);